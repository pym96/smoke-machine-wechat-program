// pages/setting/index.js

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    headIcon: 'images/icon_default.png',
    deviceName: "设备编号",
    deviceId: '',
    addDeviceId: '',
    scene: 0,
    code: '',
    services: '',
    tel: '',
    isLogin: false,
    agreeGetUserProfile: false,
    list: [{
        icon: "images/feedback.png",
        title: "意见反馈",
        click: "feedback",
      },
      {
        icon: "images/us.png",
        title: "关于我们",
        click: "about"
      }
    ],
    settingDetails: [{
        icon: "images/devices.png",
        title: "设备选择",
        click: "choices"
      },
      {
        icon: "images/shopping.png",
        title: "商城",
        click: "shopping"
      }
    ]
  },


  login() {
    let that = this;
    if (!that.data.agreeGetUserProfile) {
      wx.showToast({
        title: '请同意用户授权',
        icon: 'error',
        duration: 2000
      })
      return;
    }


    // 选择是否开启订阅通知
    wx.requestSubscribeMessage({
      tmplIds: ['1kz2gJdUSQqpd4CS7Av3sAsTrWNC9d5e_S2ZmPzIE9g'],
      success: (res) => {
        console.log("同意开启订阅通知")


        wx.login({
          success: (res) => {
            if (res.code) {
              wx.request({
                url: 'https://www.yiyu951.xyz/login/userLogin',
                method: 'POST',
                data: {
                  code: res.code
                },
                success: (res) => {
                  console.log(res.data);
                  // 将数据保存在本地
                  wx.setStorageSync('session_key', res.data.session_key);
                  wx.setStorageSync('openid', res.data.openid);
                  wx.setStorageSync('unionid', res.data.unionid);
                  console.log("保存成功");
                  wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000
                  })
                  console.log("session_key=", wx.getStorageSync('session_key'))
                  console.log("openid=", wx.getStorageSync('openid'))
                  console.log("unionid=", wx.getStorageSync('unionid'))

                  app.globalData.isLogin = true;

                  console.log(that.data)
                  console.log(that.data.scene);


                  wx.showToast({
                    title: '登录成功',
                    icon: "success",
                    duration: 2000,
                  })

                  if (that.data.addDeviceId != '') {
                    wx.request({
                      url: 'https://www.yiyu951.xyz/device/getDeviceList',
                      method: 'POST',
                      data: {
                        openid: wx.getStorageSync('openid')
                      },
                      success: (res) => {
                        console.log(res.data)
                        app.globalData.deviceList = res.data;

                        console.log("device_list = ", res.data)
                        for (let i in res.data) {
                          console.log(res.data[i], "--", that.data.addDeviceId)
                          if (res.data[i] == that.data.addDeviceId) {
                            wx.showToast({
                              title: '已添加',
                              icon: 'success',
                              duration: 2000,
                              success: ()=>{
                                wx.switchTab({
                                  url: '/pages/choices/index',
                                })
                              }
                            })




                            return ;
                          }
                        }

                        console.log("add device=", that.data.addDeviceId)
                        wx.request({
                          // 这里定义后端的接口
                          url: 'https://www.yiyu951.xyz/device/addDevice',
                          method: 'POST',
                          data: {
                            device_id: that.data.addDeviceId,
                            openid: wx.getStorageSync('openid')
                          },

                          success: (res) => {
                            // request_res = res.data;
                            console.log("res : " + res.data);
                            if (res.data === true) {
                              // 成功后记录用户的设备id,并根据不同的id进行相应的设备选择
                              wx.showToast({
                                title: '添加成功',
                                icon: 'success',
                                duration: 2000,
                                success: (res)=>{
                                  wx.switchTab({
                                    url: '/pages/choices/index',
                                  })
                                }
                              })


                            } else {
                              wx.showToast({
                                title: '添加失败',
                                icon: 'error',
                                duration: 2000,
                                success: ()=>{
                                  wx.switchTab({
                                    url: '/pages/self/self',
                                  })
                                }
                              })

                            }
                          },
                          fail: (res) => {
                            console.log("add device error:", res);
                            wx.showToast({
                              title: '无法识别id',
                              icon: 'error',
                              duration: 2000,
                            })
                          }
                        })
                      }
                    })
                  } else {
                    wx.switchTab({
                      url: '/pages/self/self',
                    })
                  }
                },

                fail: (res) => {
                  wx.showToast({
                    title: '登录失败',
                    icon: "error",
                    duration: 2000,
                  })
                }
              })
            }
          },
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })





    console.log("我点击了登陆按钮");


  },


  getUserProfile() {
    let that = this;

    wx.getUserProfile({
      desc: '用户展示用户信息',
      success: (res) => {
        console.log("获取用户信息成功")
        console.log(res)

        app.globalData.headIcon = res.userInfo.avatarUrl;
        app.globalData.username = res.userInfo.nickName;
        this.setData({
          agreeGetUserProfile: true,
        })

        wx.showToast({
          title: '获取信息成功',
          icon: "success",
          duration: 2000,
        })

      },
      fail: function (res) {
        console.log("获取用户信息失败")
        console.log(res)
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let obj = wx.getLaunchOptionsSync();
    let scene = obj.scene;
    let that = this;
    let id = options.device_id;
    console.log(options);
    if (scene === 1017) {
      console.log("扫码进入小程序");
      that.setData({
        deviceId: options.deviceId,
        scene: obj.scene
      });
      console.log(that.data.deviceId);
      console.log(that.data.scene);
      console.log("获取设备ID成功");
    }

    if (id) {
      that.setData({
        'addDeviceId': id,
      })
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (app.globalData.isLogin) {
      console.log(app.globalData.headIcon);
      this.setData({
        isLogin: app.globalData.isLogin,
        headIcon: app.globalData.headIcon,
        username: app.globalData.username
      });
    }
  },




})