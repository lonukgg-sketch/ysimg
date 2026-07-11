import { useEffect, useState } from 'react'
import { X, Loader2, Check, AlertCircle } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatFileSize, calcCompressionRate } from '@/utils/compressor'
import type { ImageFile } from '@/store/useStore'

interface Props {
  file: ImageFile
}

export default function FileItem({ file }: Props) {
  const { removeFile, compressState } = useStore()
  const [thumbUrl, setThumbUrl] = useState<string>('')

  useEffect(() => {
    if (file.thumbnailUrl) {
      setThumbUrl(file.thumbnailUrl)
      return
    }
    const url = URL.createObjectURL(file.file)
    setThumbUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file.file, file.thumbnailUrl])

  const canRemove = compressState === 'idle' || compressState === 'done'

  const statusMap = {
    pending: { label: '等待', color: 'text-slate-500', icon: null },
    compressing: { label: '压缩中', color: 'text-emerald-400', icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
    done: { label: '完成', color: 'text-emerald-400', icon: <Check className="w-3.5 h-3.5" /> },
    failed: { label: '失败', color: 'text-red-400', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  }

  const status = statusMap[file.status]

  return (
    <div className={`
      grid grid-cols-[48px_1fr_100px_100px_80px_80px] gap-3 px-5 py-3 items-center
      border-b border-slate-700/30 transition-colors
      ${file.status === 'compressing' ? 'bg-emerald-500/5' : 'hover:bg-slate-700/20'}
    `}>
      {/* 缩略图 */}
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
        {thumbUrl && (
          <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      {/* 文件名 */}
      <div className="min-w-0">
        <p className="text-sm text-slate-200 truncate">{file.name}</p>
        {file.error && <p className="text-xs text-red-400 truncate">{file.error}</p>}
      </div>

      {/* 原始大小 */}
      <div className="text-sm text-slate-400 text-right font-mono">
        {formatFileSize(file.originalSize)}
      </div>

      {/* 压缩后大小 */}
      <div className="text-sm text-right font-mono">
        {file.compressedSize !== undefined ? (
          <span className="text-emerald-400">{formatFileSize(file.compressedSize)}</span>
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </div>

      {/* 压缩率 */}
      <div className="text-sm text-right font-mono">
        {file.compressedSize !== undefined ? (
          <span className={file.compressedSize > file.originalSize ? 'text-amber-400' : 'text-emerald-400'}>
            {calcCompressionRate(file.originalSize, file.compressedSize)}
          </span>
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </div>

      {/* 状态 */}
      <div className="flex items-center justify-center gap-1.5">
        <span className={`text-xs ${status.color}`}>{status.icon}</span>
        <span className={`text-xs ${status.color}`}>{status.label}</span>
        {canRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); removeFile(file.id) }}
            className="ml-1 text-slate-600 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
