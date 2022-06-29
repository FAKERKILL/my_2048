// app.js
App({
  onLaunch() {
    // 云开发环境初始化
  wx.cloud.init({
    env:'cloud1-9g3gcy8dc88ff8e7'
  })

  
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  
  globalData: {
    userInfo: null
  }
})
