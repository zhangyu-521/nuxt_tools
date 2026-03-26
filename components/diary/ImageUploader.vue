<template>
  <div class="space-y-3">
    <!-- Upload Area -->
    <div
      ref="dropZone"
      class="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center transition-all duration-200 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 cursor-pointer"
      :class="{
        'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDragging,
        'pointer-events-none opacity-50': uploading
      }"
      @click="triggerFileInput"
      @dragenter.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Upload Icon -->
      <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
        <svg v-if="!uploading" class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <svg v-else class="w-6 h-6 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Upload Text -->
      <p v-if="!uploading" class="text-sm text-gray-600 dark:text-gray-300">
        <span class="font-medium text-primary-600">点击上传</span> 或拖拽图片到这里
      </p>
      <p v-else class="text-sm text-gray-600 dark:text-gray-300">
        正在处理 {{ uploadingCount }}/{{ totalCount }} 张图片...
      </p>
      <p class="text-xs text-gray-400 mt-1">
        支持 JPG、PNG、GIF，单张最大 5MB
      </p>
      <p class="text-xs text-gray-400">
        也可直接 <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-gray-500">Ctrl+V</kbd> 粘贴图片
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createDiaryImage } from '~/utils/image'
import type { DiaryImage } from '~/types'

const props = defineProps<{
  diaryId: string
}>()

const emit = defineEmits<{
  upload: [images: DiaryImage[]]
  error: [message: string]
}>()

const fileInput = ref<HTMLInputElement>()
const dropZone = ref<HTMLElement>()
const isDragging = ref(false)
const uploading = ref(false)
const uploadingCount = ref(0)
const totalCount = ref(0)
const error = ref('')

function triggerFileInput() {
  if (uploading.value) return
  fileInput.value?.click()
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    await processFiles(files)
  }
  // 清空 input 以允许重复选择同一文件
  target.value = ''
}

async function handleDrop(event: DragEvent) {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || [])
    .filter(file => file.type.startsWith('image/'))
  if (files.length > 0) {
    await processFiles(files)
  }
}

async function processFiles(files: File[]) {
  error.value = ''
  uploading.value = true
  totalCount.value = files.length
  uploadingCount.value = 0

  const images: DiaryImage[] = []

  for (const file of files) {
    try {
      const image = await createDiaryImage(file, props.diaryId)
      images.push(image)
      uploadingCount.value++
    } catch (e) {
      console.error('图片处理失败:', e)
      error.value = e instanceof Error ? e.message : '图片处理失败'
      emit('error', error.value)
    }
  }

  uploading.value = false

  if (images.length > 0) {
    emit('upload', images)
  }
}

async function handlePaste(e: ClipboardEvent) {
  if (!dropZone.value) return

  // 检查焦点是否在编辑器内
  const activeElement = document.activeElement
  const isInTextarea = activeElement?.tagName === 'TEXTAREA'

  // 如果正在编辑文本，不处理粘贴
  if (isInTextarea) return

  const items = e.clipboardData?.items
  if (!items) return

  const files: File[] = []

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        files.push(file)
      }
    }
  }

  if (files.length > 0) {
    e.preventDefault()
    await processFiles(files)
  }
}

onMounted(() => {
  document.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste)
})
</script>
