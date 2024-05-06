package com.waibaoservice.controller;

import com.waibaoservice.pojo.User;
import com.waibaoservice.pojo.User;
import com.waibaoservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


/**
 * @author DJS
 * Date create 22:54 2023/2/19
 * Modified By DJS
 **/

@RestController
@RequestMapping("/login")
public class UserController {
    private final UserService userService;

    // 依赖注入
    @Autowired
    public UserController (UserService userService) {
        this.userService = userService;
    }

    // 用户登录接口
    @PostMapping("/userLogin")
    public boolean login(@RequestBody User user) {
        System.out.println(user);
        return userService.loginService(user);
    }

    // 用户注册接口
    @PostMapping("/userRegister")
    public boolean register(@RequestBody User user) {
        return userService.userRegister(user);
    }
}
