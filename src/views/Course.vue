<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; width: 100%">
            <el-form :inline="true" :model="filters" class="demo-form-inline">
                <el-form-item label="课程ID">
                    <el-input v-model="filters.course_id" placeholder="课程ID"></el-input>
                </el-form-item>
                <el-form-item label="课程名">
                    <el-input v-model="filters.course_name" placeholder="课程名"></el-input>
                </el-form-item>
                <el-form-item label="教师名">
                    <el-input v-model="filters.teacher_name" placeholder="教师名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch()">查询</el-button>
                    <el-button v-if="is_superuser()" type="success" @click="addCourseBtn()">添加</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button v-if=" !(is_superuser()|| isPath('self')) " type="danger" @click="quitCourse()"
                               >安全退出
                    </el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="courses" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column prop="course_num" label="课程ID" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="course_name" label="课程名" min-width="150" sortable>
            </el-table-column>
            <el-table-column prop="teacher_name" label="课程老师" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="credit" label="学分" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="classroom" label="教室" min-width="120">
            </el-table-column>
            <el-table-column prop="limit_num" label="限制人数" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="checked_num" label="已选人数" min-width="120" sortable>
            </el-table-column>

            <!--管理员可见-->
            <el-table-column label="学院限制" min-width="240" v-if="is_superuser()">
                <template slot-scope="scope">
                    <el-tag
                            v-for="dept in scope.row.course_dept"
                            :key="dept"
                            type="info">
                        {{dept}}
                    </el-tag>
                </template>
            </el-table-column>
            <!--右侧操作栏-->
            <el-table-column label="操作" min-width="200">
                <!--管理员操作栏-->
                <template slot-scope="scope">
                    <el-row v-if="is_superuser()">
                        <el-button type="primary" @click="setEditCourse(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="setDeleteCourse(scope.row.course_id, scope.row.course_name)">
                            删除
                        </el-button>
                    </el-row>
                    <el-row v-else-if="isPath('self')">
                        <el-button type="danger">退课</el-button>
                    </el-row>
                    <el-row v-else-if="scope.row.is_checked">
                        <el-button
                                type="danger"
                                @click="setDropCourse(scope.$index,scope.row.course_id,scope.row.course_name)">
                            退课
                        </el-button>
                    </el-row>
                    <el-row v-else>
                        <el-button
                                type="primary" plain
                                @click="setTakeCourse(scope.$index,scope.row.course_id,scope.row.course_name)">
                            选课
                        </el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>

        <!--页脚工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--添加课程的对话框-->
        <el-dialog :title="dialogTitle" :visible.sync="addCourseVisible" center>
            <el-form :model="addForm" :rules="CourseRules" status-icon ref="addForm" class="addCourseForm">
                <el-form-item label="课程编号" :label-width="formLabelWidth" prop="course_num">
                    <el-input v-model="addForm.course_num" autocomplete="off" style="width:350px;"></el-input>
                </el-form-item>
                <el-form-item label="课程名称" :label-width="formLabelWidth" prop="course_name">
                    <el-input v-model="addForm.course_name" autocomplete="off" style="width:350px;"></el-input>
                </el-form-item>

                <el-form-item label="教师" :label-width="formLabelWidth" prop="course_teacher">
                    <el-input v-model="addForm.teacher_name" autocomplete="off" style="width:350px;"></el-input>
                </el-form-item>
                <el-form-item label="学分" :label-width="formLabelWidth" prop="credit">
                    <el-input-number v-model="addForm.credit" :min="0.5" :max="5" :step="0.5"></el-input-number>
                    <!--<el-input v-model="addForm.credit" autocomplete="off" style="width:350px;"></el-input>-->
                </el-form-item>
                <el-form-item label="限制人数" :label-width="formLabelWidth" prop="limit_num">
                    <el-input-number v-model="addForm.limit_num" :min="1" :max="500" :step="1"></el-input-number>
                    <!--<el-input v-model="addForm.limit_num" autocomplete="off" style="width:350px;"></el-input>-->
                </el-form-item>
                <el-form-item label="学院限制" :label-width="formLabelWidth" prop="course_dept">
                    <el-checkbox-group v-model="addForm.course_dept" size="mini">
                        <el-checkbox-button v-for="dept in dept_list" :label="dept" :key="dept">{{dept}}
                        </el-checkbox-button>
                    </el-checkbox-group>
                    <!--<el-input v-model="addForm.course_dept" autocomplete="off" style="width:350px;"></el-input>-->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('addForm')">取 消</el-button>
                <el-button type="primary" @click="confirmForm('addForm')">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../common/js/util'
    import routes from '../routes'
    //import NProgress from 'nprogress'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../api/api';
    import {getCourseList, dropCourse, takeCourse, deleteCourse, editCourse, addCourse, getDeptList} from '../api/api';

    export default {
        data() {
            return {
                filters: {
                    course_id: '',
                    course_name: '',
                    teacher_name: '',
                    page: 1,
                },
                courses: [],
                total: 0,

                listLoading: false,
                // 添加课程
                dialogTitle: '添加课程',
                addCourseBtnLoading: false,
                addCourseVisible: false,
                dept_list: ['信息学院', '会计学院', '金融学院'], //全部学院
                addForm: {
                    course_num: '',
                    course_name: '',
                    credit: '',
                    teacher_name: '',
                    course_dept: [],
                    limit_num: '',
                },
                CourseRules: {
                    course_num: {required: true, message: '不能为空', trigger: 'blur'},
                    course_name: {required: true, message: '不能为空', trigger: 'blur'},
                    credit: {required: true, message: '不能为空', trigger: 'blur'},
                    teacher_name: {required: true, message: '不能为空', trigger: 'blur'},
                    course_dept: {required: true, message: '不能为空', trigger: 'blur'},
                    limit_num: {required: true, message: '不能为空', trigger: 'blur'},
                },


                formLabelWidth: '150px',

            }
        },
        methods: {
            //url路径
            isPath(param) {
                let pathName = this.$route.path;

                let path_list = pathName.split('/');
                console.log("pathName:", path_list.indexOf(param));
                if (path_list.indexOf(param) === -1) {
                    return false;
                } else {
                    console.log('好烦');
                    return true;
                }
            },
            //判断超级用户
            is_superuser() {
                let user = JSON.parse(localStorage.getItem('user') || false);
                console.log("is_superuser:", user.is_superuser, typeof user.is_superuser);
                return user.is_superuser
            },
            //分页
            handleCurrentChange(val) {
                this.filters.page = val;
                this.getCourses();
            },
            //筛选
            handleSearch() {
                this.getCourses();
            },
            //获取用户列表
            getCourses() {
                let para = this.filters;
                this.listLoading = true;
                //NProgress.start();
                getUserListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.courses = res.data.users;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //退课
            setDropCourse(index, course_id, course_name) {
                this.$confirm('此操作将退选' + course_name + ', 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 后台请求
                    dropCourse({"course_id": course_id}).then(data => {
                        let {code, msg} = data;
                        if (code === 200) {
                            this.courses[index].is_checked = 0;
                            this.$message({
                                type: 'success',
                                message: '退课成功!'
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: msg,
                            });
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退课'
                    });
                });
            },
            //选课
            setTakeCourse(index, course_id, course_name) {
                this.$confirm('此操作将添加' + course_name + '课程, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    takeCourse({"course_id": course_id}).then(data => {
                        let {code, msg} = data;
                        if (code === 200) {
                            this.courses[index].is_checked = 1;
                            this.$message({
                                type: 'success',
                                message: '选课成功!'
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: msg
                            });
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消选课'
                    });
                });

            },
            // 学生安全退出选课
            quitCourse() {
                this.$router.push({path: '/'});
                routes[3]['hidden'] = false
            },


            // ===========管理员操作课程===========


            //管理员删除课程
            setDeleteCourse(course_id, course_name) {
                this.$confirm('此操作将删除' + course_name + ', 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCourse(course_id).then(data => {
                        let {code, msg} = data;
                        if (code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            //重新获取数据 相当于刷新
                            this.filters.page = 1;
                            this.getCourses()
                        } else {
                            this.$message({
                                type: 'error',
                                message: msg
                            });
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //管理员编辑课程
            setEditCourse(course) {
                console.log(course);
                this.dialogTitle = '编辑课程';
                this.addForm.teacher_name = course.teacher_name;
                this.addForm.credit = course.credit;
                this.addForm.course_name = course.course_name;
                this.addForm.course_num = course.course_num;
                this.addForm.limit_num = course.limit_num;
                this.addForm.course_dept = course.course_dept;
                this.addCourseVisible = true;
            },

            //取消添加课程按钮
            resetForm(formName) {
                this.addCourseVisible = false;
                this.addForm.course_num = '';
                this.addForm.course_name = '';
                this.addForm.credit = '';
                this.addForm.teacher_name = '';
                this.addForm.course_dept = [];
                this.addForm.limit_num = '';
                this.$refs[formName].resetFields();
            },


            // 点击添加按钮==>获取所有学院 ==>添加课程是展示
            addCourseBtn() {
                this.dialogTitle = '添加课程';
                this.addCourseVisible = true;
            },
            //确认添加课程
            confirmForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.$refs[formName]);
                        this.resetForm(formName)
                        // addCourse(this.courses).then(data => {
                        //     let {code, msg} = data;
                        //     if (code !== 200) {
                        //         this.$message({type: 'danger', message: msg, center: true,});
                        //     } else {
                        //         this.$message({type: 'success', message: msg, center: true,});
                        //         this.addCourseVisible = false;
                        //         window.location.reload()
                        //     }
                        // })
                    } else {
                        return false;
                    }
                });
            },

        },
        mounted() {
            this.getCourses();
        }
    }

</script>

<style scoped>
</style>