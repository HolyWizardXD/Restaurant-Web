import request from '@/utils/request.js'

import QS from 'qs';

export const customerListService = (pageData) => {
    return request.get('/customer/list?' + QS.stringify(pageData) )
}

export const customerOrderService = (id) => {
    return request.get('/order/count?customerId=' + id)
}