// pages/setWIFI/setWIFI.js

/** 设置WIFI密码流程
 * 搜索  蓝牙, 三个参数[deviceId -> serviceId -> characteristicsId]
 * startBluetoothDevicesDiscovery 搜索设备
 * onBluetoothDeviceFound 有新设备的函数回调
 * 根据device.name == ""，选择device有 *deviceId*,
 * createBLEConnection 创建BLE连接，成功后
 * 、
 * 
 * 
 * getBLEDeviceServices 获取 *serviceId*
 * getBLEDeviceCharacteristics 获取 *characteristicsId*
 * writeBLECharacteristicValue 发送数据
 */
const BLE_Name = "HC";
 const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSetWIFIPassword: false,
    bluetoothState: false,
    deviceId: '',
    account: '',
    psd: '',
    blueId: '',
    BLEdeviceId: '',
    BLEdevice: '',
  },
  customData: {
    deviceId: '',
    deviceList: [],
    services: [],
    device: '',
    wifiList: []
  },
  // 获取账户和密码
  get_account: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  get_psd: function (e) {
    this.setData({
      psd: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 跳转参数
    if (options.deviceId === undefined) {
      wx.showToast({
        title: '上一个界面的deviceId未定义',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    console.log("Options device ID " + options.deviceId)
    console.log("Options SetWIFIPassword state is " + options.isSetWIFIPassword)

    // 设置了WFIE密码和设备id
    this.setData({
      deviceId: options.deviceId,
      isSetWIFIPassword: options.isSetWIFIPassword === false ? false : true
    });

    /**
     * 微信蓝牙模块初始化
     */
    const self = this
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('search.js[onLoad]: openBluetoothAdapter success')
        app.globalData.BluetoothState = true
        self.startSearchDevs() // 搜索附近蓝牙
      },
      fail: function (err) {
        console.log('search.js[onLoad]: openBluetoothAdapter fail')
        if (err.errCode === 10001) { // 手机蓝牙未开启
          app.globalData.BluetoothState = false
          wx.showLoading({
            title: '请开启手机蓝牙',
          })
        } else {
          console.log(err.errMsg)
        }
      }
    })
    /**
     * 监听蓝牙适配器状态变化
     */
    wx.onBluetoothAdapterStateChange(function (res) {
      // console.log('search.js[onLoad]: onBluetoothAdapterStateChange')
      if (res.available) {
        // console.log('search.js[onLoad]: BluetoothState is true')
        app.globalData.BluetoothState = true
        wx.openBluetoothAdapter({
          success: function (res) {
            app.globalData.BluetoothState = true
            wx.hideLoading()
          },
        })
      } else {
        // console.log('search.js[onLoad]: BluetoothState is false')
        app.globalData.BluetoothState = false
        app.globalData.connectState = false
        wx.showLoading({
          title: '请开启手机蓝牙',
        })
      }
    })
    /**
     * 监听BLE蓝牙连接状态变化
     */
    wx.onBLEConnectionStateChange(function (res) {
      if (res.connected) {
        // console.log('connected')
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          success: function (res) {
            app.globalData.connectState = true
          }
        })
      } else {
        // console.log('disconnect')
        wx.hideLoading()
        wx.showToast({
          title: '已断开连接',
          icon: 'none',
          success: function (res) {
            app.globalData.connectState = false
          }
        })
      }
    })


  },

  findWifi: function () {

    wx.startWifi({
      success: (res) => {
        wx.getWifiList({
          success: (res) => {
            wx.onGetWifiList((res) => {
              console.log(res.data)
              // 如果res.data是一个列表，then 直接将它赋值给wifiList.
            })
          }
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.startSearchDevs()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.connectState) {
      this.setData({
        bluetoothState: true
      })
    }

  },

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
   * 开始搜索附近蓝牙
   */
  startSearchDevs: function () {
    const self = this
    wx.startBluetoothDevicesDiscovery({ // 开启搜索
      allowDuplicatesKey: false,
      success: function (res) {
        wx.onBluetoothDeviceFound(
          function (devices) {
            console.log("蓝牙设备有更新: ", devices);
            let deviceId = "";
            let serviceId = '';
            let deviceName = BLE_Name;
            let device = "";
            let isFind = false;
            if ((devices.name && devices.name ==BLE_Name)) {
              isFind = true;
              deviceId = devices.deviceId;
              device = devices;
            }
            if (devices.devices && devices.devices[0].name == BLE_Name) {
              isFind = true;
              deviceId = devices.devices[0].deviceId;
              device = devices.devices[0];
            }
            if (devices[0] && devices[0].name ==BLE_Name) {
              isFind = true;
              deviceId = devices[0].deviceId;
              device = devices[0];
            }

            /**
             * 开始连接
             */
            if (isFind) {
              console.log("搜索到", BLE_Name);
              if (app.globalData.BluetoothState) {

                wx.createBLEConnection({
                  deviceId: deviceId,
                  deviceName: deviceName,
                  timeout: 10000, // 10s连接超时
                  success: function (res) {
                    console.log("蓝牙连接成功")
                    self.setData({
                      blueId: deviceId
                    })

                    self.setData({
                      'bluetoothState': true,
                      'BLEdeviceId': deviceId
                    })
                    // self.setData({
                    //   bluetoothState: true
                    // })
                  },
                  fail: function(res){
                    console.log("连接蓝牙失败, ", res)
                  }
                })
              }
            } else {
              console.log("未搜索到", BLE_Name)
            }
          })
      }
    })
  },

  sendData: function (event) {

    console.log("send BLE data, event=", event);
    // // --->
    let that = this;
    let deviceId = that.data.BLEdeviceId;
    let device = that.data.BLEdevice;
    // 连接成功，输入WIFI账号 密码
    let WIFI_account = that.data.account;
    let WIFI_password = that.data.psd;

    console.log(BLE_Name, " ,device: ", device);
    console.log("WIFI=", WIFI_account, WIFI_password)
    wx.getBLEDeviceServices({
      deviceId: deviceId,
      success: function (res) {
        
        // app.globalData.isSetWIFIPassword = true
        
        // that.setData({
        //   isSetWIFIPassword:app.globalData.isSetWIFIPassword
        // })

        // console.log(`After set wifi current set wifi state is ${da}`)

        const services = res.services.filter((item, i) => {
          return !/^000018/.test(item.uuid)
        })
        console.log(services)
        
        let serviceId = services[0].uuid;
        wx.getBLEDeviceCharacteristics({
          deviceId: deviceId,
          serviceId: serviceId,
          success: function (res) {

            console.log("getBLEDeviceCharacteristics: ", res)
            
            let characteristicId = res.characteristics[0].uuid; // 特征值ID
            for(let i = 0; i < res.characteristics.length; i++){
              if(res.characteristics[i].properties.write){
                characteristicId =  res.characteristics[i].uuid;
                break;
              }
            }
            const sendText = `${WIFI_account}+${WIFI_password}`;
            const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
            // console.log("sendText = ", sendText);
            console.log("characteristicId = ", characteristicId);
            console.log("sendPackage = ", sendPackage);

            for (let i = 0; i < sendPackage.length; i++) {
              wx.writeBLECharacteristicValue({
                deviceId,
                serviceId,
                characteristicId,
                value: app.string2buf(sendPackage[i]),
                success: function (res) {
                  that.setData({
                    sendLength: that.data.sendLength + sendPackage[i].length // 更新已发送字节数
                  })
                  console.log("发送成功")
                  wx.showToast({
                    title: '修改成功',
                    duration : 800
                  })
                  wx.redirectTo({
                    url: `/pages/device/index?deviceId=${deviceId}`,
                    duration : 800
                  })
                },
                fail: function (res) {
                  console.log("发送失败, ", res)
                }
              })
            }

          },
          fail: function (res) {
            console.log("获取特征值ID失败:  ", res)
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '设备服务获取失败',
          icon: 'none'
        })

        console.log("设备服务获取失败", res)
      }
    })
    // <---

  }
})