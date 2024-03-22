import request from '@/utils/request.js'

import QS from 'qs';

export const dishListService = (pageData) => {
    return request.get('/dish/list?' + QS.stringify(pageData))
}

export const addDishService = (dish) => {
    return request.post('/dish/addDish', dish)
}