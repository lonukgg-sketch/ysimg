import type { CompressConfig, OutputFormat } from '@/store/useStore'

function getOutputMimeType(
  originalType: string,
  outputFormat: OutputFormat
): string {
  switch (outputFormat) {
    case 'jpeg': return 'image/jpeg'
    case 'png': return 'image/png'
    case 'webp': return 'image/webp'
    case 'avif': return 'image/avif'
    case 'original':
    default:
      if (originalType === 'image/png') return 'image/png'
      if (originalType === 'image/webp') return 'image/webp'
      if (originalType === 'image/avif') return 'image/avif'
      // BMP/GIF/TIFF 等浏览器不支持编码的格式，统一输出为 PNG（无损）
      if (originalType === 'image/bmp' || originalType === 'image/gif' || originalType === 'image/tiff') return 'image/png'
      return 'image/jpeg'
  }
}

function getOutputExtension(
  originalName: string,
  outputFormat: OutputFormat
): string {
  switch (outputFormat) {
    case 'jpeg': return '.jpg'
    case 'png': return '.png'
    case 'webp': return '.webp'
    case 'avif': return '.avif'
    case 'original':
    default:
      return originalName.match(/\.\w+$/)?.[0] || '.jpg'
  }
}

export interface CompressResult {
  blob: Blob
  width: number
  height: number
  outputName: string
}

export async function compressImage(
  file: File,
  config: CompressConfig,
  signal?: AbortSignal
): Promise<CompressResult> {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

  const bitmap = await createImageBitmap(file)
  if (signal?.aborted) {
    bitmap.close()
    throw new DOMException('Aborted', 'AbortError')
  }

  let { width, height } = bitmap

  // 如果设置了尺寸限制（非空），按宽/高分别计算缩放
  if (config.maxWidth && width > config.maxWidth) {
    const ratio = config.maxWidth / width
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }
  if (config.maxHeight && height > config.maxHeight) {
    const ratio = config.maxHeight / height
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')!

  const mimeType = getOutputMimeType(file.type, config.outputFormat)
  // PNG 无损，不设 quality；其余格式使用 quality 参数
  const quality = mimeType === 'image/png' ? undefined : config.quality / 100

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

  const compressedBlob = await canvas.convertToBlob({
    type: mimeType,
    quality,
  })

  const ext = getOutputExtension(file.name, config.outputFormat)
  const baseName = file.name.replace(/\.\w+$/, '')
  const outputName = baseName + ext

  return {
    blob: compressedBlob,
    width,
    height,
    outputName,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

export function calcCompressionRate(original: number, compressed: number): string {
  if (original === 0) return '0%'
  const rate = (1 - compressed / original) * 100
  if (rate < 0) return '+' + Math.abs(rate).toFixed(1) + '%'
  return rate.toFixed(1) + '%'
}
