<template>
  <nav class="navbar">
    <ul class="nav-list">
      <li class="nav-item" v-for="link in links" :key="link.path">
        <router-link :to="link.path" class="nav-link">{{ link.name }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const links = ref([
  { name: '主页', path: '/' },
  { name: '登录', path: 'login' },
  { name: '关于', path: '/about' },
  { name: '入库', path: '/Inbound' },
  { name: '出库', path: '/outbound' },
  { name: '查看仓库产品', path: '/stock' },
  { name: '出库记录', path: '/outrecord' },
  { name: '供货商', path: '/supplier' }
]);
</script>

<style scoped>
.navbar {
  background-color: #333;
  width: 250px; /* 导航栏宽度 */
  height: 100vh; /* 占据整个页面高度 */
  position: fixed; /* 固定在左侧 */
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 1em 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%; /* 填满导航栏高度 */
}

.nav-item {
  margin-bottom: 1em;
}

.nav-item:last-child {
  margin-bottom: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.2em;
  padding: 0.8em 1.2em;
  display: block;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: #575757;
  color: #f0f0f0;
  border-radius: 4px;
}
</style>
