// 导入axios
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 定义变量 记录baseURL
const baseURL = '/api';
const instance = axios.create( {
    baseURL,
    timeout: 10000
});

import { useTokenStore } from '@/stores'

// 请求拦截器
instance.interceptors.request.use(
    (config)=>{
        // 请求前的回调
        // 添加token
        const tokenStore = useTokenStore()
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token
        }
        return config;
    },
    (err)=>{
        // 请求错误的回调
        return Promise.reject(err)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    result=>{
        // 判断业务状态码
        if(result.data.code === 0) {
            return result.data
        }
        // 操作失败
        ElMessage.error(result.data.msg?result.data.msg:'服务异常')
        return Promise.reject(result.data);
    },
    err=>{
        if (err.response.status === 401) {
            router.push('/login')
            ElMessage.error('未登录或登陆过期')
        } else {
            ElMessage.error('服务异常')
        }
        return Promise.reject(err)
    }
)

export default instance;