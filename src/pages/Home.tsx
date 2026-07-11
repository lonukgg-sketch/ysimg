import DropZone from '@/components/DropZone'
import ConfigPanel from '@/components/ConfigPanel'
import FileList from '@/components/FileList'
import ProgressBar from '@/components/ProgressBar'
import ActionButtons from '@/components/ActionButtons'
import { ImageDown } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* 顶部标题 */}
      <header className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <ImageDown className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">YSIMG</h1>
            <p className="text-xs text-slate-500">批量图片压缩 · 本地处理 · 隐私安全</p>
          </div>
        </div>
      </header>

      {/* 主内容 - 左右布局 */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6">
        <div className="flex gap-6 h-full">
          {/* 左侧 1/3：上传 + 配置 + 操作 */}
          <div className="w-1/3 flex flex-col gap-5 flex-shrink-0">
            <DropZone />
            <ConfigPanel />
            <ProgressBar />
            <ActionButtons />
          </div>

          {/* 右侧 2/3：文件列表 */}
          <div className="w-2/3 min-w-0">
            <FileList />
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="border-t border-slate-800/50 mt-auto flex-shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 py-4 text-center text-xs text-slate-600">
          所有图片仅在浏览器本地处理，不会上传至任何服务器
        </div>
      </footer>
    </div>
  )
}
