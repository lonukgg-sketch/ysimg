import { useStore } from '@/store/useStore'
import type { OutputFormat } from '@/store/useStore'
import { Settings2 } from 'lucide-react'

export default function ConfigPanel() {
  const { config, setConfig, compressState } = useStore()
  const isDisabled = compressState === 'running' || compressState === 'paused'

  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">压缩设置</h3>
      </div>

      <div className="space-y-5">
        {/* 质量滑块 */}
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">输出质量</span>
            <span className="text-sm font-mono text-emerald-400">{config.quality}%</span>
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={config.quality}
            onChange={(e) => setConfig({ quality: Number(e.target.value) })}
            disabled={isDisabled}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-600">高压缩</span>
            <span className="text-xs text-slate-600">高质量</span>
          </div>
        </div>

        {/* 输出格式 */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">输出格式</label>
          <select
            value={config.outputFormat}
            onChange={(e) => setConfig({ outputFormat: e.target.value as OutputFormat })}
            disabled={isDisabled}
            className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          >
            <option value="original">保持原格式</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="avif">AVIF</option>
          </select>
        </div>

        {/* 最大尺寸 - 输入框为空则不限制 */}
        <div>
          <p className="text-sm text-slate-400 mb-2">限制最大尺寸</p>
          <p className="text-xs text-slate-600 mb-2">留空表示不限制，填入数值则限制对应方向</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 w-6">宽</span>
              <input
                type="number"
                value={config.maxWidth}
                onChange={(e) => setConfig({ maxWidth: e.target.value === '' ? '' : Number(e.target.value) })}
                disabled={isDisabled}
                placeholder="不限"
                className="flex-1 bg-slate-700/80 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50 placeholder:text-slate-600"
              />
              <span className="text-xs text-slate-500">px</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 w-6">高</span>
              <input
                type="number"
                value={config.maxHeight}
                onChange={(e) => setConfig({ maxHeight: e.target.value === '' ? '' : Number(e.target.value) })}
                disabled={isDisabled}
                placeholder="不限"
                className="flex-1 bg-slate-700/80 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50 placeholder:text-slate-600"
              />
              <span className="text-xs text-slate-500">px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
