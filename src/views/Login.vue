<template>
    <div class="login-container">
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">用户名:</label>
          <input v-model="username" type="text" id="username" required />
        </div>
        <div>
          <label for="password">密码:</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit">登录</button>
      </form>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from '../router/axios';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', {
        username: username.value,
        password: password.value
      });
      // 假设服务器返回 JWT token 或成功状态
      if (response.status === 200) {
        // 假设将 token 存储在 localStorage 中
        console.log(response);
        localStorage.setItem('jwtToken', response.data.token);
        // 跳转到其他页面
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error);
      errorMessage.value = 'Login failed. Please check your credentials.';
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    width: 300px;
    margin: 100px auto;
  }
  </style>
  