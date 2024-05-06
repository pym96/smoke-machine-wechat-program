package com.waibaoservice.service;

import com.waibaoservice.pojo.User;

public interface UserService {
    // 用户登录
    boolean loginService(User user);

    // 用户注册
    boolean userRegister(User user);
}
