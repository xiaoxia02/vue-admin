<template>
    <section>
        <el-button type="success" @click="test()"> click me</el-button>
        <el-button type="success" @click="test2()"> click me1</el-button>
    </section>
</template>

<script>
    import axios from 'axios';
    import util from '../../common/js/util';
    //import NProgress from 'nprogress'
    import {test1} from '../../api/api';

    export default {
        data() {
            return {}
        },
        methods: {
            test() {
                console.log(test1)
                var para = {"a": 1}
                test1(para).then((res) => {
                    console.log(res)
                });
            },
            test2() {
                axios.post('/api/service/').then(result => {
                    console.log(result);
                })
            },

        },
        mounted() {
        }
    }

</script>
