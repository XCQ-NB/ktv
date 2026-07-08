const { mockUser, profileMenus, formatNumber, getInitial } = require('../../utils/mock')

Page({
  data: {
    user: mockUser,
    initial: '',
    dataCards: [],
    menus: []
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    const app = getApp()
    if (!app.globalData.isLoggedIn) {
      wx.redirectTo({ url: '/pages/landing/landing' })
      return
    }
    if (app.globalData.userInfo) {
      this.setData({ user: app.globalData.userInfo })
      this.loadData()
    }
  },

  loadData() {
    const user = this.data.user
    const dataCards = [
      { label: '本月音浪', value: formatNumber(user.monthlySoundwave) },
      { label: '本月场次', value: String(user.monthlySessions) },
      { label: '本月任务剩余', value: formatNumber(user.monthlyTaskRemaining) },
      { label: '假期余额', value: String(user.holidayBalance) }
    ]
    const menus = profileMenus

    this.setData({
      dataCards,
      menus,
      initial: getInitial(user.stageName)
    })
  },

  onMenuTap(e) {
    const url = e.currentTarget.dataset.url
    if (url.includes('dashboard')) {
      wx.switchTab({ url })
    } else {
      wx.navigateTo({ url })
    }
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.logout()
          wx.redirectTo({ url: '/pages/landing/landing' })
        }
      }
    })
  }
})
