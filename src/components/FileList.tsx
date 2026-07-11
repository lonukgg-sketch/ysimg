import { useStore } from '@/store/useStore'
import { Images } from 'lucide-react'
import FileItem from './FileItem'

export default function FileList() {
  const { files } = useStore()

  if (files.length === 0) {
    return (
      <div className="h-full rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col items-center justify-center py-20">
        <div className="p-4 bg-slate-700/30 rounded-2xl mb-4">
          <Images className="w-10 h-10 text-slate-600" />
        </div>
        <p className="text-slate-500 text-sm">添加图片后在此显示列表</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 overflow-hidden flex flex-col h-full">
      {/* 表头 */}
      <div className="grid grid-cols-[48px_1fr_100px_100px_80px_80px] gap-3 px-5 py-3 border-b border-slate-700/50 bg-slate-800/80 flex-shrink-0">
        <div></div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">文件名</div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">原始大小</div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">压缩后</div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">压缩率</div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">状态</div>
      </div>

      {/* 文件列表 */}
      <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  )
}
