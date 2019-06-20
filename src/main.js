import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './assets/theme/theme1/index.css'
import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import Mock from './mock'

Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
// Axios.defaults.baseURL='/api';
//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path === '/login') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        next()
    }
    else {
        let token = localStorage.getItem('token');
        console.log(Boolean(token))
        if (token){
            next()
        }else {
            next({path:'/login'})
        }
    }
    // let user = JSON.parse(localStorage.getItem('user'));
    // if (!user && to.path != '/login') {
    //     next({path: '/login'})
    // } else {
    //     next()
    // }
});

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app');


// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `token ${localStorage.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// // http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            console.log('axios:' + error.response.status);
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    router.replace({
                        path: '/login',
                        query: {redirect: router.currentRoute.fullPath}
                    });
            }
        }
        return Promise.reject(error.response.data);   // 返回接口返回的错误信息
    });

Vue.prototype.$http = axios;
