<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold gradient-text">搜索日记</h1>
    </div>

    <!-- Search Input -->
    <div class="relative">
      <input
        ref="searchInput"
        v-model="query"
        type="text"
        placeholder="搜索日记内容或标签..."
        class="input pl-12 pr-12 py-4 text-lg"
        @keyup.enter="search"
      />
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button v-if="query" @click="clearSearch" class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Results -->
    <div v-if="loading" class="text-center py-12">
      <div class="w-12 h-12 mx-auto rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
      <p class="text-gray-400 mt-4">搜索中...</p>
    </div>

    <div v-else-if="results.length === 0 && hasSearched" class="text-center py-16 text-gray-400">
      <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <p>没有找到相关日记</p>
    </div>

    <div v-else-if="results.length > 0" class="space-y-4">
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        找到 {{ results.length }} 篇日记
      </div>

      <NuxtLink v-for="diary in results" :key="diary.id" :to="`/diary/${diary.date}`" class="card block overflow-hidden group">
        <div class="flex items-start gap-4 p-5">
          <!-- Mood Emoji -->
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
            {{ getMoodEmoji(diary.mood) }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="font-semibold text-lg text-gray-900 dark:text-gray-100">{{ formatDateDisplay(diary.date) }}</div>
              <div class="text-gray-300 group-hover:text-primary-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <p class="text-gray-600 dark:text-gray-300 line-clamp-2 mb-3" v-html="highlightQuery(diary.content) || '暂无内容'" />

            <div v-if="diary.tags.length > 0" class="flex flex-wrap gap-1.5">
              <span v-for="tag in diary.tags" :key="tag" class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400">#{{ tag }}</span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiaryStore } from '~/stores/diary'

const route = useRoute()
const diaryStore = useDiaryStore()

const query = ref('')
const results = ref<typeof diaryStore.diaries>([])
const loading = ref(false)
const hasSearched = ref(false)
const searchInput = ref<HTMLInputElement>()

onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q as string
    search()
  }
  searchInput.value?.focus()
})

async function search() {
  if (!query.value.trim()) return

  loading.value = true
  hasSearched.value = true

  try {
    results.value = await diaryStore.searchDiaries(query.value)
  } finally {
    loading.value = false
  }
}

function clearSearch() {
  query.value = ''
  results.value = []
  hasSearched.value = false
  searchInput.value?.focus()
}

function getMoodEmoji(mood: number): string {
  const emojis = ['😢', '😕', '😐', '🙂', '😄']
  return emojis[mood - 1] || '😐'
}

function formatDateDisplay(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${year}年${month}月${day}日 ${weekdays[d.getDay()]}`
}

function highlightQuery(content: string): string {
  if (!query.value || !content) return content
  const regex = new RegExp(`(${query.value})`, 'gi')
  return content.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600/50 px-1 rounded">$1</mark>')
}
</script>
