const { db_collection_movie_list } = require("../../cloud/cloud");

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
    // 长按
    longPressHandle() {
      wx.showActionSheet({
        itemList: ["保存相册", "预览大图"],
        itemColor: '#000000',        
      }).then(result => {
        const index = result.tapIndex;
        const filePath = this.data.movie.images.large;
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
      let that = this;
      if (this.data.movie.sourceType == 1) { // 云数据
        wx.cloud.downloadFile({
          fileID: filePath
        }).then(res => {
          this.saveToPhotosAlbum(res.tempFilePath);
        }).catch(err => {
          wx.db.toastError('下载失败')
        })
      } else { // 普通http        
        wx.downloadFile({
          url: filePath,
          success(res) {
            if (res.statusCode === 200) {
              that.saveToPhotosAlbum(res.tempFilePath);
            } else {
              wx.db.toastError('下载失败')
            }
          },
          fail(err) {
            wx.db.toastError('下载失败')
          }
        });
      }
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

    // 详情
    goDetail() {
      // url不能传对象 -> 把对象序列化
      const movieJSON = JSON.stringify(this.data.movie);
      const movieId = this.data.movie._id;
      const changedStatus = this.data.movie.status == 0 ? 1 : 0;
      const showTitle = changedStatus == 0 ? "生效" : "失效"
      if (this.data.movie.sourceType == 1) { // 云数据库
        wx.showActionSheet({
          itemList: ["删除", showTitle, "修改", "详情"],
          itemColor: '#000000',
          success: (result) => {    
            const index = result.tapIndex;
            if (index == 0) { // 删除
              db_collection_movie_list
              .doc(movieId)
              .remove()
              .then(res => {
                this.triggerEvent('delete-movie', {movieId});
                let pages = getCurrentPages();
                if (pages.length > 1) {
                  wx.setStorageSync('movieUpdate', 'true')
                }
              })
              .catch(err => {
                wx.db.toastError("删除失败");
              })
            } else if (index == 1) { // 失效/生效            
              db_collection_movie_list
              .doc(movieId)
              .update({
                data: {
                  status: changedStatus
                }
              })
              .then(res => {
                this.triggerEvent('update-movie-status', {movieId, status:changedStatus});
                let pages = getCurrentPages();
                if (pages.length > 1) {
                  wx.setStorageSync('movieUpdate', 'true')
                }
              })
              .catch(err => {
                wx.db.toastError("更新失败");
              })
            } else if (index == 2) { // 修改
              wx.navigateTo({
                url: `/pages/clouddev/cloud-database-insert/cloud-database-insert?movieJSON=${ movieJSON }`
              });
            } else { // 详情
              wx.navigateTo({
                url: `/pages/moviedetail/moviedetail?movieJSON=${ movieJSON }`
              });
            }
          }
        });
      } else {
        wx.navigateTo({
          url: `/pages/moviedetail/moviedetail?movieJSON=${ movieJSON }`
        });
      }
    }
  }
})
