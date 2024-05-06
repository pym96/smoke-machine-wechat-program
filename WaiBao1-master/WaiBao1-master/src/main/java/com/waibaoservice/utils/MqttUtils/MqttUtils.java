package com.waibaoservice.utils.MqttUtils;

import org.eclipse.paho.client.mqttv3.*;


/***
 *  MQTT 工具类
 * @author YiMing
 * @date 2023/2/22
 * @since 1.0.0
 */
public class MqttUtils {
    private final static String MQTT_SERVER_URL     = "tcp://test.ranye-iot.net:1883";
    private final static int    CONNECTION_TIME_OUT = 60;
    private final static int    ALIVE_INTERVAL      = 60;
    private final static String DEFAULT_TOPIC       = "MA/TOPIC";
    private static String topic                     = DEFAULT_TOPIC;
    private final static MqttConnectOptions options = new MqttConnectOptions();
    private final static int QOS            = 0;
    private final static int MAX_BYTES_SIZE = 100;
    private static String publisherId       = "publisher_default_id";
    private static String subscribeId       = "subscribe_default_id";
    private static MqttClient publisher = null;
    private static MqttClient subscribe = null;

    static {
        try {
            publisher = new MqttClient(MQTT_SERVER_URL, publisherId);
            subscribe = new MqttClient(MQTT_SERVER_URL, subscribeId);
        } catch (MqttException e) {
            e.printStackTrace();
        }

    }

    public void setTopic(String topic) {
        MqttUtils.topic = topic;
    }

    public static void setSubscribeId(String subscribeId) {
        MqttUtils.subscribeId = subscribeId;
    }

    public static void setPublisherId(String publisherId) {
        MqttUtils.publisherId = publisherId;
    }

    private MqttUtils() {
        options.setConnectionTimeout(CONNECTION_TIME_OUT);
        options.setKeepAliveInterval(ALIVE_INTERVAL);
    }

    // 发布消息到服务器
    public static void publish(String message) {
        if (publisher != null) {
            // 发布消息
            try {
                publisher.connect(options);
                byte[] bytes = message.getBytes(); // 将消息转为字节类型
                if (bytes.length > MAX_BYTES_SIZE) {
                    throw new IllegalArgumentException("message to long");
                }
                MqttMessage msg = new MqttMessage(bytes);
                msg.setQos(QOS);
                Thread.sleep(10000); // 设置延迟10秒发送
                publisher.publish(topic, msg);
                publisher.disconnect(); // 断开连接
                publisher.close();
            } catch (MqttException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    // 从服务器接收消息
    public static void subscribe(MqttCallback callBack) {
        if (subscribe != null) {
            try {
                subscribe.setCallback(callBack);
                // 连接至服务器
                subscribe.connect(options);
                Thread.sleep(5000);
                subscribe.subscribe(topic, QOS);
            } catch (MqttException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
