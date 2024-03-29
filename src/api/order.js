// 导入request.js请求工具
import request from '@/utils/request.js'
// 引入qs转换
import qs from 'qs';

// 订单分页查询接口
export const orderService = (orderPage)=>{
   return request.get('/order/list?' + qs.stringify(orderPage))
}
// 出餐接口
export const DiningOutService = (orderId) => {
   return request.put('/order/status?orderId=' + orderId)
}