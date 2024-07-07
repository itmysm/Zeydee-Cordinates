<script setup>
import { ref, watch, onMounted } from 'vue'

const progressProps = defineProps({
  processStatus: Object
})

const progress = ref(0)
let intervalId = null

const counter = (targetProgress) => {
  if (intervalId) {
    clearInterval(intervalId)
  }

  setTimeout(() => {
    intervalId = setInterval(() => {
      if (progress.value < targetProgress) {
        progress.value += 1
      } else {
        clearInterval(intervalId)
      }
    }, 5)
  }, 500)
}

onMounted(() => {
  const targetProgress =
    (progressProps.processStatus.processedFiles / progressProps.processStatus.all) * 100
  counter(targetProgress)
})

watch(
  () => progressProps.processStatus,
  (newProcessedItems) => {
    if (newProcessedItems.all > 0) {
      const targetProgress = (newProcessedItems.processedFiles / newProcessedItems.all) * 100
      counter(targetProgress)
    } else {
      progress.value = 0
    }
  }
)
</script>

<template>
  <div
    class="bg-white shadow-sm w-full md:w-[550px] py-4 animate__animated animate__fadeInDown rounded-2xl p-4"
  >
    <p class="text-xs mb-1 tracking-wide">
      {{ progress < 100 ? 'Processing...' : 'Processed' }}
    </p>

    <div class="flex items-center gap-x-2">
      <div class="w-full rounded-full h-2.5 bg-[#f4f6fe]">
        <div class="bg-[#8fa5ff] h-2.5 rounded-full" :style="{ width: `${progress}%` }"></div>
      </div>

      <div class="flex items-center text-sm">
        <p class="flex font-semibold w-[25px] text-center">{{ progress }}</p>
        <p>%</p>
      </div>
    </div>
  </div>
</template>
