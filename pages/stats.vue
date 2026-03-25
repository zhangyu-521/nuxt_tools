<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold gradient-text">数据统计</h1>
      </div>
      <div class="flex items-center gap-2">
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          class="hidden"
          @change="handleFileImport"
        />
        <button @click="triggerImport" class="btn-secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          导入数据
        </button>
        <button @click="exportData" class="btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出数据
        </button>
      </div>
    </div>

    <!-- Month Selector -->
    <div class="flex items-center justify-center gap-4">
      <button @click="prevMonth" class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="text-lg font-bold text-gray-900 dark:text-gray-100 min-w-[120px] text-center">{{ displayMonth }}</div>
      <button @click="nextMonth" class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="stat-card group">
        <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="text-2xl font-bold gradient-text">{{ stats.diaryCount }}</div>
        <div class="text-xs text-gray-400">日记篇数</div>
      </div>
      <div class="stat-card group">
        <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{{ stats.completionRate }}%</div>
        <div class="text-xs text-gray-400">待办完成率</div>
      </div>
      <div class="stat-card group">
        <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div class="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{{ stats.totalTodos }}</div>
        <div class="text-xs text-gray-400">总待办</div>
      </div>
      <div class="stat-card group">
        <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div class="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">{{ stats.avgMood }}</div>
        <div class="text-xs text-gray-400">平均心情</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="card p-6">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="font-semibold text-gray-900 dark:text-gray-100">心情趋势</h2>
      </div>
      <div ref="moodChartRef" class="w-full h-64" />
    </div>

    <div class="card p-6">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="font-semibold text-gray-900 dark:text-gray-100">待办完成情况</h2>
      </div>
      <div ref="todoChartRef" class="w-full h-64" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiaryStore } from '~/stores/diary'
import { useTodoStore } from '~/stores/todo'
import { getCurrentMonth } from '~/utils/date'
import * as echarts from 'echarts'
import { exportToJSON, downloadJSON, parseImportJSON, readFileAsText } from '~/utils/export'

const diaryStore = useDiaryStore()
const todoStore = useTodoStore()
const storage = useStorage()

const currentMonth = ref(getCurrentMonth())
const moodChartRef = ref<HTMLElement>()
const todoChartRef = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

const displayMonth = computed(() => {
  const [year, month] = currentMonth.value.split('-').map(Number)
  return `${year}年${month}月`
})

const stats = computed(() => {
  const monthDiaries = diaryStore.diaries.filter(d => d.date.startsWith(currentMonth.value))
  const todoStats = todoStore.getStatsByMonth(currentMonth.value)
  const avgMood = monthDiaries.length > 0
    ? (monthDiaries.reduce((sum, d) => sum + d.mood, 0) / monthDiaries.length).toFixed(1)
    : '-'

  return {
    diaryCount: monthDiaries.length,
    completionRate: todoStats.completionRate,
    totalTodos: todoStats.total,
    avgMood,
    diaries: monthDiaries,
  }
})

function prevMonth() {
  const [year, month] = currentMonth.value.split('-').map(Number)
  const newMonth = month === 1 ? 12 : month - 1
  const newYear = month === 1 ? year - 1 : year
  currentMonth.value = `${newYear}-${String(newMonth).padStart(2, '0')}`
}

function nextMonth() {
  const [year, month] = currentMonth.value.split('-').map(Number)
  const newMonth = month === 12 ? 1 : month + 1
  const newYear = month === 12 ? year + 1 : year
  currentMonth.value = `${newYear}-${String(newMonth).padStart(2, '0')}`
}

function initMoodChart() {
  if (!moodChartRef.value) return

  const chart = echarts.init(moodChartRef.value)
  const diaries = stats.value.diaries.sort((a, b) => a.date.localeCompare(b.date))

  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: diaries.map(d => d.date.slice(8)),
      axisLine: { lineStyle: { color: '#94a3b8' } },
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 5,
      axisLine: { lineStyle: { color: '#94a3b8' } },
    },
    series: [{
      data: diaries.map(d => d.mood),
      type: 'line',
      smooth: true,
      lineStyle: { color: '#0ea5e9', width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(14, 165, 233, 0.3)' },
          { offset: 1, color: 'rgba(14, 165, 233, 0.05)' },
        ]),
      },
      itemStyle: { color: '#0ea5e9' },
    }],
  }

  chart.setOption(option)
  return chart
}

function initTodoChart() {
  if (!todoChartRef.value) return

  const chart = echarts.init(todoChartRef.value)
  const todoStats = todoStore.getStatsByMonth(currentMonth.value)

  const option = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      data: [
        { value: todoStats.completed, name: '已完成', itemStyle: { color: '#10b981' } },
        { value: todoStats.uncompleted, name: '未完成', itemStyle: { color: '#f59e0b' } },
      ],
    }],
  }

  chart.setOption(option)
  return chart
}

async function exportData() {
  const data = await storage.exportAll()
  const json = exportToJSON(data.diaries, data.todos)
  downloadJSON(json, `diary-backup-${getCurrentMonth()}.json`)
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const json = await readFileAsText(file)
    const data = parseImportJSON(json)

    if (!confirm(`确定要导入数据吗？\n这将导入 ${data.diaries.length} 篇日记和 ${data.todos.length} 个待办事项。\n现有数据不会被删除，相同日期的日记会被覆盖。`)) {
      target.value = ''
      return
    }

    await storage.importAll(data.diaries, data.todos)

    // 刷新数据
    await Promise.all([
      diaryStore.fetchDiaries(),
      todoStore.fetchTodos(),
    ])

    // 刷新图表
    nextTick(() => {
      initMoodChart()
      initTodoChart()
    })

    alert('数据导入成功！')
  } catch (e: any) {
    alert('导入失败：' + e.message)
  } finally {
    target.value = ''
  }
}

onMounted(async () => {
  await Promise.all([
    diaryStore.fetchDiaries(),
    todoStore.fetchTodos(),
  ])

  const moodChart = initMoodChart()
  const todoChart = initTodoChart()

  window.addEventListener('resize', () => {
    moodChart?.resize()
    todoChart?.resize()
  })
})

watch(currentMonth, () => {
  nextTick(() => {
    initMoodChart()
    initTodoChart()
  })
})
</script>
