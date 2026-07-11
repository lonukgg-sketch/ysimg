import { useStore } from '@/store/useStore'
import { formatFileSize } from '@/utils/compressor'

export default function ProgressBar() {
  const { files } = useStore()

  const total = files.length
  const done = files.filter((f) => f.status === 'done').length
  const failed = files.filter((f) => f.status === 'failed').length
  const processed = done + failed
  const progress = total > 0 ? (processed / total) * 100 : 0

  const originalTotal = files.reduce((sum, f) => sum + f.originalSize, 0)
  const compressedTotal = files
    .filter((f) => f.compressedSize !== undefined)
    .reduce((sum, f) => sum + (f.compressedSize ?? 0), 0)
  const saved = originalTotal - compressedTotal

  if (total === 0) return null

  const isLarger = saved < 0

  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-4">
      {/* 进度条 */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 统计信息 */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <span className="text-slate-400">
            已处理 <span className="text-slate-200 font-semibold">{processed}</span> / {total}
          </span>
          {failed > 0 && (
            <span className="text-red-400">
              失败 {failed}
            </span>
          )}
        </div>
        <div className="flex items-center gap-6">
          {compressedTotal > 0 && (
            <>
              <span className="text-slate-400">
                压缩后 <span className="text-emerald-400 font-semibold">{formatFileSize(compressedTotal)}</span>
              </span>
              <span className="text-slate-400">
                {isLarger ? (
                  <>体积增大 <span className="text-amber-400 font-semibold">{formatFileSize(Math.abs(saved))}</span></>
                ) : (
                  <>节省 <span className="text-emerald-400 font-semibold">{formatFileSize(saved)}</span></>
                )}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
