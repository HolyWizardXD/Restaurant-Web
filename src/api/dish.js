import request from '@/utils/request.js'

import QS from 'qs';

export const dishListService = (pageData) => {
    return request.get('/dish/list?' + QS.stringify(pageData))
}

export const addDishService = (dish) => {
    return request.post('/dish/addDish', dish)
}

export const deleteDishService = (dishId) => {
    return request.delete('/dish/delete?dishId=' + dishId)
}

export const dishStatusService = (id,status) => {
    return request.put('/dish/status?id=' + id + '&status=' + status)
}

export const updateDishService = (dish) => {
    return request.put('/dish/updateDish',dish)
}

export const uploadDishService = (data) => {
    return request.post('/dish/upload', data)
}