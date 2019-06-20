import Mock from 'mockjs';

const LoginUsers = [
    {
        id: 1,
        username: '小夏',
        password: '123456',
        avatar: 'https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/s%3D500/sign=afd59e6791504fc2a65fb005d5dce7f0/b03533fa828ba61e2828da404b34970a314e599e.jpg',
        is_superuser:false,
    }
];

const Users = [];

for (let i = 0; i < 86; i++) {
    Users.push(Mock.mock({
        course_num: Mock.Random.integer(1, 1000),
        course_name: Mock.Random.ctitle(),
        teacher_name: Mock.Random.cname(),
        classroom: "SJ" + Mock.Random.integer(100, 800),
        // 'credit|1-4': 1,
        // 'limit_num|30-50': 1,
        // 'checked|30-50': 1,
        // birth: Mock.Random.date(),
        credit: Mock.Random.integer(1, 5),
        limit_num: Mock.Random.integer(30, 50),
        checked_num: Mock.Random.integer(30, 50),
        is_checked: Mock.Random.integer(0,1),
        course_dept: ['信息学院', '会计学院', '金融学院'],
    }));
}

export {LoginUsers, Users};
