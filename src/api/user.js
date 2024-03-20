// 导入request.js请求工具
import request from '@/utils/request.js'
// 引入qs转换
import QS from 'qs';

// 用户注册接口
export const userRegisterService = (registerData)=> {
    return request.post('/user/register',registerData)
}
// 用户登录接口
export const userLoginService = (loginData)=> {
    return request.post('/user/login',loginData)
}
// 用户登出接口
export const userLogoutService = () => {
    return request.delete('/user/logout')
}
// 用户修改密码接口
export const updatePasswordService = (updatePasswordFrom) => {
    return request.patch('/user/updatePassword', updatePasswordFrom)
}
// 用户注销接口
export const userLogoffService = (userId) => {
    return request.delete('/user/logoff?userId=' + userId)
}

export const getUserService = (userId) => {
    return request.get('/user/getUser')
}