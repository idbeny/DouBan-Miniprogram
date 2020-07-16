//app.js
App({
  // 初始化豆瓣定制化弹框
  initDBToast() {
    const toastTypeNormal = 0; // 普通文字类型
    const toastTypeSuccess = 1; // 成功提示类型
    const toastTypeError = 2; // 错误提示类型
    let commonToast = (title, type, duration = 1500) => {
      let options = {
        title: title,
        icon: 'none',
        duration: duration
      };
      if (type == toastTypeSuccess) {
        options.icon = 'success'
      } else if (type == toastTypeError) {
        options.icon = '/assets/imgs/upsdk_cancel_normal.png';
      }
      wx.showToast(options);
    };

    // 普通提示
    wx.db.toast = (title, duration) => {
      commonToast(title, toastTypeNormal, duration);
    };

    // 成功提示
    wx.db.toastSuccess = (title, duration) => {
      commonToast(title, toastTypeSuccess, duration);
    };

    // 错误提示
    wx.db.toastError = (title, duration) => {
      commonToast(title, toastTypeError, duration);
    };
  },

  onLaunch: function () {
    // 初始化云开发
    wx.cloud.init({
      traceUser: true
    });

    

    // 豆瓣定制化信息
    wx.db = {};

    // Toast必须进行初始化，否则undefined
    this.initDBToast();

    // 拼接请求地址
    wx.db.requestURL = (url) => {
      return `https://api.douban.com/${url}`;
    };

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    wx.db.statusBarHeight = systemInfo.statusBarHeight;
    let navBarHeight = 44.0;
    if (systemInfo.platform == 'android') {
      navBarHeight = 48.0;
    }
    wx.db.navBarHeight = navBarHeight;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})