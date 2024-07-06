<script setup>
import DropBox from './components/DropBox/Index.vue'
import Process from './components/Process/Index.vue'
</script>

<template>
  <header></header>

  <main
    class="bg-[#f4f6fe] overflow-hidden h-dvh w-full flex flex-col gap-y-3 justify-center items-center"
  >
    <DropBox />
    <Process />
  </main>
</template>
