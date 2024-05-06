package com.example.waibaoservice;

import com.waibaoservice.mapper.UserMapper;
import com.waibaoservice.pojo.User;
import com.waibaoservice.utils.MapperUtils;
import com.waibaoservice.utils.MqttUtils.MqttUtils;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest(classes = WaiBao1ApplicationTests.class)
class WaiBao1ApplicationTests {
    @Test
    void contextLoads() {
        final UserMapper mapper = MapperUtils.getMapper(UserMapper.class);
        final User user_by_id = mapper.selectUserById(1);
        final User user_by_tel = mapper.selectUserByTel("2312312");
        System.out.println(user_by_id);
        System.out.println(user_by_tel);
    }

    @Test
    void insertTest() {
        User user = new User();
        user.setTel("12343245321");
        user.setPassword("c324c23c");
        final UserMapper mapper = MapperUtils.getMapper(UserMapper.class);
        int result = mapper.insertUser(user);
        System.out.println(result);
        System.out.println(user);
    }

    @Test
    void testMqttUtils() {

    }

}
