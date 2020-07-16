// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        iconName: 'ic_cat_movie.png',
        title: '观影分析',
        hasCount: 0,
        hasDesc: '看过',
        tipsMark: '标记10部影片',
        tipsMarkDesc: '开启观影分析'
      },
      {
        iconName: 'ic_cat_book.png',
        title: '读书分析',
        hasCount: 0,
        hasDesc: '读过',
        tipsMark: '标记10本书',
        tipsMarkDesc: '开启读书分析'
      },
      {
        iconName: 'ic_cat_music.png',
        title: '音乐分析',
        hasCount: 0,
        hasDesc: '听过',
        tipsMark: '标记10张唱片',
        tipsMarkDesc: '开启音乐分析'
      }
    ]
  },

  login() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
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

  }
})