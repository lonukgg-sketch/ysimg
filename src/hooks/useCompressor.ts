import { useCallback, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { compressImage } from '@/utils/compressor'

export function useCompressor() {
  const abortRef = useRef<AbortController | null>(null)
  const pausedRef = useRef(false)
  const resumeResolveRef = useRef<(() => void) | null>(null)

  const start = useCallback(async () => {
    const { compressState } = useStore.getState()
    if (compressState === 'running') return

    const pendingFiles = useStore.getState().files.filter((f) => f.status === 'pending')
    if (pendingFiles.length === 0) return

    const { setCompressState, setCurrentIndex, updateFile } = useStore.getState()
    setCompressState('running')
    pausedRef.current = false
    abortRef.current = new AbortController()

    for (let i = 0; i < pendingFiles.length; i++) {
      const fileItem = pendingFiles[i]

      // 检查是否暂停
      if (pausedRef.current) {
        await new Promise<void>((resolve) => {
          resumeResolveRef.current = resolve
        })
        resumeResolveRef.current = null
      }

      // 检查是否取消
      if (abortRef.current.signal.aborted) break

      setCurrentIndex(i + 1)
      updateFile(fileItem.id, { status: 'compressing' })

      try {
        // 实时读取最新 config
        const { config } = useStore.getState()
        const result = await compressImage(
          fileItem.file,
          config,
          abortRef.current.signal
        )

        if (abortRef.current.signal.aborted) {
          updateFile(fileItem.id, { status: 'pending' })
          break
        }

        updateFile(fileItem.id, {
          status: 'done',
          compressedSize: result.blob.size,
          compressedBlob: result.blob,
        })
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') {
          updateFile(fileItem.id, { status: 'pending' })
          break
        }
        updateFile(fileItem.id, {
          status: 'failed',
          error: err instanceof Error ? err.message : '压缩失败',
        })
      }

      // 让浏览器喘口气，有利于 GC
      await new Promise((r) => setTimeout(r, 0))
    }

    if (abortRef.current && !abortRef.current.signal.aborted) {
      setCompressState('done')
    }
    abortRef.current = null
  }, [])

  const pause = useCallback(() => {
    const { compressState, setCompressState } = useStore.getState()
    if (compressState !== 'running') return
    pausedRef.current = true
    setCompressState('paused')
  }, [])

  const resume = useCallback(() => {
    const { compressState, setCompressState } = useStore.getState()
    if (compressState !== 'paused') return
    pausedRef.current = false
    setCompressState('running')
    resumeResolveRef.current?.()
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    pausedRef.current = false
    resumeResolveRef.current?.()
    const { setCompressState } = useStore.getState()
    setCompressState('idle')
  }, [])

  return { start, pause, resume, cancel }
}
