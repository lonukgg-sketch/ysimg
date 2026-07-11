import { create } from 'zustand'

export type FileStatus = 'pending' | 'compressing' | 'done' | 'failed'

export interface ImageFile {
  id: string
  file: File
  name: string
  originalSize: number
  compressedSize?: number
  compressedBlob?: Blob
  status: FileStatus
  error?: string
  thumbnailUrl?: string
}

export type OutputFormat = 'original' | 'jpeg' | 'png' | 'webp' | 'avif'

export interface CompressConfig {
  quality: number
  outputFormat: OutputFormat
  maxWidth: number | ''
  maxHeight: number | ''
}

export type CompressState = 'idle' | 'running' | 'paused' | 'done'

interface StoreState {
  files: ImageFile[]
  config: CompressConfig
  compressState: CompressState
  currentIndex: number

  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  updateFile: (id: string, updates: Partial<ImageFile>) => void
  setConfig: (config: Partial<CompressConfig>) => void
  setCompressState: (state: CompressState) => void
  setCurrentIndex: (index: number) => void
  resetCompress: () => void
}

export const useStore = create<StoreState>((set) => ({
  files: [],
  config: {
    quality: 70,
    outputFormat: 'original',
    maxWidth: '',
    maxHeight: '',
  },
  compressState: 'idle',
  currentIndex: 0,

  addFiles: (newFiles) =>
    set((state) => {
      const imageFiles: ImageFile[] = newFiles
        .filter((f) => /\.(jpe?g|png|webp|bmp|gif|avif|tiff?)$/i.test(f.name))
        .map((f) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          file: f,
          name: f.name,
          originalSize: f.size,
          status: 'pending' as FileStatus,
        }))
      return { files: [...state.files, ...imageFiles] }
    }),

  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),

  clearFiles: () => set({ files: [], compressState: 'idle', currentIndex: 0 }),

  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  setConfig: (config) =>
    set((state) => ({ config: { ...state.config, ...config } })),

  setCompressState: (compressState) => set({ compressState }),

  setCurrentIndex: (currentIndex) => set({ currentIndex }),

  resetCompress: () =>
    set((state) => ({
      files: state.files.map((f) => ({
        ...f,
        status: 'pending' as FileStatus,
        compressedSize: undefined,
        compressedBlob: undefined,
        error: undefined,
      })),
      compressState: 'idle',
      currentIndex: 0,
    })),
}))
