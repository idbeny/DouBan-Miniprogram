// pages/home/home.js
const {db_collection_movie_list} = require("../../cloud/cloud")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sections: [
      {
        title: '云数据库',
        url: 'cloud/movie_list',
        movies: []
      },
      {
        title: '影院热映',
        url: 'v2/movie/in_theaters',
        movies: []
      },
      {
        title: '新片榜',
        url: 'v2/movie/new_movies',
        movies: []
      },
      {
        title: '口碑榜',
        url: 'v2/movie/weekly',
        movies: []
      },
      {
        title: '北美票房榜',
        url: 'v2/movie/us_box',
        movies: []
      },
      {
        title: 'Top250',
        url: 'v2/movie/top250',
        movies: []
      }
    ]
  },

  /**
   * 加载城市数据（传入的successFunc是一个回调函数）
   */
  getCityData(successFunc) {
    // 获取定位信息
    wx.getLocation({
      success: (result) => {
        // 反地理编码
        var reqTask = wx.request({
          url: 'https://api.map.baidu.com/reverse_geocoding/v3',
          data: {
            output: 'json',
            coordtype: 'wgs84ll',
            ak: 'G7tmzExbGqCkL7n6QNRKeihdwofGitxW',
            location: `${result.latitude},${result.longitude}`
          },
          success: (result) => {            
            let city = result.data.result.addressComponent.city;
            // 去除'市'
            city = city.substring(0, city.length - 1);
            successFunc && successFunc(city)
          },
          fail: (error) => {
            console.log(error);
            wx.db.toast('获取城市失败');
          }
        });
      },
      fail: () => {
        wx.db.toast('获取定位失败');
      }
    });
  },

  // 获取电影数据
  getMovieData() {
    for (let i = 0; i < this.data.sections.length; i++) {
      const section = this.data.sections[i];
      // 优先读取缓存数据（因为是本地数据，速度相对较快，使用同步即可）
      let cachedMovies = wx.getStorageSync(section.url);
      if (i != 0 && cachedMovies.length != 0) {
        section.movies = cachedMovies;
        // 刷新界面
        this.setData(this.data);
      } else {
        if (i == 0) { // 云数据库
          db_collection_movie_list
          .where({
            sourceType: 1
          })
          .get().then(result => {            
            this.cached(i, result.data);
          }).catch(err => {            
            section.movies = cachedMovies;
            // 刷新界面
            this.setData(this.data);
          })
        } else if (i == 1) { // 本地城市电影接口特殊处理
          this.getCityData((city) => {
            this.getLatestMovieData(i, {city: city});
          });
        } else {
          this.getLatestMovieData(i);
        }
      }
    }
  },

  // 获取最新电影数据
  getLatestMovieData(idx, params) {
    var reqTask = wx.request({
      url: wx.db.requestURL(this.data.sections[idx].url),
      data: {...params, apikey:'0b2bdeda43b5688921839c8ecb20399b'},
      header: {'content-type':'json'},
      success: (result) => {        
        const subjects = result.data.subjects;
        this.cached(idx, subjects);
      },
      fail: () => {
        wx.db.toastError(`获取${ this.data.sections[idx].title }失败`)
      }
    });
  },

  // 本地缓存
  cached(sectionIdx, movieList) {
    let section = this.data.sections[sectionIdx];
    // 一定要重置，否则会不断累加数据
    section.movies = [];
    if (!movieList) {
      movieList = [];
    }
    for (let i = 0; i < movieList.length; i++) {
      // 本地电影和其他接口数据结构不一样，兼容处理
      let movie = movieList[i].subject || movieList[i];
      // 处理星级
      this.updateMovieStar(movie);
      section.movies.push(movie);
      // 刷新界面
      this.setData(this.data);
      // 数据缓存本地
      wx.setStorage({
        key: section.url,
        data: section.movies
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

  // 查看更多
  viewMore(event) {
    const index = event.currentTarget.dataset.index;
    const section = this.data.sections[index];
    wx.navigateTo({
      url: `/pages/movielist/movielist?title=${ section.title }&sourceURL=${ section.url }`
    });
  },

  // 搜索
  goSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  // 监听-删除电影
  deleteMovie(event) {
    const movieId = event.detail.movieId;
    let movies = this.data.sections[0].movies.filter(movie => {
      return movie._id != movieId;
    })
    this.setData(this.data);
  },

  // 监听-更新电影状态
  updateMovieStatus(event) {
    const movieId = event.detail.movieId;
    const movieStatus = event.detail.status;
    let findMovie = this.data.sections[0].movies.find(movie => {
      return movie._id == movieId;
    });    
    findMovie.status = movieStatus;
    this.setData(this.data);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    wx.setStorageSync('movieUpdate', 'false') // 防止onShow再次请求
    this.getMovieData();
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
        this.getMovieData();
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