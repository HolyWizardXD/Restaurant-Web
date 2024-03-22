import request from '@/utils/request.js'

import QS from 'qs';

// 分页查询原料接口
export const inventoryListService = (pageData) => {
    return request.get('/inventory/list?' + QS.stringify(pageData) )
}
// 修改原料接口
export const updateInventoryService = (inventory) => {
    return request.put('/inventory/updateInventory', inventory)
}
// 新增原料接口
export const addInventoryService = (inventory) => {
    return request.post('/inventory/addInventory', inventory)
}
// 删除原料接口
export const deleteInventoryService = (id) => {
    return request.delete('/inventory/deleteInventory?inventoryId=' + id)
}

export const uploadPictureService = (data) => {
    return request.post('/inventory/upload', data)
}