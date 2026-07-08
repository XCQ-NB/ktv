const { features } = require('../../utils/mock')

Page({
  data: {
    features
  },

  onLogin() {
    const app = getApp()
    if (app.globalData.isLoggedIn) {
      wx.switchTab({ url: '/pages/index/index' })
      return
    }
    wx.showActionSheet({
      itemList: ['微信快捷登录', '注册新账号'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.mockLogin()
        } else if (res.tapIndex === 1) {
          wx.navigateTo({ url: '/pages/register/register' })
        }
      }
    })
  },

  mockLogin() {
    const app = getApp()
    const { mockUser } = require('../../utils/mock')
    app.setUserInfo(mockUser)
    wx.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 1000)
  }
})
