<template>
  <div v-if="images.length > 0" class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        图片 ({{ images.length }})
      </label>
      <button
        v-if="images.length > 0"
        @click="showDeleteAll = true"
        class="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        删除全部
      </button>
    </div>

    <!-- Image Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="(image, index) in images"
        :key="image.id"
        class="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-slate-700"
        @click="openViewer(index)"
      >
        <!-- Image -->
        <img
          :src="image.data"
          :alt="image.name"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div class="flex items-center gap-2">
            <button
              @click.stop="downloadImage(image)"
              class="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white transition-colors"
              title="下载"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              @click.stop="confirmDelete(image)"
              class="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500 transition-colors"
              title="删除"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- File Size Badge -->
        <div class="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] bg-black/50 text-white rounded">
          {{ formatFileSize(image.size) }}
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <Teleport to="body">
      <DiaryImageViewer
        v-if="viewerOpen"
        :images="images"
        :initial-index="viewerIndex"
        @close="viewerOpen = false"
        @delete="deleteImage"
      />
    </Teleport>

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showDeleteConfirm = false">
        <div class="card p-6 w-full max-w-sm mx-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">确认删除</h3>
          </div>
          <p class="text-sm text-gray-500 mb-6">
            确定要删除这张图片吗？删除后无法恢复。
          </p>
          <div class="flex gap-3">
            <button @click="showDeleteConfirm = false" class="flex-1 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
              取消
            </button>
            <button @click="executeDelete" class="flex-1 px-4 py-2.5 btn-danger">
              确认删除
            </button>
          </div>
        </div>
      </div>

      <!-- Delete All Confirm Modal -->
      <div v-if="showDeleteAll" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showDeleteAll = false">
        <div class="card p-6 w-full max-w-sm mx-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">确认删除全部</h3>
          </div>
          <p class="text-sm text-gray-500 mb-6">
            确定要删除全部 {{ images.length }} 张图片吗？删除后无法恢复。
          </p>
          <div class="flex gap-3">
            <button @click="showDeleteAll = false" class="flex-1 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
              取消
            </button>
            <button @click="deleteAll" class="flex-1 px-4 py-2.5 btn-danger">
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { DiaryImage } from '~/types'
import { formatFileSize } from '~/utils/image'

const props = defineProps<{
  images: DiaryImage[]
}>()

const emit = defineEmits<{
  delete: [imageId: string]
  'delete-all': []
}>()

const viewerOpen = ref(false)
const viewerIndex = ref(0)
const showDeleteConfirm = ref(false)
const showDeleteAll = ref(false)
const imageToDelete = ref<string>('')

function openViewer(index: number) {
  viewerIndex.value = index
  viewerOpen.value = true
}

function confirmDelete(image: DiaryImage) {
  imageToDelete.value = image.id
  showDeleteConfirm.value = true
}

function executeDelete() {
  if (imageToDelete.value) {
    emit('delete', imageToDelete.value)
    showDeleteConfirm.value = false
    imageToDelete.value = ''
  }
}

function deleteImage(imageId: string) {
  emit('delete', imageId)
}

function deleteAll() {
  emit('delete-all')
  showDeleteAll.value = false
}

function downloadImage(image: DiaryImage) {
  const link = document.createElement('a')
  link.href = image.data
  link.download = image.name
  link.click()
}
</script>
