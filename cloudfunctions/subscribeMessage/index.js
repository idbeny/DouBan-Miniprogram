// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: cloud.getWXContext().OPENID, // 通过 getWXContext 获取 OPENID
      page: event.path,
      data: {
        thing1: {
          value: event.title
        },
        character_string4: {
          value: event.average
        },
        time6: {
          value: event.date
        },
        thing5: {
          value: event.mark
        }
      },
      templateId: 'Ar0fVLbQvg7ViA-Jr4bn3OjlNUVHTqD02FhGIvVheQQ',
      miniprogramState: 'developer'
    })
    // result 结构
    // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
    return result
  } catch (err) {
    // 错误处理
    // err.errCode !== 0    
    throw err
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}