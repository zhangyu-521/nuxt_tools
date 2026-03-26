<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <NuxtLink :to="backLink" class="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 transition-all hover:scale-105 flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{{ pageTitle }}</h1>
      </div>
      <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button v-if="diaryId" @click="confirmDelete" class="p-2 sm:p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all hover:scale-105">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button @click="save" :disabled="saving" class="btn-primary text-sm sm:text-base px-3 sm:px-4">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>

    <!-- Editor -->
    <div class="card space-y-6 p-6 overflow-hidden">
      <!-- Date Display -->
      <div class="flex items-center gap-2 text-gray-500 text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formatDateDisplay(date) }}
      </div>

      <!-- Mood -->
      <div class="p-5 bg-gray-50 dark:bg-slate-700/30 rounded-2xl">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          今日心情
        </label>
        <DiaryMoodSelector v-model="mood" />
      </div>

      <!-- Location -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          位置（可选）
        </label>
        <div class="flex gap-2">
          <div class="relative flex-1">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input v-model="location" type="text" placeholder="添加位置..." class="input pl-12" />
          </div>
          <button
            @click="getLocation"
            :disabled="geoLoading"
            class="px-4 py-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex items-center gap-2 disabled:opacity-50"
            title="获取当前位置"
          >
            <svg v-if="geoLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="hidden sm:inline">定位</span>
          </button>
        </div>
        <p v-if="geoError" class="mt-2 text-sm text-red-500">{{ geoError }}</p>
      </div>

      <!-- Content -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          日记内容
        </label>
        <textarea v-model="content" rows="12" placeholder="记录今天的心情..." class="input resize-none" />
      </div>

      <!-- Images Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          图片
        </label>
        <!-- Image Gallery (if has images) -->
        <DiaryImageGallery
          v-if="images.length > 0"
          :images="images"
          class="mb-3"
          @delete="handleDeleteImage"
          @delete-all="handleDeleteAllImages"
        />

        <!-- Image Uploader -->
        <DiaryImageUploader
          :diary-id="diaryId || tempDiaryId || 'temp-' + date"
          @upload="handleImagesUploaded"
          @error="handleImageError"
        />
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          标签
        </label>
        <div class="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
          <span v-for="tag in tags" :key="tag" class="tag flex items-center gap-1">
            #{{ tag }}
            <button @click="removeTag(tag)" class="hover:text-primary-800 dark:hover:text-primary-300 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
          <input v-model="tagInput" type="text" placeholder="添加标签，按回车确认" class="flex-1 bg-transparent border-0 focus:ring-0 text-sm dark:text-gray-100 min-w-[60px] w-full" @keyup.enter="addTag" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiaryStore } from '~/stores/diary'
import type { DiaryImage } from '~/types'

const route = useRoute()
const router = useRouter()
const diaryStore = useDiaryStore()
const storage = useStorage()

const date = route.params.date as string
const from = route.query.from as string | undefined

// 根据来源决定返回链接
const backLink = computed(() => {
  if (from === 'calendar') {
    return '/calendar'
  }
  return '/diary'
})
const diaryId = ref('')
const mood = ref(3)
const location = ref('')
const content = ref('')
const tags = ref<string[]>([])
const tagInput = ref('')
const saving = ref(false)

// Images
const images = ref<DiaryImage[]>([])
const tempDiaryId = ref('')

// Geolocation
const { location: geoLocation, loading: geoLoading, error: geoError, getCurrentPosition } = useGeolocation()

async function getLocation() {
  try {
    await getCurrentPosition()
    if (geoLocation.value) {
      location.value = geoLocation.value
    }
  } catch {
    // Error handled by composable
  }
}

const pageTitle = computed(() => {
  const today = getToday()
  if (date === today) return '今日日记'
  return '写日记'
})

function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${year}年${month}月${day}日 ${weekdays[d.getDay()]}`
}

function addTag() {
  const trimmed = tagInput.value.trim()
  if (trimmed && !tags.value.includes(trimmed)) {
    tags.value.push(trimmed)
    tagInput.value = ''
  }
}

function removeTag(tag: string) {
  const index = tags.value.indexOf(tag)
  if (index > -1) {
    tags.value.splice(index, 1)
  }
}

// Image handlers
function handleImagesUploaded(newImages: DiaryImage[]) {
  images.value.push(...newImages)
}

function handleImageError(message: string) {
  alert(message)
}

async function handleDeleteImage(imageId: string) {
  try {
    await storage.deleteImage(imageId)
    images.value = images.value.filter(img => img.id !== imageId)
  } catch (e) {
    alert('删除图片失败')
  }
}

async function handleDeleteAllImages() {
  try {
    for (const image of images.value) {
      await storage.deleteImage(image.id)
    }
    images.value = []
  } catch (e) {
    alert('删除图片失败')
  }
}

async function save() {
  saving.value = true
  try {
    // 先保存日记获取日记ID
    const savedDiary = await diaryStore.saveDiary({
      id: diaryId.value || undefined,
      date: String(date),
      mood: Number(mood.value),
      location: location.value ? String(location.value) : undefined,
      content: String(content.value),
      tags: [...tags.value.map(String)],
      images: images.value.map(img => img.id),
    })

    // 使用保存后的日记ID更新图片关联
    const currentDiaryId = savedDiary.id

    // 保存所有图片到 IndexedDB（确保图片被持久化）
    for (const image of images.value) {
      if (image.diaryId !== currentDiaryId) {
        image.diaryId = currentDiaryId
      }
      await storage.saveImage(image)
    }

    // 根据来源决定跳转目标
    router.push(from === 'calendar' ? '/calendar' : '/diary')
  } catch (e) {
    console.error('Save error:', e)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!confirm('确定要删除这篇日记吗？')) return
  try {
    // 删除关联的图片
    if (diaryId.value) {
      await storage.deleteImagesByDiary(diaryId.value)
    }
    await diaryStore.deleteDiary(diaryId.value)
    // 根据来源决定跳转目标
    router.push(from === 'calendar' ? '/calendar' : '/diary')
  } catch (e) {
    alert('删除失败')
  }
}

onMounted(async () => {
  // 先从 store 的 getter 尝试获取（可能已经有缓存）
  let existing = diaryStore.getDiaryByDate(date)

  // 如果 store 中没有，从 IndexedDB 获取
  if (!existing) {
    await diaryStore.fetchDiaryByDate(date)
    existing = diaryStore.currentDiary
  }

  if (existing) {
    diaryId.value = existing.id
    mood.value = existing.mood
    location.value = existing.location || ''
    content.value = existing.content
    tags.value = [...existing.tags]

    // 加载关联的图片
    if (existing.images && existing.images.length > 0) {
      const loadedImages: DiaryImage[] = []
      for (const imageId of existing.images) {
        const image = await storage.getImage(imageId)
        if (image) {
          loadedImages.push(image)
        }
      }
      images.value = loadedImages
    }
  }

  // 如果没有位置信息，自动获取
  if (!location.value) {
    try {
      await getCurrentPosition()
      if (geoLocation.value) {
        location.value = geoLocation.value
      }
    } catch {
      // 自动获取失败不显示错误，用户可手动点击获取
    }
  }
})
</script>
