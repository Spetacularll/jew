<script setup lang="ts">
import { ref } from 'vue'
import axios from '../router/axios';

interface BarcodeForm {
  category: number
  color: number
  name: string
  thickness: string
  price: string
}

interface BarcodeResponse {
  success: boolean
  barcodeText: string
  message: string
}

const form = ref<BarcodeForm>({
  category: 0,
  color: 0,
  name: '',
  thickness: '',
  price: ''
})

const loading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const generateAndPrint = async () => {
  loading.value = true
  message.value = ''
  
  try {
    const { data } = await axios.post<BarcodeResponse>(
      '/api/barcode/print',
      form.value
    )
    
    // 设置响应信息
    messageType.value = data.success ? 'success' : 'error'
    message.value = data.message
    
  } catch (error) {
    messageType.value = 'error'
    
    // 处理不同类型的错误
    message.value = '系统错误，请稍后重试'
    
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    category: 0,
    color: 0,
    name: '',
    thickness: '',
    price: ''
  }
  message.value = ''
}
</script>

<template>
  <div class="max-w-xl mx-auto p-4">
    <form @submit.prevent="generateAndPrint" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">种类 (0-20)</label>
          <input
            v-model.number="form.category"
            type="number"
            min="0"
            max="20"
            required
            class="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">颜色编码 (0-10)</label>
          <input
            v-model.number="form.color"
            type="number"
            min="0"
            max="10"
            required
            class="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">名称简写</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">厚度</label>
          <input
            v-model="form.thickness"
            type="text"
            required
            class="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">价格</label>
          <input
            v-model="form.price"
            type="text"
            required
            class="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div v-if="message" 
           class="p-3 rounded-md mt-4" 
           :class="messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
        {{ message }}
      </div>

      <div class="flex space-x-4">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? '打印中...' : '打印条形码' }}
        </button>
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          :disabled="loading"
        >
          重置
        </button>
      </div>
    </form>
  </div>
</template>