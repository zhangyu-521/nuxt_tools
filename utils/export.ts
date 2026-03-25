import type { ExportData, Diary, Todo } from '~/types'

export function exportToJSON(diaries: Diary[], todos: Todo[]): string {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    diaries,
    todos,
  }
  return JSON.stringify(data, null, 2)
}

export function downloadJSON(json: string, filename: string): void {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function parseImportJSON(json: string): ExportData {
  const data = JSON.parse(json) as ExportData

  // Validate version
  if (!data.version) {
    throw new Error('Invalid export file: missing version')
  }

  // Validate arrays
  if (!Array.isArray(data.diaries) || !Array.isArray(data.todos)) {
    throw new Error('Invalid export file: missing diaries or todos')
  }

  return data
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}
