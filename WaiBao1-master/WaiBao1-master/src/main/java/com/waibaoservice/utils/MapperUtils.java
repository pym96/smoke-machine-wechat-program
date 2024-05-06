package com.waibaoservice.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

/**
 * @author DJS
 * Date create 21:01 2023/2/19
 * Modified By DJS
 **/
public class MapperUtils {

    // Mybatis configuration file, and it's necessary.
    final private static String resource = "mybatis-config.xml";
    private static InputStream inputStream;
    final private static SqlSessionFactory sqlSessionFactory;
    final private static SqlSession sqlSession;

    private MapperUtils() {}

    static {
        try {
            inputStream = Resources.getResourceAsStream(resource);
        } catch (IOException e) {
            e.printStackTrace();
        }
        sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        sqlSession = sqlSessionFactory.openSession(true);
    }

    public static <T> T getMapper(Class<T> c) {
        return sqlSession.getMapper(c);
    }

}
