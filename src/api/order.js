// 导入request.js请求工具
import request from '@/utils/request.js'
// 引入qs转换
import qs from 'qs';

// 订单分页查询接口函数
export const orderService = (orderPageData)=>{
    return request.get('/order/list?' + qs.stringify(orderPageData))
}