// pages/clouddev/cloud-dev/cloud-dev.js
const db = wx.cloud.database();
const collection = db.collection('student');
const PAGE_SIZE = 5;
Page({
  // 添加数据
  dbAdd() {
    wx.navigateTo({
      url: '/pages/clouddev/cloud-database-insert/cloud-database-insert',
    })
    // collection.add({
    //   data: {
    //     name: 'idbeny',
    //     age: 88,
    //     sex: 1,
    //     birth: new Date(),
    //     height: 1.87,
    //     interest: ["1", "2"]
    //   }
    // }).then((result) => {
    //   console.log(result);
    //   wx.db.toast('添加成功');
    // }).catch((err) => {
    //   console.log(err);
    //   wx.db.toast('添加失败');
    // });
  },

  // 删除数据
  dbRemove() {
    collection.doc('a7d38b365f083e7f000b697d08cb44d8').remove().then( result => {
      wx.db.toast('删除成功');
    }).catch(err => {
      wx.db.toast('删除失败');
    });
  },

  // 更新数据
  dbUpdate() {
    // update（更新对应字段的值）
    collection.doc('4c54b50d5f083d7a0009087a3a52bcca').set({
      data: {
        name: "zhangsan",
        test: "test1"
      }
    }).then( result => {
      wx.db.toast('更新成功');
    }).catch(err => {
      wx.db.toast('更新失败');
    });

    // set（当前记录全部清空，把对应字段值修改）
    // collection.doc('4c54b50d5f083d7a0009087a3a52bcca').set({
    //   data: {
    //     name: "zhangsantest",
    //   }
    // }).then( result => {
    //   wx.db.toast('更新成功');
    // }).catch(err => {
    //   wx.db.toast('更新失败');
    // });
  },

  // 查询数据
  dbQuery() {
    wx.navigateTo({
      url: `/pages/movielist/movielist?title=云数据库-电影列表&sourceURL=cloud/movie_list`
    });
    // // 查询单条记录（需要精确到某一条数据）
    // collection.doc('4c54b50d5f083d7a0009087a3a52bcca').get().then(result => {      
    //   this.setData({dbDataString: JSON.stringify(result.data)});
    // }).catch(err => {      
    //   wx.db.toast('查询失败');
    // });

    // 查询条件查询（查询所有符合条件的数据）
    // 例：查询表中age=20的数据
    // collection.where({
    //   age: 20
    // }).get().then(result => {
    //   console.log(result);
    // }).catch(err => {
    //   wx.db.toast('查询失败');
    // });

    // 例：查询年龄大于20的数据（command指令）
    // const db_cmd = db.command;
    // collection.where({
    //   age: db_cmd.gt(20) // gt => greater than
    // }).get().then(result => {
    //   console.log(result);
    // }).catch(err => {
    //   wx.db.toast('查询失败');
    // })

    // 例：查询name以zh开头的数据（正则匹配）
    // collection.where({
    //   name: db.RegExp({
    //     regexp: '^zh.*',
    //     options: "i"
    //   })
    // }).get().then(result => {
    //   console.log(result);
    // }).catch(err => {
    //   wx.db.toast('查询失败');
    // })

    // 查询自己的所有记录（需要配置权限才可以访问其他人的数据）
    // collection.get().then(result => {      
    //   console.log(result);
    // }).catch(err => {      
    //   wx.db.toast('查询失败');
    // });

    // 查询所需要的字段数据（field前面的where条件是可选项）
    // collection.field({
    //   name: true,
    //   age: true
    // }).get().then(result => {
    //   console.log(result);
    // }).catch(err => {
    //   wx.db.toast('查询失败');
    // });

    // 分页查询（skip:跳过多少条，limit:需要多少条）
    // collection.skip(this.data.page*PAGE_SIZE).limit(PAGE_SIZE).get().then(result => {
    //   this.data.page += 1;
    //   console.log(result);
    // }).catch(err => {
    //   wx.db.toast('查询失败');
    // });
  },

  /**
   * 页面的初始数据
   */
  data: {
    dbDataString: '',
    page: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
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