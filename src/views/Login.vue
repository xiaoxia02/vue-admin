<template>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">选课系统登录</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-checkbox v-model="ruleForm2.is_superuser" class="pull-right">管理员登录</el-checkbox>
         <!--<el-radio v-model="is_superuser" label="0" class="pull-right">学生登录</el-radio>-->
        <!--<el-radio v-model="is_superuser" label="1" class="pull-right">管理员登录</el-radio>-->
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录
            </el-button>
            <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
    </el-form>
</template>

<script>
    import {requestLogin} from '../api/api';
    //import NProgress from 'nprogress'
    export default {
        data() {
            return {
                logining: false,
                ruleForm2: {
                    username: '小夏',
                    password: '123456',
                    is_superuser: false
                },
                rules2: {
                    username: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true,


            };
        },
        methods: {
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2(ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        //NProgress.start();
                        var loginParams =this.ruleForm2;
                        console.log(this.ruleForm2);
                        //登录请求
                        requestLogin(loginParams).then(data => {
                            this.logining = false;
                            //NProgress.done();
                            //   加上token
                            let {msg, code, user, token} = data;
                            if (code !== 200) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            }
                            else {
                                if (token) {
                                    localStorage.setItem('user', JSON.stringify(user));
                                    localStorage.setItem('token', token);
                                    this.$router.push({path: '/'});
                                    // router.replace({
                                    //     path: '/login',
                                    //     query: {redirect: router.currentRoute.fullPath}
                                    // });
                                } else {
                                    this.$message({
                                        type: 'danger',
                                        message: '登录失败',
                                        center: true
                                    })
                                }

                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>