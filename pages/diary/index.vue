<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold gradient-text">日记</h1>
      <div class="flex items-center gap-2">
        <NuxtLink to="/" class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 transition-all hover:scale-105" title="返回首页">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </NuxtLink>
        <NuxtLink :to="`/diary/${today}`" class="btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          写日记
        </NuxtLink>
      </div>
    </div>

    <!-- Tags Filter -->
    <div v-if="diaryStore.allTags.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="tag in diaryStore.allTags"
        :key="tag"
        @click="toggleTag(tag)"
        class="px-3 py-1.5 text-sm rounded-full transition-all duration-200"
        :class="selectedTags.includes(tag)
          ? 'tag'
          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'"
      >
        #{{ tag }}
      </button>
      <button v-if="selectedTags.length > 0" @click="selectedTags = []" class="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors px-2">
        清除
      </button>
    </div>

    <!-- Diary List -->
    <div v-if="diaryStore.loading" class="text-center py-12">
      <div class="w-12 h-12 mx-auto rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
      <p class="text-gray-400 mt-4">加载中...</p>
    </div>

    <div v-else-if="filteredDiaries.length === 0" class="text-center py-16 text-gray-400">
      <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <p>{{ selectedTags.length > 0 ? '没有符合条件的日记' : '还没有日记，开始记录吧' }}</p>
    </div>

    <div v-else class="space-y-4">
      <NuxtLink v-for="diary in filteredDiaries" :key="diary.id" :to="`/diary/${diary.date}`" class="card block overflow-hidden group">
        <div class="flex items-start gap-4 p-5">
          <!-- Mood Emoji -->
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center text-4xl shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
            {{ getMoodEmoji(diary.mood) }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-2">
              <div>
                <div class="font-semibold text-lg text-gray-900 dark:text-gray-100">{{ formatDateDisplay(diary.date) }}</div>
                <div class="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ diary.location || '无位置' }}
                </div>
              </div>
              <div class="text-xs text-gray-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatDateTime(diary.updatedAt) }}
              </div>
            </div>

            <p class="text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{{ diary.content || '暂无内容' }}</p>

            <div v-if="diary.tags.length > 0" class="flex flex-wrap gap-1.5">
              <span v-for="tag in diary.tags" :key="tag" class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400">#{{ tag }}</span>
            </div>
          </div>

          <!-- Arrow -->
          <div class="self-center text-gray-300 group-hover:text-primary-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiaryStore } from '~/stores/diary'
import { getToday, formatDateTime } from '~/utils/date'

const diaryStore = useDiaryStore()
const selectedTags = ref<string[]>([])
const today = getToday()

const filteredDiaries = computed(() => {
  if (selectedTags.value.length === 0) {
    return diaryStore.diaries
  }
  return diaryStore.diaries.filter(diary =>
    selectedTags.value.some(tag => diary.tags.includes(tag))
  )
})

function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

function getMoodEmoji(mood: number): string {
  const emojis = ['😢', '😕', '😐', '🙂', '😄']
  return emojis[mood - 1] || '😐'
}

function formatDateDisplay(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${month}月${day}日 ${weekdays[d.getDay()]} ${year}`
}

onMounted(() => {
  diaryStore.fetchDiaries()
})
</script>