// components/movie-item/movie-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    movie: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 详情
    goDetail() {
      // url不能传对象 -> 把对象序列化
      const movieJSON = JSON.stringify(this.data.movie);
      wx.navigateTo({
        url: `/pages/moviedetail/moviedetail?movieJSON=${ movieJSON }`
      });
    }
  }
})
