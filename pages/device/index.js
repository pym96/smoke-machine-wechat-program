// pages/device/device.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId: '',
    isSetWIFIPassword: true,
    kitchen_hood_data:{
      device_state : '关机',
      time_remaining: 0
    },
    gas_stove:{
      device_state: '关机',
      time_remaining : 0
    }
  },

  customData: {
    deviceId: '',
  },


  onShow: function(){

    let that = this;
  
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    console.log("options : ", options)
    that.setData({
      deviceId: options.deviceId,
    });

    // WIFI
    that.setData({
      "that.data.isSetWIFIPassword":app.isSetWIFIPassword
    })

    wx.request({
      url: 'https://www.yiyu951.xyz/wife/getWifeStatus',
      method : 'POST',
      data : {
        deviceId : options.deviceId
      },
      success: function(res)
      {
        // //res.data {'success': true, 'WIFI_account': '', 'WIFI_password': ''}
        //res.data {'success': true}
        console.log(res.data)
        if(res.data) // 已经配置WIFI
        {
          console.log("配置好了")
          that.setData({
            isSetWIFIPassword: true,
          });
          // WIFI -> 更新数据
          that.updateData();
        }
        else // 未配置WIFI
        {
          that.setData({
            isSetWIFIPassword: true,
          });
        }
      }
    })

  },

  /**
   * 设置WIFI密码
   */
  setWIFIPassword: function(event)
  {
    let that = this;
    console.log("-----------------Currenet set Wifi password state is :" + that.data.isSetWIFIPassword)
    wx.navigateTo({
      url: `/pages/setWIFI/index?deviceId=${this.data.deviceId}`,
    })
  },

  // 计算时差
  calTime: function(currentDate, taskEndDate) {
        // let currentDate = new Date();
        // let taskEndDate = new Date(app.globalData.endTime);
        if (currentDate < taskEndDate) {
          let dateCopy = new Date(taskEndDate);
          dateCopy.setHours(taskEndDate.getHours() - currentDate.getHours());
          dateCopy.setMinutes(taskEndDate.getMinutes() - currentDate.getMinutes());
          let dateStrArr = dateCopy.toTimeString().substr(0, 8).split(':');
          console.log(dateCopy.toTimeString())
          console.log(dateStrArr[0])
          console.log(dateStrArr[1])
          console.log(dateStrArr[2])
          let m = parseInt(dateStrArr[0]) * 60 + parseInt(dateStrArr[1]);
          if (m > 0) return m;
          else return m + 1;
        }
        return 0;
  },

  updateData: function() {
    let that = this;
    // 更新剩余时间、状态
    // 更新油烟机
    wx.request({
      url: 'https://www.yiyu951.xyz/kitchen/getEndTime',
      method : 'POST',
      data : {
        device_id : that.data.deviceId
      },
      success: function(res)
      {
        console.log(res.data)
        if (res.data === '') {
          that.setData({
            kitchen_hood_data : {
              device_state : "关机",
              time_remaining : ''
            }
          });
        }
        else {
          let p = that.calTime(new Date(), new Date(res.data))
          if (p === 0) {
            that.setData({
              kitchen_hood_data : {
                device_state : "关机",
                time_remaining : ''
              }
            })
          }
          else {
            that.setData({
              kitchen_hood_data : {
                device_state : "开机",
                time_remaining : p
              }
            })
          }
          
        }
        
      }
    })
    // 更新燃气灶
    wx.request({
      url: 'https://www.yiyu951.xyz/gas/getEndTime',
      method : "POST",
      data : {
        device_id : that.data.deviceId
      },
      success : (res) => {
        console.log(res.data)
        if (res.data === '') {
          that.setData({
            gas_stove : {
              device_state : "关机",
              time_remaining : ''
            }
          })
        }
        else {
          let p = that.calTime(new Date(), new Date(res.data));
          if (p === 0) {
            that.setData({
              gas_stove : {
                device_state : "关机",
                time_remaining : ''
              }
            })
          }
          else {
            that.setData({
              gas_stove : {
                device_state : "开机",
                time_remaining : p
              }
            })
          }
        }
      }
    })
  },

  // 设置燃气灶关机时间
  gas_stove_set_close_time :function(e) {
    let that = this;
    // if (that.data.isSetWIFIPassword) {
    //   wx.showToast({
    //     title: '未设置WIFI',
    //     icon : 'error',
    //     duration:800
    //   })
    //   return;
    // }
    let hour_clicked = e.detail.value[0] + e.detail.value[1]
    let minute_clicked = e.detail.value[3] + e.detail.value[4]
    console.log("gas_stove_set_close_time")
    let positive_time = `${hour_clicked}:${minute_clicked}:00`
    console.log(positive_time)
    let hour = parseInt(hour_clicked);
    let minute = parseInt(minute_clicked);
    let t = hour * 60 + minute;
    that.setData({
      gas_stove : {
        device_state: '开机',
        time_remaining : t
      }
    })
    // 发送请求
    wx.request({
      url: 'https://www.yiyu951.xyz/gas/setTimer',
      method : 'POST',
      data : {
        positive_time : positive_time,
        device_id : that.data.deviceId,
        openId : wx.getStorageSync('openid'),
        status : 1
      },
      success : (res) => {
        wx.showToast({
          title: '定时成功',
          icon : 'success',
          duration : 800
        })
      }
    })
  },

  gas_stove_switch_state: function(e) {
    // 燃气灶立即关机
    let that = this;
    // if (that.data.isSetWIFIPassword) {
    //   console.log("------------------------------------")
    //   wx.showToast({
    //     title: '未设置WIFI',
    //     icon : 'error',
    //     duration:800
    //   })
    //   return;
    // }
    wx.request({
      url: 'https://www.yiyu951.xyz/gas/shutdown',
      method : 'POST',
      data : {
        device_id : that.data.deviceId,
        openId : wx.getStorageSync('openid'),
        status : that.data.gas_stove.device_state === '关机' ? 0 : 1
      },
      success : (res) => {
        if (res.data) {
          wx.showToast({
            title: '设置成功',
            icon : "success",
            duration : 800
          })
          that.setData({
            gas_stove : {
              device_state : '关机',
              time_remaining : 0
            }
          })
        }
        else {
          wx.showToast({
            title: '设置成功',
            icon : "success",
            duration : 800
          })
          that.setData({
            gas_stove : {
              device_state : '开机',
              time_remaining : 0
            }
          })
        }
      }
    })
    
  },

  kitchen_hood_set_close_time: function(e)
  {
    console.log("kitchen_hood_set_close_time");
    let that = this;
    // if (that.data.isSetWIFIPassword) {
    //   wx.showToast({
    //     title: '未设置WIFI',
    //     icon : 'error',
    //     duration:800
    //   })
    //   return;
    // }
    let hour_clicked = e.detail.value[0] + e.detail.value[1]
    let minute_clicked = e.detail.value[3] + e.detail.value[4]
    console.log("gas_stove_set_close_time")
    let positive_time = `${hour_clicked}:${minute_clicked}:00`
    let hour = parseInt(hour_clicked);
    let minute = parseInt(minute_clicked);
    let t = hour * 60 + minute;
    that.setData({
      kitchen_hood_data : {
        device_state: '开机',
        time_remaining : t
      } 
    })
    // 油烟机设置关机时间
    wx.request({
      url: 'https://www.yiyu951.xyz/kitchen/setTimer',
      method : 'POST',
      data : {
        positive_time : positive_time,
        device_id : that.data.deviceId,
        openId : wx.getStorageSync('openid'),
        status : 1
      },
      success : (res) => {
        wx.showToast({
          title: '定时成功',
          icon : 'success',
          duration : 800
        })
      }
    })
  },
  
  kitchen_hood_swtich_state: function(e)
  {
    console.log("kitchen_hood_swtich_state")

    let that = this;
    // 油烟机立即开关机
    // if (that.data.isSetWIFIPassword) {
    //   wx.showToast({
    //     title: '未设置WIFI',
    //     icon : 'error',
    //     duration:800
    //   })
    //   return;
    // }

    wx.request({
      url: 'https://www.yiyu951.xyz/kitchen/shutdown',
      method : 'POST',
      data : {
        device_id : that.data.deviceId,
        openId : wx.getStorageSync('openid'),
        status : that.data.kitchen_hood_data.device_state === '关机'? 0:1
      },
      success : (res) => {
        if (res.data) {
          wx.showToast({
            title: '设置成功',
            icon : "success",
            duration : 800
          })
          that.setData({
            kitchen_hood_data : {
              device_state : '关机',
              time_remaining : 0
            }
          })
        }
        else {
          wx.showToast({
            title: '设置成功',
            icon : "success",
            duration : 800
          })
          that.setData({
            kitchen_hood_data : {
              device_state : '开机',
              time_remaining : 0
            }
          })
        }
      }
    })
  }
})