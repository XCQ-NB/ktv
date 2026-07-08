const { mockUser, mockRanking, dailyChannels, formatNumber, getRankBadgeClass, getInitial } = require('../../utils/mock')

const channelRoutes = {
  checkin: '/pages/checkin/checkin',
  schedule: '/pages/schedule/schedule',
  leave: '/pages/leave/leave',
  task: '/pages/task/task'
}

Page({
  data: {
    user: mockUser,
    formattedMonthSoundwave: '',
    formattedTarget: '',
    channels: [],
    ranking: []
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
    }
    this.loadData()
  },

  loadData() {
    const user = this.data.user
    const channels = dailyChannels
    const ranking = mockRanking.map(r => ({
      ...r,
      badgeClass: getRankBadgeClass(r.rank),
      initial: getInitial(r.name)
    }))

    this.setData({
      channels,
      ranking,
      formattedMonthSoundwave: formatNumber(user.monthSoundwave),
      formattedTarget: formatNumber(user.monthTaskTarget)
    })
  },

  onChannelTap(e) {
    const id = e.currentTarget.dataset.id
    const url = channelRoutes[id]
    if (url) {
      if (id === 'checkin' || id === 'schedule') {
        wx.switchTab({ url })
      } else {
        wx.navigateTo({ url })
      }
    }
  }
})
