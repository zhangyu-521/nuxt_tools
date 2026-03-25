<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header -->
    <CommonAppHeader />

    <div class="flex">
      <!-- Sidebar - Desktop only -->
      <CommonAppSidebar class="hidden lg:block" />

      <!-- Main Content -->
      <main class="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
        <slot />
      </main>
    </div>

    <!-- Mobile Navigation -->
    <CommonMobileNav class="lg:hidden" />
  </div>
</template>

<script setup>
import CommonAppHeader from '~/components/common/AppHeader.vue'
import CommonAppSidebar from '~/components/common/AppSidebar.vue'
import CommonMobileNav from '~/components/common/MobileNav.vue'
</script>
