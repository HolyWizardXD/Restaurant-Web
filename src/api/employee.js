import request from '@/utils/request.js'

import QS from 'qs';

// 分页查询员工接口
export const employeeListService = (pageData) => {
    return request.get('/employee/list?' + QS.stringify(pageData) )
}
// 修改员工状态接口
export const employeeStatusService = (id,status) => {
    return request.put('/employee/status?id=' + id + '&status=' + status)
}
// 新增员工状态
export const addEmployeeService = (employee) => {
    return request.post('/employee/addEmployee', employee)
}
// 修改员工信息接口
export const updateEmployeeService = (employee) => {
    return request.put('/employee/updateEmployee', employee)
}