<template>
  <nav class="navbar" aria-label="Main Navigation">
    <ul class="nav-list">
      <li class="nav-item" v-for="link in links" :key="link.name">
        <!-- Dropdown Menu -->
        <template v-if="link.children">
          <div
            class="nav-link dropdown-title"
            @click="toggleDropdown(link)"
            :aria-expanded="openDropdown === link.name"
            role="button"
            tabindex="0"
            @keydown.enter="toggleDropdown(link)"
          >
            {{ link.name }}
          </div>
          <ul
            v-show="openDropdown === link.name"
            class="dropdown"
            role="menu"
            aria-label="Submenu for {{ link.name }}"
          >
            <li
              class="dropdown-item"
              v-for="child in link.children"
              :key="child.path"
              role="menuitem"
            >
              <router-link :to="child.path" class="nav-link">{{ child.name }}</router-link>
            </li>
          </ul>
        </template>

        <!-- Regular Menu Item -->
        <template v-else>
          <router-link :to="link.path" class="nav-link" role="menuitem">{{ link.name }}</router-link>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义 Link 类型
interface ChildLink {
  name: string
  path: string
}

interface Link {
  name: string
  path?: string
  children?: ChildLink[]
}

const openDropdown = ref<string | null>(null)

const toggleDropdown = (link: Link) => {
  openDropdown.value = openDropdown.value === link.name ? null : link.name
}

// 指定 links 的类型为 Link[]
const links = ref<Link[]>([
  { name: '主页', path: '/' },
  { name: '登录', path: '/login' },
  { name: '入库', path: '/Inbound' },
  { name: '出库', path: '/outbound' },
  {
    name: '出库管理',
    children: [
      { name: '出库记录', path: '/outrecord' },
      { name: '批次管理', path: '/outbatch' }
    ]
  },
  { name: '查看仓库产品', path: '/stock' },
  { name: '打印条码', path: '/printer' },
  { name: '批量入库', path: '/reinbound' },
  { name: '管理货品', path: '/searchp' },
  { name: '统计',path:'/sellcount'}
])
</script>

<style scoped>
.navbar {
  background-color: #333;
  width: 250px;
  height: 100vh;
  position: fixed;
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
}

.nav-item {
  margin-bottom: 1em;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.2em;
  padding: 0.8em 1.2em;
  display: block;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: #575757;
  color: #f0f0f0;
  border-radius: 4px;
}

.dropdown-title::after {
  content: " ▼";
  font-size: 0.8em;
}

.dropdown {
  list-style: none;
  padding-left: 1em;
  margin-top: 0.5em;
}

.dropdown-item {
  margin-bottom: 0.5em;
}
</style>