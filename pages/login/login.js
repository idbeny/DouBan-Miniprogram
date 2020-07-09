// pages/login/login.js
Page({
  data: {
    wechatLogin: "微信登录",
    doubanLogin: "已有豆瓣账号登录",
    agreement: "登录表示同意",
    agreementLink: "豆瓣使用协议/隐私协议"
  },
  
  wechatLogin() {
    wx.navigateTo({
      url: '/pages/profile/profile',
    });
  },

  doubanLogin() {
    var a = -10, b = 20;
  },

  openAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    });
      
  }
})