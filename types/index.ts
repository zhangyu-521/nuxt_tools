export interface Diary {
  id: string
  date: string
  content: string
  mood: 1 | 2 | 3 | 4 | 5
  location?: string
  tags: string[]
  images?: string[]   // 图片 ID 数组（可选，兼容旧数据）
  createdAt: string
  updatedAt: string
}

export interface DiaryImage {
  id: string          // 图片唯一ID
  diaryId: string     // 关联的日记ID
  data: string        // Base64 编码的图片数据
  name: string        // 原始文件名
  size: number        // 文件大小（字节）
  type: string        // MIME type
  createdAt: string   // 创建时间
}

export interface Todo {
  id: string
  content: string
  date: string
  completed: boolean
  tags: string[]
  createdAt: string
}

export interface MonthStats {
  month: string
  totalTodos: number
  completedTodos: number
  completionRate: number
  avgMood: number
  diaryCount: number
}

export interface AppSettings {
  theme: 'light' | 'dark'
  language: string
}

export interface ExportData {
  version: string     // 版本号 "2.0.0"
  exportDate: string
  diaries: Diary[]
  todos: Todo[]
  images?: DiaryImage[]  // 新增图片数据（可选，兼容旧导出）
}

export interface QueryOptions {
  startDate?: string
  endDate?: string
  tags?: string[]
  limit?: number
  offset?: number
}
