import axios from 'axios';

// 创建一个 Axios 实例
const instance = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? 'http://localhost:8080/'
    : 'http://8.138.89.11:8080/', // 生产环境地址
  timeout: 30000,
  
});
console.log(instance);


// 设置请求拦截器
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');  // 从 localStorage 中获取 JWT token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;  // 设置 Authorization 头部
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 设置响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 如果响应成功，直接返回数据
    return response;
  },
  (error) => {
    if (error.response) {
      // 如果 error.response 存在，则处理状态码
      if (error.response.status === 401) {
        // 未授权，重定向到登录页面
        console.log(error.response.status);
        // window.location.href = '/login';
      } else if (error.response.status === 403) {
        // 没有权限，提示用户
       
        alert('403 Access denied');
        
      }
    } else {
      // 如果没有 error.response，则说明请求本身失败
      console.error('Error: Network or server issue', error);
    }
    return Promise.reject(error);
  }
);

export default instance;
