import { useCallback, useRef, useState } from 'react'
import { Upload, ImagePlus } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function DropZone() {
  const { addFiles, compressState } = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCountRef = useRef(0)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return
      if (compressState === 'running' || compressState === 'paused') return
      addFiles(Array.from(fileList))
    },
    [addFiles, compressState]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCountRef.current++
    if (dragCountRef.current === 1) {
      setIsDragging(true)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCountRef.current--
    if (dragCountRef.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCountRef.current = 0
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleClick = useCallback(() => {
    if (compressState === 'running' || compressState === 'paused') return
    inputRef.current?.click()
  }, [compressState])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
      e.target.value = ''
    },
    [handleFiles]
  )

  const isDisabled = compressState === 'running' || compressState === 'paused'

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300
        ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
        ${isDragging
          ? 'border-emerald-400 bg-emerald-400/10 scale-[1.01]'
          : 'border-slate-600 bg-slate-800/50 hover:border-emerald-500/50 hover:bg-slate-800'
        }
        py-12 px-8
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.bmp,.gif,.avif,.tiff,.tif,image/jpeg,image/png,image/webp,image/bmp,image/gif,image/avif,image/tiff"
        onChange={handleInputChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4">
        <div className={`
          rounded-2xl p-4 transition-all duration-300
          ${isDragging ? 'bg-emerald-400/20' : 'bg-slate-700/50'}
        `}>
          {isDragging ? (
            <ImagePlus className="w-10 h-10 text-emerald-400" />
          ) : (
            <Upload className="w-10 h-10 text-slate-400" />
          )}
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-200">
            {isDragging ? '松开即可添加' : '拖拽图片到此处，或点击选择'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            支持 JPG / PNG / WebP / BMP / GIF / AVIF / TIFF，可多选
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            GIF 动图仅保留首帧
          </p>
        </div>
      </div>
    </div>
  )
}
