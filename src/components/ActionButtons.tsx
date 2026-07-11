import { useCallback, useState } from 'react'
import JSZip from 'jszip'
import { Play, Pause, Square, Download, Trash2, RotateCcw, Loader2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useCompressor } from '@/hooks/useCompressor'

export default function ActionButtons() {
  const { files, compressState, clearFiles, resetCompress } = useStore()
  const { start, pause, resume, cancel } = useCompressor()
  const [packing, setPacking] = useState(false)

  const hasFiles = files.length > 0
  const hasPending = files.some((f) => f.status === 'pending')
  const hasCompressing = files.some((f) => f.status === 'compressing')
  const doneFiles = files.filter((f) => f.status === 'done' && f.compressedBlob)
  // 全部压缩完成后才显示下载按钮（没有等待中和压缩中的文件）
  const allDone = files.length > 0 && !hasPending && !hasCompressing

  // 生成不重复的文件名列表，重复时添加 _1, _2 后缀
  const resolveDuplicateNames = (names: string[]): string[] => {
    const used = new Map<string, number>()
    return names.map((name) => {
      if (!used.has(name)) {
        used.set(name, 1)
        return name
      }
      const count = used.get(name)! + 1
      used.set(name, count)
      const base = name.replace(/\.\w+$/, '')
      const ext = name.match(/\.\w+$/)?.[0] || ''
      return `${base}_${count}${ext}`
    })
  }

  const handleDownloadAll = useCallback(async () => {
    if (doneFiles.length === 0) return

    setPacking(true)
    try {
      // 输出格式非 original 时，需要替换扩展名
      const { config } = useStore.getState()
      const getOutputName = (f: typeof doneFiles[0]) => {
        if (config.outputFormat === 'original') return f.name
        const base = f.name.replace(/\.\w+$/, '')
        const extMap: Record<string, string> = { jpeg: '.jpg', png: '.png', webp: '.webp', avif: '.avif' }
        return base + (extMap[config.outputFormat] || '.jpg')
      }

      const outputNames = resolveDuplicateNames(doneFiles.map(getOutputName))

      if (doneFiles.length === 1) {
        const f = doneFiles[0]
        const url = URL.createObjectURL(f.compressedBlob!)
        const a = document.createElement('a')
        a.href = url
        a.download = outputNames[0]
        a.click()
        URL.revokeObjectURL(url)
        return
      }

      // 多张打包 ZIP
      const zip = new JSZip()
      for (let i = 0; i < doneFiles.length; i++) {
        zip.file(outputNames[i], doneFiles[i].compressedBlob!)
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'compressed_images.zip'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setPacking(false)
    }
  }, [doneFiles])

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {compressState === 'idle' && hasPending && (
          <button
            onClick={start}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-colors"
          >
            <Play className="w-4 h-4" />
            开始压缩
          </button>
        )}

        {compressState === 'running' && (
          <button
            onClick={pause}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-colors"
          >
            <Pause className="w-4 h-4" />
            暂停
          </button>
        )}

        {compressState === 'paused' && (
          <button
            onClick={resume}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-colors"
          >
            <Play className="w-4 h-4" />
            继续
          </button>
        )}

        {(compressState === 'running' || compressState === 'paused') && (
          <button
            onClick={cancel}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-400 rounded-xl transition-colors"
          >
            <Square className="w-4 h-4" />
            取消
          </button>
        )}

        {compressState === 'done' && hasPending && (
          <button
            onClick={resetCompress}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重新压缩
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {allDone && doneFiles.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={packing}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/25 rounded-xl transition-colors disabled:opacity-50"
          >
            {packing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {packing ? '打包中...' : `打包下载 (${doneFiles.length}张)`}
          </button>
        )}

        {hasFiles && compressState !== 'running' && compressState !== 'paused' && (
          <button
            onClick={clearFiles}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-600 text-slate-400 hover:border-red-500 hover:text-red-400 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        )}
      </div>
    </div>
  )
}
