// 导入request.js请求工具
import request from '@/utils/request.js'
// 引入qs转换
import QS from 'qs';

// 用户注册接口函数
export const userRegisterService = (registerData)=> {
    return request.post('/user/register',registerData)
}
export const userLoginService = (loginData)=> {
    return request.post('/user/login',loginData)
}

export const userLogoutService = () => {
    return request.delete('/user/logout')
}