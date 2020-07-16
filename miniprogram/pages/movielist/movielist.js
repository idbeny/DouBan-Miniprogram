// pages/movielist/movielist.js
const {db_collection_movie_list} = require("../../cloud/cloud")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    title: '',
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('movieUpdate', 'false') // 防止onShow再次请求
    this.data.options = options;
    this.getData(options);
  },

  // 获取数据
  getData(options) {
    let title = options.title;
    let sourceURL = options.sourceURL;
    if (sourceURL == 'cloud/movie_list') { // 云数据库
      db_collection_movie_list
      .where({
        sourceType: 1
      })
      .get()
      .then(res => {        
        let movies = [];
        for (let i = 0; i < res.data.length; i++) {
          // 本地电影和其他接口数据结构不一样，兼容处理
          let movie = res.data[i];
          // 处理星级
          this.updateMovieStar(movie);
          movies.push(movie);
        }
        this.setData({
          title,
          movies
        })
      })
      .catch(err => {
        wx.db.toastError('获取云数据失败');
      })
    } else {
      // 获取缓存数据
      wx.getStorage({
        key: sourceURL,
        success: (result) => {
          this.setData({
            movies: result.data,
            title
          })
        }
      });
    }
  },

  // 设置电影星级
  updateMovieStar(movie) {    
    let stars = parseInt(movie.rating.stars);
    if (stars == 0) return;
    movie.stars = {};
    movie.stars.on = parseInt(stars / 10);
    movie.stars.half = (stars - (movie.stars.on) * 10) > 0;
    movie.stars.off = parseInt((50 - stars) / 10);
  },

  // 监听-删除电影
  deleteMovie(event) {
    const movieId = event.detail.movieId;
    let movies = this.data.movies.filter(movie => {
      return movie._id != movieId;
    })
    this.setData({
      movies
    });
  },

  // 监听-更新电影状态
  updateMovieStatus(event) {
    const movieId = event.detail.movieId;
    const movieStatus = event.detail.status;
    let findMovie = this.data.movies.find(movie => {
      return movie._id == movieId;
    });    
    findMovie.status = movieStatus;
    this.setData(this.data);
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
    wx.getStorage({
      key: 'movieUpdate',
    }).then(res => {
      if (res.data == 'true') {
        wx.setStorage({
          data: 'false',
          key: 'movieUpdate',
        })
        this.getData(this.data.options);
      }
    })
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