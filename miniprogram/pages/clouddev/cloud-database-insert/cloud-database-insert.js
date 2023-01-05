// pages/clouddev/cloud-database-insert/cloud-database-insert.js
const { db_collection_movie_list } = require("../../../cloud/cloud");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    movieId: '',
    // 是否编辑
    isEdit: false,
    // 错误提示
    error: '',
    // 数据来源（0/null:豆瓣, 1:云数据库, 2:云函数）
    sourceType: 1,
    // 数据状态（0/null：显示，1：隐藏）
    status: 0,
    // 封面
    fileID: '',
    // 电影名称
    title: '',
    // 电影时长
    duration: '',
    // 上映日期
    date: "",
    // 上映年份
    year: "",
    // 收藏数
    favCount: "",
    // 类型
    type: 'movie',
    // 评分
    rating: '',
    // 标签
    tags: [],
    taginput: ''
  },

  // 封面选择
  coverChoose(result) {
    wx.chooseImage({
      count: 1,
    }).then(res => {
      const filePath = res.tempFilePaths[0];
      const fileCmpts = filePath.split('.');
      var fileExten = fileCmpts[fileCmpts.length-1];
      const fileName = `${new Date().getTime()}.${fileExten}`;
      const cloudPath = `daben-1gy114rt9c66ed18.6461-daben-1gy114rt9c66ed18-1302465937/images/${fileName}`;
      wx.cloud.uploadFile({
        filePath,
        cloudPath
      }).then(res => {
        this.setData({
          fileID: res.fileID
        })
      })
    })
  },

  // input失去焦点
  inputResignActive(event) {
    const fieldName = event.currentTarget.dataset.field;
    const fieldValue = event.detail.value;
    if (fieldName == 'tag') {
      this.data.tags.push(fieldValue)
      this.setData(this.data)
    } else {
      this.setData({
        [`${fieldName}`]: fieldValue
      })
    }
  },

  // 上映日期
  bindDateChange(event) {
    const dateStr = event.detail.value;    
    this.setData({
      date: dateStr,
      year: dateStr.substr(0, 4)
    })
  },

  // 是否隐藏
  switchChange(event) {
    const value = event.detail.value;
    this.data.status = value?1:0;
  },

  // 标签删除
  tagTapHandle(event) {
    const index = event.currentTarget.dataset.index;
    this.data.tags.splice(index, 1);
    this.setData(this.data);
  },
  
  // 提交
  submitForm() {
    let error;
    if (this.data.fileID.length == 0) {
      error = '电影封面是必选项'
    } else if (this.data.title.length == 0) {
      error = '电影名称是必填项'
    } else if (this.data.duration.length == 0) {
      error = '电影时长是必填项'
    } else if (this.data.date.length == 0) {
      error = '日期是必填项'
    } else if (this.data.favCount.length == 0) {
      error = '收藏数是必填项'
    } else if (this.data.rating.length == 0) {
      error = '评分是必填项'
    } else if (this.data.rating > 10) {
      error = '评分范围应小于10'
    } else if (this.data.tags.length == 0) {
      error = '标签是必填项'
    }
    if (error) {
      this.setData({error})
    } else {
      wx.showLoading({
        title: '加载中',
      })
      const genres = this.data.tags;
      let data = {
        "status": this.data.status,
        "sourceType": this.data.sourceType,
        "rating":{
          "max":10,
          "average": this.data.rating,
          "stars": this.data.rating*5, // 因为分数满星是50分（区分满星和满分）
          "min":0
        },
        "genres": genres,
        "title": this.data.title,
        "durations": [
          `${this.data.duration}分钟`
        ],
        "collect_count": this.data.favCount,
        "mainland_pubdate": this.data.date,
        "subtype": this.data.type,
        "year": this.data.year,
        "images":{
            "small": this.data.fileID,
            "large": this.data.fileID,
            "medium": this.data.fileID
        }
      };
      if (this.data.isEdit) {
        db_collection_movie_list
        .doc(this.data.movieId)
        .update({data})
        .then(res => {
          wx.hideLoading()
          wx.db.toast('修改成功');
          setTimeout((args) => {
            wx.setStorageSync('movieUpdate', 'true');
            const pages = getCurrentPages();
            if (pages.length > 1) {
              wx.navigateBack();
            } else {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }
          }, 1000);
        })
        .catch(err => {
          wx.hideLoading()
          wx.db.toast('修改失败');
        }) 
      } else {
        db_collection_movie_list
        .add({data})
        .then(res => {
          wx.hideLoading()
          wx.db.toast('添加成功');
          setTimeout((args) => {
            wx.setStorageSync('movieUpdate', 'true');
            wx.switchTab({
              url: '/pages/home/home',
            })
          }, 1000);
        })
        .catch(err => {
          wx.hideLoading()
          wx.db.toast('添加失败');
        }) 
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const movieJSON = options.movieJSON;   
    if (movieJSON) {
      // 反序列化
      const movie = JSON.parse(movieJSON);
      this.data.movieId = movie._id;
      this.data.isEdit = true;
      this.data.sourceType = movie.sourceType;
      this.data.status = movie.status;
      this.data.fileID = movie.images.large;
      this.data.title = movie.title;
      this.data.duration = parseInt(movie.durations);
      this.data.date = movie.mainland_pubdate;
      const year = movie.mainland_pubdate.split('-')[0];  
      this.data.year = year;
      this.data.favCount = movie.collect_count;
      this.data.type = movie.subtype;
      this.data.rating = movie.rating.average;
      this.data.tags = movie.genres;
      this.setData(this.data);
    } else {
      const date = new Date()    
      const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`    
      this.setData({
        date: dateStr,
        year: date.getFullYear()
      })
    }
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