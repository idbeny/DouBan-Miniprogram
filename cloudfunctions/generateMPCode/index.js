// 云函数入口文件
const cloud = require('wx-server-sdk')
const {WXMINIUser, WXMINIQR} = require('wx-js-utils')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const appId = 'wxaff2bf0c243d2639';
  const secret = '7783e5c8b4183549a210b538384e28bd';
  const user = new WXMINIUser({
    appId,
    secret
  })
  const access_token = await user.getAccessToken();
  const qr = new WXMINIQR();
  const qrcodeBuffer = await qr.getMiniQRLimit({
    access_token,
    path: event.path
  })
  return cloud.uploadFile({
    cloudPath: 'images/minicode.png',
    fileContent: qrcodeBuffer
  })
  return access_token;
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}