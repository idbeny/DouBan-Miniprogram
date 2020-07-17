// pages/clouddev/cloud-minicode/cloud-minicode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageRange: [
      {
        value: "pages/home/home",
        name: "首页",
      },
      {
        value: "pages/movielist/movielist?title=云数据库-电影列表&sourceURL=cloud/movie_list",
        name: "云数据库-电影列表",
      },
      {
        value: "pages/clouddev/cloud-dev/cloud-dev",
        name: "云开发",
      },
      {
        value: "pages/profile/profile",
        name: "我的",
      },
      {
        value: "pages/clouddev/cloud-database-insert/cloud-database-insert",
        name: "添加电影",
      }
    ],
    index: 0,
    fileID: ''
  },

  // 选择模块
  bindPickerChange(event) {
    const index = event.detail.value;
    this.setData({
      index
    });
    this.generateCode();
  },

  // 重置
  reset() {
    this.generateCode();
  },

  // 生成小程序码
  generateCode() {
    wx.cloud.callFunction({
      name: 'generateMPCode',
      data: {
        path: this.data.pageRange[this.data.index].value
      }
    }).then(res => {      
      const fileID = res.result.fileID;
      this.setData({fileID});
    }).catch(err => {
      wx.db.toastError('生成失败');
    })
  },

  // 长按事件
  codeLongpressHandle() {
    if (!this.data.fileID) return;
    wx.showActionSheet({
      itemList: ["保存相册", "预览大图"],
      itemColor: '#000000',        
    }).then(result => {
      const index = result.tapIndex;
      const filePath = this.data.fileID;
      var that = this;
      if (index == 0) { // 保存相册
        wx.getSetting({
          success(res) {         
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success () {      
                  that.downloadFile(filePath);
                },
                fail(err) {
                  wx.openSetting({
                    withSubscriptions: true,
                  })
                }
              })
            } else {
              that.downloadFile(filePath);
            }
          }
        })
      } else { // 预览大图
        wx.previewImage({
          urls: [filePath],
          fail(err) {
            wx.db.toastError('无法预览')
          } 
        })
      }
    });
  },

  // 下载图片
  downloadFile(filePath) {
    wx.cloud.downloadFile({
      fileID: filePath
    }).then(res => {
      this.saveToPhotosAlbum(res.tempFilePath);
    }).catch(err => {
      wx.db.toastError('下载失败')
    })
  },

  // 保存相册
  saveToPhotosAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath
    }).then(res => {
      wx.db.toastSuccess('保存成功')
    }).catch(err => {
      wx.db.toastError('保存失败')
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.generateCode();
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