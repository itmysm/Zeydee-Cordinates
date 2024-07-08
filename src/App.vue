<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import DropBox from './components/DropBox/Index.vue'
import Process from './components/Process/Index.vue'
import Result from './components/Result/Index.vue'

const router = useRouter()
const route = useRoute()
const processStatus = ref({all: 0, processedFiles: 0})
const finalResults = ref(null)
const onGetFinalResult = (newResult) => {
  router.push({ query: { type: 'result' } })
  finalResults.value = newResult
}

onMounted(() => {
  router.push({ path: '/', query: {} })
})

watch(
  () => route.query,
  (updatedRouteQuery) => {
    if (!Object.keys(updatedRouteQuery).length) {
      finalResults.value = null
      processStatus.value = null
    }
  }
)
</script>

<template>
  <div class="bg-[#f4f6fe] px-5 overflow-hidden">
    <header class="absolute top-0 py-3 md:py-5 z-10">
      <p v-show="Object.keys(route.query).length" class="group flex gap-x-1 items-center text-sm transition-colors delay-200 cursor-pointer" @click="router.push({path: '/'})">
        <img class="w-5 h-5 group-hover:opacity-50" src="/back.svg" alt="back step" />
        <p class="group-hover:text-black/60">Back</p>
      </p>
    </header>

    <main class="overflow-hidden h-dvh w-full flex flex-col gap-y-3 justify-center items-center">
      <div
        v-show="!finalResults"
        :class="`flex flex-col gap-y-3 justify-center items-center w-full h-full`"
      >
        <DropBox
          @updateProcessStatus="($event) => (processStatus = $event)"
          @updateResults="($event) => onGetFinalResult($event)"
        />
        <Process v-if="processStatus" :processStatus="processStatus" />
      </div>

      <Result v-if="finalResults" :finalResults="finalResults" />
    </main>

    <div class="flex w-full justify-between items-center absolute bottom-2 left-0 px-3 md:px-5">
      <p class="text-sm">Made By <a href="https://github.com/itmysm" target="_blank" class="text-blue-400 hover:text-violet-500 transition-colors delay-75 font-semibold">Mysm</a></p>
      <a href="https://github.com/itmysm/Zeydee-Cordinates" target="_blank">
        <img src="/github.svg" class="w-7 h-7 hover:opacity-80 transition-opacity delay-75" alt="github" />
      </a>
    </div>
  </div>
</template>
