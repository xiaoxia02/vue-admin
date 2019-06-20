<template>
    <section>
        <el-row ustify="center" class="user-info">
            <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>{{User.name}}</span>
                    <el-button style="float: right; padding: 3px 0"
                               type="text"
                               @click="dialogFormVisible = true">
                        修改密码
                    </el-button>
                </div>
                <el-row :gutter="12" class="text item row-md" type="flex">
                    <el-col :span="4" v-if="is_superuser()">职工号:</el-col>
                    <el-col :span="3" v-else>学号:</el-col>
                    <el-col :span="9">{{User.num}}</el-col>
                </el-row>
                <el-row :gutter="12" class="text item row-md" type="flex" v-if="! is_superuser()">
                    <el-col :span="3">年级:</el-col>
                    <el-col :span="9">{{User.grade}}</el-col>
                </el-row>
                <el-row :gutter="12" class="text item row-md" type="flex" v-if="! is_superuser()">
                    <el-col :span="3">专业:</el-col>
                    <el-col :span="9">{{User.major}}</el-col>
                </el-row>
                <el-row :gutter="12" class="text item row-md" type="flex" v-if="! is_superuser()">
                    <el-col :span="3">班级:</el-col>
                    <el-col :span="9">{{User.class}}</el-col>
                </el-row>
                <el-row :gutter="12" class="text item row-md" type="flex" v-if="! is_superuser()">
                    <el-col :span="3">学院:</el-col>
                    <el-col :span="9">{{User.dept}}</el-col>
                </el-row>
                <el-row :gutter="12" class="text item row-md" type="flex" v-if="! is_superuser()">
                    <el-col>
                        <el-link type="danger" @click="openSelection" :underline="false" style="float: right">进入选课</el-link>
                    </el-col>

                </el-row>

            </el-card>
        </el-row>
        <!--修改密码的dialog-->
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" status-icon ref="form">
                <el-form-item label="旧密码" :label-width="formLabelWidth" prop="old_pwd">
                    <el-input v-model="form.old_pwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth" prop="new_pwd">
                    <el-input v-model="form.new_pwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth" prop="re_pwd">
                    <el-input v-model="form.re_pwd" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel_pwd('form')">取 消</el-button>
                <el-button type="primary" @click="change_pwd('form')">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {changePassword, userInfo} from '../api/api';
    import routes from '../routes'
    export default {
        data() {
            var validatePwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.new_pwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                User: {
                    name: '小夏',
                    num: '16251102209',
                    class: '计算机科学与技术3班',
                    grade: '2016级',
                    major: '计算机科学与技术',
                    dept: '信息学院',
                },

                //修改密码
                dialogFormVisible: false,
                form: {
                    old_pwd: '', //旧密码
                    new_pwd: '', // 新密码
                    re_pwd: '', // 确认密码
                },
                formLabelWidth: '100px',
                //表单验证
                rules: {
                    old_pwd: [
                        {required: true, message: '请输入原密码！', trigger: 'blur'},
                        // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    new_pwd: [
                        {required: true, message: '请输入新密码！', trigger: 'blur'},
                    ],
                    re_pwd: [
                        {validator: validatePwd, trigger: 'blur'},

                    ],
                }

            }
        },
        methods: {
            is_superuser(){
                let user = JSON.parse(localStorage.getItem('user')|| false);
                console.log("is_superuser:",user.is_superuser,typeof user.is_superuser);
                return user.is_superuser
            },
            cancel_pwd(form) {
                this.dialogFormVisible = false;
                this.$refs[form].resetFields();
            },
            change_pwd(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                        changePassword(this.form).then(data => {
                            let {code, msg} = data;
                            if (code !== 200) {
                                this.$message({type: 'danger', message: msg, center: true,});
                            } else {
                                this.$message({type: 'success', message: msg, center: true,});
                                this.dialogFormVisible = false;
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            // 初始化学生信息
            getUserInfo() {
                userInfo().then(data => {
                    this.User = data.user
                })
            },
            //进入选课
            openSelection(){
                routes[3]['hidden']=false;
                this.$router.push({path: '/course'});
            }
        },
        mounted() {
            console.log(routes);
            if (this.is_superuser()){
                routes[2]['children'][2]['hidden']=true
            }else {
                routes[3]['hidden']=true
            }
        }
    }

</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before, .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {

        width: 480px;
    }

    .user-info {
        margin-top: 50px;
        margin-left: 28%;

    }

    /*section{*/
    /*margin-top: 100px;*/
    /*margin-left: 100px;*/
    /*}*/

</style>