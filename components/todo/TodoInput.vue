<template>
  <div class="flex gap-3">
    <div class="flex-1 relative">
      <input
        ref="inputRef"
        v-model="content"
        type="text"
        placeholder="添加新待办..."
        class="input pl-11"
        @keyup.enter="submit"
      />
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>

    <button
      @click="submit"
      :disabled="!content.trim()"
      class="btn-primary px-5"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'add', content: string): void
}

const emit = defineEmits<Emits>()

const content = ref('')
const inputRef = ref<HTMLInputElement>()

function submit() {
  const trimmed = content.value.trim()
  if (trimmed) {
    emit('add', trimmed)
    content.value = ''
  }
}

// Auto focus on mount
onMounted(() => {
  inputRef.value?.focus()
})
</script>
