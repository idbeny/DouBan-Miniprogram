// pages/login/login.js
Page({
  wechatLogin() {
    wx.navigateTo({
      url: '/pages/profile/profile',
    });
  },

  doubanLogin() {
    console.log("豆瓣登录");
  },

  openAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    });
      
  }
})