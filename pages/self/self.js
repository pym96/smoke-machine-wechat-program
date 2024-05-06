const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headIcon: "",
    isLogin: false,
    username: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    let that = this;
    that.setData({
      headIcon: app.globalData.headIcon,
      isLogin: app.globalData.isLogin,
      username: app.globalData.username
    })
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
    console.log(app.globalData)
    let that = this;
    that.setData({
      headIcon: app.globalData.headIcon,
      isLogin: app.globalData.isLogin,
      username: app.globalData.username
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  onRouteDone: function(){
    let that = this;
    console.log(app.globalData)
    console.log(that.data)
    that.setData({
      headIcon: app.globalData.headIcon,
      isLogin: app.globalData.isLogin,
      username: app.globalData.username
    })
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



  redirect_login: function(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  redirect_choice: function(){
    wx.switchTab({
      url: '/pages/choices/index',
    })
  },

  redirect_shopping: function(){

  },
  redirecr_feedback: function(){
    wx.navigateTo({
      url: '/pages/feedback/index',
    })
  },

  redirecr_about: function(){

  },
  redirecr_setting: function(){
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  }



})