<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div class="home-container">
    <NavBar /> <!-- 左侧导航栏 -->
    <section class="main-content">
      <RouterView /> <!-- 右侧内容区域 -->
    </section>
  </div>
</template>

<style scoped>
/* 确保外部容器占满整个页面 */
.home-container {
  display: flex;
  min-height: 100vh; /* 占满视口高度 */
  width: 100%; /* 占满视口宽度 */
}

/* 左侧导航栏样式 */
:deep(.navbar) {
  width: 250px; /* 固定宽度 */
  background-color: #333; /* 深色背景 */
  color: white;
  height: 100vh; /* 高度占满页面 */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
}

/* 右侧主内容区域样式 */
.main-content {
  flex: 1; /* 填充剩余空间 */
  padding: 2em;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>

<style>
/* 全局样式，确保 HTML 和 body 高度为 100% */
html, body {
  margin: 0;
  padding: 0;
  height: 100%; /* 解决 100% 高度计算问题 */
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>
