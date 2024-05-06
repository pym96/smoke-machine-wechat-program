// app.js
// change
App({
  onLaunch() {},
  globalData: {
    isOnline: false, // 是否联网，发送request
    BluetoothState: false, // 蓝牙状态
    connectState: false,
    isLogin: false,
    userTel: null,
    password: null,
    headIcon: "/images/TabBar/normal_u418.svg",
    username: '微信用户',
    endtime: '00:00:00',
    isSetWIFIPassword:false,
    idLen: 16,
    deviceList:  ['00:1B:44:11:3A:B7', '00:1B:44:11:3A:B2']
  },
  subPackage: function (str) {
    const packageArray = []
    for (let i = 0; str.length > i; i += 20) {
      packageArray.push(str.substr(i, 20))
    }
    return packageArray
  },
  string2buf: function (str) {
    // 首先将字符串转为16进制
    let val = ""
    for (let i = 0; i < str.length; i++) {
      if (val === '') {
        val = str.charCodeAt(i).toString(16)
      } else {
        val += ',' + str.charCodeAt(i).toString(16)
      }
    }
    // 将16进制转化为ArrayBuffer
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  },

})