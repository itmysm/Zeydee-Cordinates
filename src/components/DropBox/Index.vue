<template>
  <div
    class="flex flex-col justify-center items-center gap-y-5 bg-white h-fit py-12 w-full md:w-[550px] rounded-2xl drop-shadow-sm"
  >
    <div class="flex flex-col justify-center items-center">
      <h1 class="text-xl font-semibold">Upload your photos</h1>
      <p class="text-gray-400/80 text-sm mt-1">Files should be .heic, jpg, or jpeg</p>
    </div>

    <div
      @dragover.prevent="dragOver"
      @dragleave="dragLeave"
      @drop.prevent="drop"
      @click="selectFiles"
      :class="[
        'border-2 w-[90%] sm:w-96 border-dashed rounded-lg p-2 sm:p-6 h-48 flex flex-col justify-center items-center mt-4 cursor-pointer',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-[#f4f6fe]'
      ]"
    >
      <div class="flex flex-col items-center p-4">
        <img class="w-12 h-12" src="/folder.svg" alt="folder icon" />
        <p class="mt-2 text-pink-500 text-sm font-semibold tracking-wide">
          Drag & Drop your files here
        </p>
      </div>
      <input
        id="fileInputModel"
        ref="fileInput"
        type="file"
        class="hidden"
        multiple
        :accept="authorizedFileTypes"
        @change="handleFiles"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'
import { findEXIFinHEIC, findEXIFinJPEG } from '@/utils/exif-heic'
import { useRoute } from 'vue-router'

const route = useRoute()
const emit = defineEmits(['updateProcessStatus', 'updateResults'])
const isDragging = ref(false)
const authorizedFileTypes = '.heic,.jpeg,.jpg'
const authorizedFileTypesArray = ['image/jpeg', 'image/jpg', '.heic']
const images = ref({ all: [], extractedData: [], noData: [] })
const exifTableData = ref([])
const showResult = ref(false)

const dragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const dragLeave = () => {
  isDragging.value = false
}

const drop = (event) => {
  isDragging.value = false
  const files = event.dataTransfer.files
  handleFiles({ target: { files } })
}

const selectFiles = () => {
  fileInput.value.click()
}

const handleFiles = (event) => {
  backToSelectImages()
  if (event.target.files.length > 0) {
    const files = Array.from(event.target.files)
    const validFiles = files.filter((file) => {
      if (file.type) {
        return authorizedFileTypesArray.includes(file.type)
      } else {
        return file.name.toLowerCase().endsWith('.heic')
      }
    })
    const invalidFiles = files.length - validFiles.length

    if (validFiles.length > 0) {
      processImages(validFiles)

      if (invalidFiles > 0) {
        // alert(`${invalidFiles} files are not valid.`)
      }
    } else {
      alert('None of the files are allowed.')
    }
  }
}

const backToSelectImages = () => {
  showResult.value = false
  images.value = { all: [], extractedData: [], noData: [] }
  exifTableData.value = []
}

const parseGeoInfo = (exifData) => {
  let result = {
    lat: 0,
    long: 0
  }
  if (exifData.GPSLatitude && exifData.GPSLatitude.length > 0) {
    result.lat =
      exifData.GPSLatitude[0] + exifData.GPSLatitude[1] / 60 + exifData.GPSLatitude[2] / 3600
    if (exifData.GPSLatitudeRef === 'S') {
      result.lat = -result.lat
    }
  }
  if (exifData.GPSLongitude && exifData.GPSLongitude.length > 0) {
    result.long =
      exifData.GPSLongitude[0] + exifData.GPSLongitude[1] / 60 + exifData.GPSLongitude[2] / 3600
    if (exifData.GPSLongitudeRef === 'W') {
      result.long = -result.long
    }
  }
  return result
}

const processImages = (files) => {
  showResult.value = true
  const promises = files.map((file, index) => {
    emit('updateProcessStatus', {
      all: files.length,
      processedFiles: index + 1
    })
    return processSingleImage(file)
  })
  Promise.all(promises)
    .then(() => {
      setTimeout(() => {
        emit('updateResults', images.value)
      }, 1500)
      console.log('All files processed successfully')
    })
    .catch((error) => {
      console.error('Error processing files:', error)
    })
}

const processSingleImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      let exifData = null
      try {
        if (file.name.toLowerCase().endsWith('.heic')) {
          exifData = findEXIFinHEIC(e.target.result)
        } else {
          exifData = findEXIFinJPEG(e.target.result)
        }
        if (!exifData) {
          images.value.noData.push({ name: file.name })
          images.value.all.push({ name: file.name, exifData })
          resolve()
        } else {
          images.value.extractedData.push({ name: file.name, exifData })
          images.value.all.push({ name: file.name, exifData })
          populateExifTableData(file.name, exifData)
          resolve()
        }
      } catch (error) {
        // alert(`Error processing ${file.name}: ${error.message}`)
        reject(error)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

const populateExifTableData = (fileName, exifData) => {
  for (let key in exifData) {
    let value = exifData[key]
    if (typeof value === 'number') {
      value = value.toString()
    } else if (Array.isArray(value)) {
      value = value.join(', ')
    }
    exifTableData.value.push({
      fileName: fileName,
      itemName: key,
      itemValue: value
    })
  }
}

watch(
  () => route.query,
  (updatedRouteQuery) => {
    if (!Object.keys(updatedRouteQuery).length) {
      backToSelectImages()
    }
  }
)
const fileInput = ref(null)
</script>
