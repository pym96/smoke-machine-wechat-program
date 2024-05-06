// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList: '',
    deviceId: '',
    mydeviceId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let addDeviceId = options.device_id;

    if (options.device_id) {
      if (app.globalData.isLogin) {
        wx.request({
          // 这里定义后端的接口
          url: 'https://www.yiyu951.xyz/device/addDevice',
          method: 'POST',
          data: {
            device_id: addDeviceId,
            openid: wx.getStorageSync('openid')
          },

          success: (res) => {
            request_res = res.data;
            console.log("res : " + res.data);
            if (res.data === true) {
              // 成功后记录用户的设备id,并根据不同的id进行相应的设备选择
              wx.showToast({
                title: '添加成功',
                icon: 'error'
              })

              wx.request({
                url: 'https://www.yiyu951.xyz/device/getDeviceList',
                method: 'POST',
                data: {
                  openid: wx.getStorageSync('openid')
                },

                success: (res) => {
                  console.log(res.data)
                  app.globalData.deviceList = res.data;
                  this.setData({
                    deviceList: res.data
                  })
                }
              })
            } else {
              wx.showToast({
                title: '添加失败',
                icon: 'error'
              })
              return;
            }

          },

          fail: (res) => {
            console.log("add device error:", res);
            wx.showToast({
              title: '无法识别id',
              icon: 'error',
              duration: 1000
            })
          }
        })
      } else {
        wx.navigateTo({
          url: `/pages/login/login?device_id=${options.device_id}`,
        })
      }
    } else {

      let that = this;
      that.setData({
        'deviceList': app.globalData.deviceList
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLogin) {
      wx.request({
        url: 'https://www.yiyu951.xyz/device/getDeviceList',
        method: 'POST',
        data: {
          openid: wx.getStorageSync('openid')
        },

        success: (res) => {
          console.log(res.data)
          this.setData({
            deviceList: res.data
          })
        }
      })
    }
  },


  check_device: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  to_device_detail: function (event) {
    console.log(event);
    let deviceId_ = event.currentTarget.id;
    console.log("点击 Id=", deviceId_)
    this.setData({
      deviceId: deviceId_
    })
    wx.navigateTo({
      url: `/pages/device/index?deviceId=${deviceId_}`,
    })

  },

  add_device: function () {
    let that = this;
    let request_res;
    if (app.globalData.isLogin) {
      wx.showModal({
        title: '添加设备',
        editable: true,
        placeholderText: "请输入您的设备ID",

        success(res) {
          if (res.confirm) {
            let addDeviceId = res.content;
            console.log('添加设备: ', addDeviceId);
            that.setData({
              deviceId: addDeviceId
            })
            // 17MAC
            // 前端 长度等 校验

            // 后端 数据库 校验

            wx.request({
              // 这里定义后端的接口
              url: 'https://www.yiyu951.xyz/device/addDevice',
              method: 'POST',
              data: {
                device_id: addDeviceId,
                openid: wx.getStorageSync('openid')
              },

              success: (res) => {
                request_res = res.data;
                console.log("res : " + res.data);
                if (res.data === true) {
                  // 成功后记录用户的设备id,并根据不同的id进行相应的设备选择
                  wx.redirectTo({
                    url: "/pages/device/index?deviceId=" + that.deviceId,
                  })
                } else {
                  wx.showToast({
                    title: '添加失败',
                    icon: 'error'
                  })
                  return;
                }

              },

              fail: (res) => {
                wx.showToast({
                  title: '无法识别id',
                  icon: 'error',
                  duration: 1000
                })
              }
            })

            // 更新数据
            if (request_res === true) {
              app.globalData.deviceList.push({
                'id': addDeviceId
              });
              let deviceList = that.data.deviceList;
              deviceList.push({
                'id': addDeviceId
              });
              that.setData({
                'deviceList': deviceList
              });
            }

          } else if (res.cancel) {
            console.log('取消添加设备')
          }
        }
      })
    } else {
      // 弹窗提醒
      wx.showModal({
        title: '提示',
        content: '登录后才可以使用相应功能，是否去登录？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定, 去登录');
            wx.switchTab({
              url: '/pages/self/self',
            })
            // 跳转界面或弹出窗口，实现添加设备

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  }
})