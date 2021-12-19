// An highlighted block
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { history, Link } from 'umi';
import * as apis from '@/services/ant-design-pro/api'
const loginPath = '/user/login';
// import *as apis from './services/ant-design-pro/api';
// import 

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = async (error) => {
    const { response } = error;
    if (response && response.status) {
        if (response.status == "401") {
            //重新刷新refresh
            try {
                let res = await apis.refreshToken({
                    refresh: localStorage.getItem("refresh-token")
                })
                if (res.hasOwnProperty("access")) {
                    let { access, refresh } = res
                    localStorage.setItem("access-token", access)
                    localStorage.setItem("refresh-token", refresh)
                    await apis.currentUser()
                }


            } catch (error) {
                console.log("401", error)
                history.push(loginPath);
            }
        } else {
            const errorText = codeMessage[response.status] || response.statusText;
            const { status, url } = response;
            notification.error({
                message: `请求错误 ${status}: ${url}`,
                description: errorText,
            });
        }

    }

    return response;
};
const request = extend({
    errorHandler,
    // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
    let c_token = localStorage.getItem("access-token") || "";
    if (c_token && c_token !== "undefined") {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${c_token}`
        };
        return (
            {
                url: url,
                options: { ...options, headers: headers },
            }
        );
    } else {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // 'Authorization': `Bearer ${c_token}`
        };
        return (
            {
                url: url,
                options: { ...options },
            }
        );
    }

})

// response拦截器, 处理response
request.interceptors.response.use((response, options) => {
    let token = response.headers.get("access-token") || "";
    if (token && token != "undefined") {
        alert("token")
        localStorage.setItem("access-token", token);
    }


    return response;
});


export default request;

