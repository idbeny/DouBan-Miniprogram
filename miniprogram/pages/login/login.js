// pages/login/login.js
Page({
  data: {
    wechatLogin: "微信登录",
    doubanLogin: "已有豆瓣账号登录",
    agreement: "登录表示同意",
    agreementLink: "豆瓣使用协议/隐私协议"
  },
  
  wechatLogin() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  doubanLogin() {
    var a = -10, b = 20;
  },

  openAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    });
  },
  
  // 云开发
  cloudDev() {
    wx.switchTab({
      url: '/pages/clouddev/cloud-dev/cloud-dev'
    })
  }
})