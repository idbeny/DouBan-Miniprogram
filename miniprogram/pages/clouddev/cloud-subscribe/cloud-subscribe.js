// pages/clouddev/cloud-subscribe/cloud-subscribe.js
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
    movie: {
      title: '',
      rating: '',
      date: '',
      mark: null
    }
  },

  // 选择模块
  bindPickerChange(event) {
    const index = event.detail.value;
    this.setData({
      index
    });
  },

  // input失去焦点
  inputResignActive(event) {
    const fieldName = event.currentTarget.dataset.field;
    const fieldValue = event.detail.value;
    this.data.movie
    this.setData({
      [`movie.${fieldName}`]: fieldValue
    })
  },

  // 上映日期
  bindDateChange(event) {
    const dateStr = event.detail.value;    
    this.setData({
      [`movie.date`]: dateStr
    })
  },

  // 发送订阅消息
  send() {
    let error;
    if (!this.data.movie.title) {
      error = '电影名称是必填项'
    } else if (!this.data.movie.rating) {
      error = '评分是必填项'
    } else if (this.data.movie.rating > 10) {
      error = '评分范围应小于10'
    } else if (!this.data.movie.date) {
      error = '日期是必填项'
    }
    if (error) {
      wx.db.toastError(error);
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'subscribeMessage',
        data: {
          path: this.data.pageRange[this.data.index].value,
          title: this.data.movie.title,
          average: this.data.movie.rating,
          date: this.data.movie.date,
          mark: (this.data.movie.mark || '感谢您的订阅')
        }
      }).then(res => {
        wx.hideLoading()
        if (res.result.errCode == 0) {
          wx.db.toastSuccess('已发送')
          setTimeout(() => {
            wx.navigateBack({
              delta: 0,
            })
          }, 1500);
        } else {
          wx.db.toastError('发送失败')
        }
      }).catch(err => {
        wx.hideLoading()
        console.log(err);
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const date = new Date()    
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`    
    this.setData({
      [`movie.date`]: dateStr
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