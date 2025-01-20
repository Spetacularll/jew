<template>
  <div class="supplier-container">
    <h1>供应商管理</h1>
    <div class="list-header">
      <h2>供应商列表</h2>
      <div class="filter-controls">
        <!-- 添加搜索框 -->
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索供应商名称"
          class="search-input"
        />
      </div>
    </div>

    <!-- 添加供应商表单 -->
    <form @submit.prevent="createSupplier" class="supplier-form">
      <input v-model="newSupplier.supplierName" placeholder="供应商名称" required />
      <input v-model="newSupplier.contactName" placeholder="联系人" />
      <input v-model="newSupplier.phoneNumber" placeholder="联系电话" />
      <input v-model="newSupplier.email" placeholder="电子邮件" />
      <textarea v-model="newSupplier.address" placeholder="地址"></textarea>
      <button type="submit">添加供应商</button>
    </form>

    <!-- 供应商列表标题和过滤器 -->
    <div class="list-header">
      <h2>供应商列表</h2>
      <div class="filter-controls">
        <label class="show-deleted">
          <input type="checkbox" v-model="showDeleted">
          显示已删除供应商
        </label>
      </div>
    </div>

    <!-- 供应商列表 -->
    <ul class="supplier-list">
      <li v-for="supplier in filteredSuppliers" 
          :key="supplier.supplierId"
          :class="{ 'supplier-item': true }">
        <div class="supplier-info">
          <span class="supplier-name">{{ supplier.supplierName }}</span>
          <span class="supplier-status" v-if="supplier.deleted">(已删除)</span>
        </div>
        <div class="supplier-actions">
          <button 
            v-if="!supplier.deleted" 
            @click="editSupplier(supplier)" 
            class="edit-btn">
            编辑
          </button>
          <button 
            v-if="!supplier.deleted" 
            @click="softDeleteSupplier(supplier.supplierId)" 
            class="delete-btn">
            删除
          </button>
          <button 
            v-if="supplier.deleted" 
            @click="restoreSupplier(supplier.supplierId)" 
            class="restore-btn">
            恢复
          </button>
        </div>
      </li>
    </ul>

<!-- 编辑供应商表单 -->
<div v-if="editMode && selectedSupplier" class="edit-form-container">
  <div class="edit-form">
    <h2>编辑供应商</h2>
    <form @submit.prevent="updateSupplier">
      <input v-model="selectedSupplier.supplierName" required />
      <input v-model="selectedSupplier.contactName" />
      <input v-model="selectedSupplier.phoneNumber" />
      <input v-model="selectedSupplier.email" />
      <textarea v-model="selectedSupplier.address"></textarea>
      <div class="form-actions">
        <button type="submit" class="save-btn">保存</button>
        <button type="button" @click="cancelEdit" class="cancel-btn">取消</button>
      </div>
    </form>
  </div>
</div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from '../router/axios';

const baseURL = 'http://localhost:8080/api/suppliers';

interface Supplier {
  supplierId: number;
  supplierName: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  address: string;
  deleted: boolean;
}

interface NewSupplier {
  supplierName: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

// 响应式数据
const suppliers = ref<Supplier[]>([]);
const newSupplier = ref<NewSupplier>({
  supplierName: '',
  contactName: '',
  phoneNumber: '',
  email: '',
  address: ''
});
const selectedSupplier = ref<Supplier | null>(null);
const editMode = ref(false);
const showDeleted = ref(false);
const searchQuery = ref('');

// 计算属性：过滤供应商列表
const filteredSuppliers = computed(() => {
  return suppliers.value.filter(supplier => {
    const matchesDeletedFilter = showDeleted.value || !supplier.deleted;
    const matchesSearchQuery = supplier.supplierName
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchesDeletedFilter && matchesSearchQuery;
  });
});

// 获取所有供应商
const fetchSuppliers = async () => {
  try {
    const response = await axios.get<{ code: number; message: string; data: Supplier[]; timestamp: number; success: boolean }>(baseURL);
    console.log('API response:', response.data);

    if (Array.isArray(response.data.data)) {
      suppliers.value = response.data.data.map(supplier => ({
        ...supplier}));
    } else {
      console.log('Response data is not an array');
      suppliers.value = [];
    }

    console.log('Suppliers after setting:', suppliers.value);
  } catch (error) {
    console.error('获取供应商失败:', error);
    suppliers.value = [];
  }
};

// 创建供应商
const createSupplier = async () => {
  try {
    await axios.post<Supplier>(baseURL, newSupplier.value);
    newSupplier.value = {
      supplierName: '',
      contactName: '',
      phoneNumber: '',
      email: '',
      address: ''
    };
    await fetchSuppliers();
  } catch (error) {
    console.error('添加供应商失败:', error);
  }
};

// 更新供应商
const updateSupplier = async () => {
  if (!selectedSupplier.value) return;

  try {
    await axios.put<Supplier>(`${baseURL}/${selectedSupplier.value.supplierId}`, selectedSupplier.value);
    editMode.value = false;
    selectedSupplier.value = null;
    await fetchSuppliers();
  } catch (error) {
    console.error('更新供应商失败:', error);
  }
};

// 软删除供应商
const softDeleteSupplier = async (id: number) => {
  try {
    await axios.put(`${baseURL}/${id}/soft-delete`);
    const supplier = suppliers.value.find(s => s.supplierId === id);
    if (supplier) {
      supplier.deleted = true;
    }
    console.log(suppliers.value);
  } catch (error) {
    console.error('删除供应商失败:', error);
  }
};

// 恢复已删除的供应商
const restoreSupplier = async (id: number) => {
  try {
    await axios.put(`${baseURL}/${id}/restore`);
    await fetchSuppliers();
  } catch (error) {
    console.error('恢复供应商失败:', error);
  }
};

// 编辑供应商
const editSupplier = (supplier: Supplier) => {
  selectedSupplier.value = { ...supplier };
  editMode.value = true;
};

// 取消编辑
const cancelEdit = () => {
  selectedSupplier.value = null;
  editMode.value = false;
};

// 在组件挂载后获取供应商数据
onMounted(() => {
  fetchSuppliers();
});
</script>

    
<style scoped>
  .supplier-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  
  .supplier-form, .edit-form {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  input, textarea {
    display: block;
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    margin-right: 8px;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .show-deleted {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .supplier-list {
    list-style: none;
    padding: 0;
  }
  
  .supplier-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #eee;
  }
  
  .supplier-item.deleted {
    background-color: #fff5f5;
  }
  
  .supplier-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .supplier-status {
    color: #e53e3e;
    font-size: 0.9em;
  }
  
  .supplier-actions {
    display: flex;
    gap: 8px;
  }
  
  .edit-btn {
    background-color: #4299e1;
    color: white;
  }
  
  .delete-btn {
    background-color: #e53e3e;
    color: white;
  }
  
  .restore-btn {
    background-color: #48bb78;
    color: white;
  }
  
  .edit-form-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .edit-form {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
  }
  
  .save-btn {
    background-color: #4299e1;
    color: white;
  }
  
  .cancel-btn {
    background-color: #a0aec0;
    color: white;
  }
  </style>