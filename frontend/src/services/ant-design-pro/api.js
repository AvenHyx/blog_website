// @ts-ignore

/* eslint-disable */
// import { request } from 'umi';

import request from "@/utils/request";

/**from 20211213 */

/**注册 POST   /api/user/register */
export async function register(body, options) {
  return request('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body, options) {
  return request('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(body, options) {
  return request('/api/getUserInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**getToken */
export async function getToken(body, options) {
  return request('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**换取token  POST /api/refresh/token*/
export async function refreshToken(body, options) {
  return request('/api/token/refresh ', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */

export async function outLogin(body, options) {
  return request('/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**上传头像 POST /api/upload/avatar*/
export async function uploadAvatar(body, options) {
  return request('/api/upload/avatar', {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**建立标签分类信息【管理员权限】 POST /api/addTag*/
export async function addTag(body, options) {
  return request('/api/addTag ', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**删除标签分类信息【管理员权限】POST /api/deleteTagById */
export async function deleteTagById(options) {
  return request('/api/deleteTagById', {
    method: 'POST',
    ...(options || {}),
  });
}

/**修改标签分类信息【管理员权限 POST /api/modifyTag*/
export async function modifyTagById(options) {
  return request('/api/modifyTag', {
    method: 'POST',
    ...(options || {}),
  });
}

/**首页获取分类信息 GET /api/getCategoryMenu*/
export async function getCategoryMenu(options) {
  return request('/api/getCategoryMenu', {
    method: 'GET',
    ...(options || {}),
  });
}

/**发博客 POST  /api/blo*/
export async function sendBlog(options) {
  return request('/api/blog', {
    method: 'POST',
    ...(options || {}),
  });
}
/**修改博客 POST /api/modify/blog*/
export async function modifyBlog(options) {
  return request('/api/modify/blog', {
    method: 'POST',
    ...(options || {}),
  });
}

/**删除博客 POST /api/deleteBlogById*/
export async function deleteBlogById(options) {
  return request('/api/deleteBlogById', {
    method: 'POST',
    ...(options || {}),
  });
}

/**发评论 POST /api/comment*/
export async function comment(options) {
  return request('/api/comment', {
    method: 'POST',
    ...(options || {}),
  });
}

/**删除评论 POST /api/deleteCommentById*/
export async function deleteCommentById(options) {
  return request('/api/deleteCommentById', {
    method: 'POST',
    ...(options || {}),
  });
}


/**博客详情 GET /api/getBlogDetail*/
export async function getBlogDetail(options) {
  return request('/api/getBlogDetail', {
    method: 'GET',
    ...(options || {}),
  });
}

/**获取个人中心页面的数据【博客列表、权限拦截】POST /api/getPersonalCenter*/
export async function getPersonalCenter(options) {
  return request('/api/getPersonalCenter', {
    method: 'POST',
    ...(options || {}),
  });
}

/**查看fork和follower的个人中心 GET /api/query/info*/
export async function getQueryInfo(options) {
  return request('/api/query/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/**关注 POST /api/forkUser*/
export async function forkUser(options) {
  return request('/api/forkUser', {
    method: 'POST',
    ...(options || {}),
  });
}

/**取消关注 POST /api/cancel/for*/
export async function cancelForkUser(options) {
  return request('/api/cancel/fork', {
    method: 'POST',
    ...(options || {}),
  });
}

/**修改用户信息 POST /api/modify/userInfo*/
export async function modifyUserInfo(options) {
  return request('/api/modify/userInfo', {
    method: 'POST',
    ...(options || {}),
  });
}

/**修改密码 POST /api/modify/password*/
export async function modifyPassword(options) {
  return request('/api/modify/password', {
    method: 'POST',
    ...(options || {}),
  });
}

/**查询标签列表【管理中心- 管理员权限/ 用户发博客页面】GET /api/getTags*/
export async function getTags(options) {
  return request('/api/getTags', {
    method: 'GET',
    ...(options || {}),
  });
}



/** 此处后端没有提供注释 GET /api/notices */

export async function getNotices(options) {
  return request('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
/** 获取规则列表 GET /api/rule */

export async function rule(params, options) {
  return request('/api/rule', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 新建规则 PUT /api/rule */

export async function updateRule(options) {
  return request('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}
/** 新建规则 POST /api/rule */

export async function addRule(options) {
  return request('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 删除规则 DELETE /api/rule */

export async function removeRule(options) {
  return request('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}