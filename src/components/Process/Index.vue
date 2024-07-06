<script setup>
import { ref, watch } from 'vue'
const progressProps = defineProps({
  availableItems: Number,
  processedItems: Number
})

const progress = ref(10)

watch(
  () => progressProps.processedItems,
  (newProcessedItems) => {
    progress.value = (newProcessedItems / progressProps.availableItems) * 100
  }
)
</script>

<template>
  <div
    class="bg-white shadow-sm w-[550px] py-4 animate__animated animate__fadeInDown rounded-2xl p-4"
  >
    <p class="text-xs mb-1 tracking-wide">Processing...</p>

    <div class="flex items-center gap-x-2">
      <div class="w-full rounded-full h-2.5 bg-[#f4f6fe]">
        <div class="bg-[#8fa5ff] h-2.5 rounded-full" :style="`width: ${progress}%`"></div>
      </div>

      <div class="flex items-center text-sm">
        <p class="flex font-semibold w-[18px]">{{ progress }}</p>
        <p>%</p>
      </div>
    </div>
  </div>
</template>
