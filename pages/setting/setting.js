// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  root_add_device: function () {
    wx.showModal({
      title: '添加设备',
      editable: true,
      placeholderText: "请输入您的设备ID",
      success(res) {
        if (res.confirm) {
          let addDeviceId = res.content;

          // 17MAC
          // 前端 长度等 校验

          // 后端 数据库 校验
          wx.request({
            // 这里定义后端的接口
            url: `https://www.yiyu951.xyz/device/addDeviceToMap?device_id=${addDeviceId}`,
            // data: {
            //   'device_id': addDeviceId
            // },
            method: 'GET',
            success: (res) => {
              
              console.log("res : " + res.data);
              if (res.data === true) {
                // 成功后记录用户的设备id,并根据不同的id进行相应的设备选择
                wx.showToast({
                  title: '添加成功',
                  icon: 'success'
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
              console.log("fail: ", res)
              wx.showToast({
                title: '无法识别id',
                icon: 'error',
                duration: 1000
              })
            }
          })

        }
      }
    })

  }

})