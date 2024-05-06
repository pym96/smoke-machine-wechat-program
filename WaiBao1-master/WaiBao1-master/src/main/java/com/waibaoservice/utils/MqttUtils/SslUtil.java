package com.waibaoservice.utils.MqttUtils;


import org.apache.commons.lang3.StringUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMReader;
import org.bouncycastle.openssl.PasswordFinder;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.Security;
import java.security.cert.X509Certificate;


/***
 *  两种方式验证
 * @author YiMing
 * @date 2023/2/22
 * @since 1.0.0
 */
public class SslUtil {

    /**
     * 用证书和私钥配置sslContext
     *
     * @param caCrtFile
     *            CA证书（验证连接）
     * @param crtFile
     *            发给对方的证书
     * @param keyFile
     *            pem 私钥（请求连接的消息是用公钥加密的，需要用私钥解密）
     * @param password
     *            私钥密码
     * @return
     * @throws Exception
     */
            public static SSLSocketFactory getSocketFactory(final String caCrtFile, final String crtFile, final String keyFile,
            final String password, String protocal) throws Exception {
                Security.addProvider(new BouncyCastleProvider());
                // load CA certificate
                PEMReader reader = new PEMReader(new InputStreamReader(new ByteArrayInputStream(Files.readAllBytes(Paths.get(caCrtFile)))));
                X509Certificate caCert = (X509Certificate)reader.readObject();
                reader.close();

                // load client certificate
                reader = new PEMReader(new InputStreamReader(new ByteArrayInputStream(Files.readAllBytes(Paths.get(crtFile)))));
                X509Certificate cert = (X509Certificate)reader.readObject();
                reader.close();

                // load client private key
                reader = new PEMReader(
                        new InputStreamReader(new ByteArrayInputStream(Files.readAllBytes(Paths.get(keyFile)))),
                    new PasswordFinder() {
                        @Override
                        public char[] getPassword() {
                            return password.toCharArray();
                        }
                    }
            );
            KeyPair key = (KeyPair)reader.readObject();
            reader.close();

            // CA certificate is used to authenticate server
            KeyStore caKs = KeyStore.getInstance(KeyStore.getDefaultType());
            caKs.load(null, null);
            caKs.setCertificateEntry("ca-certificate", caCert);
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            tmf.init(caKs);

            // client key and certificates are sent to server so it can authenticate us
            KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
            ks.load(null, null);
            ks.setCertificateEntry("certificate", cert);
            ks.setKeyEntry("private-key", key.getPrivate(), password.toCharArray(), new java.security.cert.Certificate[]{cert});
            KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
            kmf.init(ks, password.toCharArray());

            // 空时 默认
            if(StringUtils.isBlank(protocal)){
                protocal= "TLSv1.1";
            }

            SSLContext context = SSLContext.getInstance(protocal);//"TLSv1.1"
            context.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);

            return context.getSocketFactory();
        }


        public static SSLSocketFactory getSocketFactorySingle(final String caCrtFile, String protocol) throws Exception {
            Security.addProvider(new BouncyCastleProvider());

            // load CA certificate
            PEMReader reader = new PEMReader(new InputStreamReader(new ByteArrayInputStream(Files.readAllBytes(Paths.get(caCrtFile)))));
            X509Certificate caCert = (X509Certificate)reader.readObject();
            reader.close();
            // client key and certificates are sent to server so it can authenticate us
            KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());//"JKS"
            ks.load(null, null);
            ks.setCertificateEntry("ca-certificate", caCert);
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());//"PKIX"
            tmf.init(ks);
            // finally, create SSL socket factory
            if(StringUtils.isBlank(protocol)){
                protocol= "TLSv1.1";
            }
            SSLContext context = SSLContext.getInstance(protocol);//"TLSv1.1"
            context.init(null, tmf.getTrustManagers(), new SecureRandom());
            return context.getSocketFactory();
        }


}