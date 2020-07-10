// components/nav-bar/nav-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    titleColor: {
      type: String,
      value: '#000'
    },
    statusBarMode: { // 状态栏：0代表黑色 1代表白色 
      type: String,
      value: '0' 
    },
    color: { // 同时设置statusBarColor和navBarColor，优先级低
      type: String,
      value: '#fff'
    },
    statusBarColor: {
      type: String
    },
    navBarColor: {
      type: String
    },
    back: {
      type: String,
      value: 'true'
    },
    home: {
      type: String,
      value: 'true'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarStyle: '', // 状态栏样式
    navBarStyle: '', // 导航栏样式
    topHeight: 0,
    navBackSrc: '',
    navHomeSrc: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back: function() {
      this.triggerEvent('backTap', { name: 'mj' });
      wx.navigateBack();
    },
    home: function() {
      this.triggerEvent('homeTap', { age: 18 });
      wx.navigateBack({
        delta: 999
      });
    }
  },

  /**
   * 自定义组件生命周期
   */
  lifetimes: {
    attached() {
      const statusBarStyle = `
      height: ${ wx.db.statusBarHeight }px; 
      background-color: ${ this.data.statusBarColor || this.data.color };
      `;
      const navBarStyle = `
      color: ${ this.data.titleColor };
      height: ${ wx.db.navBarHeight }px;
      background-color: ${ this.data.navBarColor || this.data.color };
      `;
      this.setData({ statusBarStyle, navBarStyle });

      // 设置topHeight的值
      const topHeight = wx.db.statusBarHeight + wx.db.navBarHeight;
      this.setData({
        topHeight
      });

      // 设置导航返回图标
      let navBackSrc = '/assets/imgs/nav_back_black.png';
      let navHomeSrc = '/assets/imgs/nav_home_black.png';
      if (this.data.statusBarMode == '1') {
        navBackSrc = '/assets/imgs/nav_back_white.png';
        navHomeSrc = '/assets/imgs/nav_home_white.png';
      }
      
      this.setData({
        navBackSrc,
        navHomeSrc
      })

      // 状态栏颜色
      wx.setNavigationBarColor({
        frontColor: this.data.statusBarMode == '1' ? '#ffffff' : '#000000',
        backgroundColor: '#ffffff'
      })
    }
  }
})
