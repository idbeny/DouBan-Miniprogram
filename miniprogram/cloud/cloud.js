// 获取云数据库
const cloud_db = wx.cloud.database();
// 获取云集合-电影列表
const db_collection_movie_list = cloud_db.collection('movie_list');

module.exports = {
  db_collection_movie_list
}