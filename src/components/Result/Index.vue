<script setup>
import { ref, onMounted } from 'vue'
import { getCoordinates } from '@/utils/extractExif/locations'

const props = defineProps({
  finalResults: Array
})

const loading = ref({ download: false, copy: false })
const result = ref('')

const onHandleDownload = () => {
  loading.value = { ...loading.value, download: true }

  const blob = new Blob([result.value], { type: 'text/plain' })
  const fileName = `image_coordinates.txt`

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)

  setTimeout(() => {
    link.download = fileName
    link.click()
    URL.revokeObjectURL(link.href)

    loading.value = { ...loading.value, download: false }
  }, 500)
}

const onHandleCopy = () => {
  loading.value = { ...loading.value, copy: true }

  const copyText = document.getElementById('textBox')

  copyText.select()
  copyText.setSelectionRange(0, 99999)
  navigator.clipboard.writeText(copyText.value)

  setTimeout(() => {
    loading.value = { ...loading.value, copy: false }
  }, 500)
}

const onExtractCoordinates = () => {
  const allResults = props.finalResults.all
  allResults.map((item) => {
    const location = getCoordinates(
      item.exifData.GPSLatitude,
      item.exifData.GPSLatitudeRef,
      item.exifData.GPSLongitude,
      item.exifData.GPSLongitudeRef
    )
    result.value += `${item.name}: ${location} \n`
  })
}

onMounted(() => {
  onExtractCoordinates()
})
</script>
<template>
  <div class="w-full flex flex-col items-center gap-y-4">
    <textarea
      id="textBox"
      readonly
      class="w-full md:w-[550px] text-sm rounded-2xl resize-none focus:outline-none read h-44 p-4 leading-6 overflow-auto"
      v-model="result"
    />

    <div class="w-full md:w-[550px] flex gap-x-3">
      <button
        @click="() => !loading.copy && onHandleCopy()"
        class="w-5/6 bg-green-400 py-4 px-12 rounded-lg font-semibold text-lg text-white hover:bg-green-500 transition-colors delay-[50] scale-100 focus-visible:scale-90"
      >
        <div class="flex justify-center" v-if="loading.copy" role="status">
          <svg
            aria-hidden="true"
            class="w-7 h-7 text-white animate-spin dark:text-gray-200 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>

        <p v-else>Copy</p>
      </button>
      <button
        @click="() => !loading.download && onHandleDownload()"
        class="flex justify-center items-center bg-blue-400 rounded-lg w-1/6"
      >
        <div v-if="loading.download" role="status">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-white animate-spin dark:text-gray-200 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>

        <img v-else class="w-6 h-6 opacity-90" src="/download.svg" />
      </button>
    </div>
  </div>
</template>
