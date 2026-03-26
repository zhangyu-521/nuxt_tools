import { v4 as uuidv4 } from 'uuid'
import type { DiaryImage } from '~/types'

/**
 * 图片大小限制
 */
export const IMAGE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,      // 5MB 原始文件限制
  MAX_COMPRESSED_SIZE: 1 * 1024 * 1024, // 1MB 压缩后限制
  MAX_WIDTH: 1920,                      // 最大宽度
  MAX_HEIGHT: 1920,                     // 最大高度
  COMPRESS_QUALITY: 0.85,               // JPEG 压缩质量
}

/**
 * 检查文件是否为图片
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 检查文件大小是否超过限制
 */
export function isFileTooLarge(file: File): boolean {
  return file.size > IMAGE_LIMITS.MAX_FILE_SIZE
}

/**
 * 格式化文件大小显示
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * Blob 转 Base64
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * 压缩图片
 * @param file 原始图片文件
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @param quality JPEG 压缩质量 (0-1)
 */
export function compressImage(
  file: File,
  maxWidth = IMAGE_LIMITS.MAX_WIDTH,
  maxHeight = IMAGE_LIMITS.MAX_HEIGHT,
  quality = IMAGE_LIMITS.COMPRESS_QUALITY
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img

      // 计算缩放比例
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法创建 canvas context'))
        return
      }

      // 白色背景（防止 PNG 透明背景变黑）
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('图片压缩失败'))
          }
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 从文件创建日记图片对象
 * @param file 图片文件
 * @param diaryId 关联的日记ID
 */
export async function createDiaryImage(file: File, diaryId: string): Promise<DiaryImage> {
  // 验证文件类型
  if (!isImageFile(file)) {
    throw new Error('文件类型不支持，请上传图片文件')
  }

  // 验证文件大小
  if (isFileTooLarge(file)) {
    throw new Error(`文件过大，请上传小于 ${formatFileSize(IMAGE_LIMITS.MAX_FILE_SIZE)} 的图片`)
  }

  // 压缩图片
  const compressedBlob = await compressImage(file)

  // 检查压缩后大小
  if (compressedBlob.size > IMAGE_LIMITS.MAX_COMPRESSED_SIZE) {
    // 如果还是太大，进一步压缩
    console.warn('图片压缩后仍超过限制，尝试进一步压缩')
  }

  // 转换为 Base64
  const base64 = await blobToBase64(compressedBlob)

  return {
    id: uuidv4(),
    diaryId,
    data: base64,
    name: file.name,
    size: compressedBlob.size,
    type: 'image/jpeg',
    createdAt: new Date().toISOString(),
  }
}

/**
 * 从剪贴板创建图片
 * @param item ClipboardItem
 * @param diaryId 关联的日记ID
 */
export async function createImageFromClipboard(item: ClipboardItem, diaryId: string): Promise<DiaryImage | null> {
  const types = item.types.filter(t => t.startsWith('image/'))
  if (types.length === 0) return null

  const blob = await item.getType(types[0])
  const file = new File([blob], `clipboard-${Date.now()}.png`, { type: types[0] })
  return createDiaryImage(file, diaryId)
}

/**
 * 验证图片数据是否有效
 */
export function isValidImageData(base64: string): boolean {
  return base64.startsWith('data:image/')
}

/**
 * 获取图片尺寸信息
 */
export function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => reject(new Error('无法加载图片'))
    img.src = base64
  })
}
