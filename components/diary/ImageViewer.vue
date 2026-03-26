<template>
  <div class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50" @click.self="close">
    <!-- Close Button -->
    <button
      @click="close"
      class="absolute top-4 right-4 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all z-10"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Navigation - Previous -->
    <button
      v-if="images.length > 1"
      @click.stop="prev"
      class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Navigation - Next -->
    <button
      v-if="images.length > 1"
      @click.stop="next"
      class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Image Container -->
    <div class="max-w-[90vw] max-h-[80vh] flex flex-col items-center">
      <img
        :src="currentImage?.data"
        :alt="currentImage?.name"
        class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
        @click.stop
      />

      <!-- Info Bar -->
      <div class="mt-4 flex items-center gap-4 text-white/70">
        <span class="text-sm">{{ currentIndex + 1 }} / {{ images.length }}</span>
        <span class="text-sm">{{ currentImage?.name }}</span>
        <span v-if="currentImage" class="text-sm">{{ formatFileSize(currentImage.size) }}</span>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 ml-4">
          <button
            @click.stop="download"
            class="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="下载"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            @click.stop="confirmDelete"
            class="p-2 rounded-lg hover:bg-red-500/50 text-red-400 hover:text-red-300 transition-colors"
            title="删除"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Thumbnails -->
    <div
      v-if="images.length > 1"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/50 rounded-xl overflow-x-auto max-w-[90vw]"
    >
      <button
        v-for="(image, index) in images"
        :key="image.id"
        @click.stop="goTo(index)"
        class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all"
        :class="index === currentIndex ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'"
      >
        <img :src="image.data" :alt="image.name" class="w-full h-full object-cover" />
      </button>
    </div>

    <!-- Delete Confirm Modal -->
    <div
      v-if="showDeleteConfirm"
      class="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm mx-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">确认删除</h3>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          确定要删除这张图片吗？删除后无法恢复。
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            @click="executeDelete"
            class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiaryImage } from '~/types'
import { formatFileSize } from '~/utils/image'

const props = defineProps<{
  images: DiaryImage[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  close: []
  delete: [imageId: string]
}>()

const currentIndex = ref(props.initialIndex || 0)
const showDeleteConfirm = ref(false)

const currentImage = computed(() => props.images[currentIndex.value])

function close() {
  emit('close')
}

function prev() {
  currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1
}

function next() {
  currentIndex.value = currentIndex.value === props.images.length - 1 ? 0 : currentIndex.value + 1
}

function goTo(index: number) {
  currentIndex.value = index
}

function download() {
  if (!currentImage.value) return
  const link = document.createElement('a')
  link.href = currentImage.value.data
  link.download = currentImage.value.name
  link.click()
}

function confirmDelete() {
  showDeleteConfirm.value = true
}

function executeDelete() {
  if (currentImage.value) {
    emit('delete', currentImage.value.id)
    showDeleteConfirm.value = false
    // 如果删除后还有图片，调整索引
    if (props.images.length <= 1) {
      close()
    } else if (currentIndex.value >= props.images.length - 1) {
      currentIndex.value = props.images.length - 2
    }
  }
}

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'ArrowLeft') {
    prev()
  } else if (e.key === 'ArrowRight') {
    next()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>
