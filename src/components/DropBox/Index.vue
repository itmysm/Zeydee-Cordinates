<template>
  <div
    class="flex flex-col justify-center items-center gap-y-5 bg-white h-fit py-12 w-[550px] rounded-2xl drop-shadow-sm"
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
        'border-2 border-dashed rounded-lg p-6 w-96 h-48 flex flex-col justify-center items-center mt-4 cursor-pointer',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-[#f4f6fe]'
      ]"
    >
      <div class="flex flex-col items-center p-4">
        <img class="w-16 h-16" src="/ico-folder.png" alt="folder icon" />
        <p class="mt-2 text-pink-500 text-sm font-semibold tracking-wide">
          Drag & Drop your files here
        </p>
      </div>
      <input
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

<script>
import { findEXIFinHEIC } from '@/utils/exif-heic'

export default {
  data() {
    return {
      isDragging: false,
      authorizedFileTypes: '.heic,.jpeg,.jpg',
      authorizedFileTypesArray: ['image/jpeg', 'image/jpg', 'image/heic']
    }
  },
  methods: {
    dragOver(event) {
      event.preventDefault()
      this.isDragging = true
    },
    dragLeave() {
      this.isDragging = false
    },
    drop(event) {
      this.isDragging = false
      const files = event.dataTransfer.files
      this.handleFiles({ target: { files } })
    },
    selectFiles() {
      this.$refs.fileInput.click()
    },
    handleFiles(event) {
      if (event.target.files.length > 0) {
        const files = Array.from(event.target.files)
        const validFiles = files.filter((file) => this.authorizedFileTypesArray.includes(file.type))
        const invalidFiles = files.length - validFiles.length

        if (validFiles.length > 0) {
          if (invalidFiles > 0) {
            alert(`${invalidFiles} files are not valid.`)
          }
        } else {
          alert('None of the files are allowed.')
        }

        this.processImages(files)
      }
    },

    backToSelectImages() {
      this.showResult = false
      this.images = []
      this.exifTableData = []
    },
    parseGeoInfo(exifData) {
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
    },
    processImages(files) {
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
              this.$message({
                type: 'info',
                message: `No EXIF data found in ${file.name}`
              })
              reject(new Error(`No EXIF data found in ${file.name}`))
            } else {
              this.images.push({
                file,
                exifData
              })
              this.populateExifTableData(file.name, exifData)
              resolve()
            }
          } catch (error) {
            this.$message({
              type: 'error',
              message: `Error processing ${file.name}: ${error.message}`
            })
            reject(error)
          }
        }
        reader.readAsArrayBuffer(file)
      })
    },
    populateExifTableData(fileName, exifData) {
      for (let key in exifData) {
        let value = exifData[key]
        if (typeof value === 'number') {
          value = value.toString()
        } else if (Array.isArray(value)) {
          value = value.join(', ')
        }
        this.exifTableData.push({
          fileName: fileName,
          itemName: key,
          itemValue: value
        })
      }
    }
    // processImages(files) {
    //   this.showResult = true
    // }
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>

<!-- now I should handle multiple photos in process image -->
