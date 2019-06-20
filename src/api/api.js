import axios from 'axios';

let base = '';
let backend = '/api';
// let backend1 = 'http://192.168.1.172:8080';
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const test1 = params => { return axios.get(`${backend}/service/`, { params: params }); };
//显示学生信息 -GET
export const studentInfo = params => { return axios.get(`${backend}/student/`, { params: params }); };
// 修改密码 -put
export const changePassword = params => { return axios.put(`${backend}/password/`, { params: params }); };

// 学生操作
//获取课程列表
export const getCourseList = params => {return axios.get(`${backend}/course/`,{params:params}); };
// 退课操作
export const dropCourse = params => { return axios.delete(`${backend}/selection/`, { params: params }); };
//选课操作
export const takeCourse = params => { return axios.post(`${backend}/selection/`, { params: params }); };

// 管理员操作
// 删除课程
export const deleteCourse = params => { return axios.delete(`${backend}/course/`, { params: params }); };
//编辑课程
export const editCourse = params => { return axios.put(`${backend}/course/`, { params: params }); };
//添加课程
export const addCourse = params => { return axios.post(`${backend}/course/`, { params: params }); };
// 获取所有学院
export const getDeptList = params => { return axios.get(`${backend}/dept/`, { params: params }); };
