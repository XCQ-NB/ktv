Page({
  data: {
    checkedIn: false,
    soundwave: '',
    checkinTime: '',
    history: [
      { day: '07', month: '7月', time: '23:45', soundwave: 9852 },
      { day: '06', month: '7月', time: '23:30', soundwave: 8230 },
      { day: '05', month: '7月', time: '23:15', soundwave: 7650 },
      { day: '04', month: '7月', time: '23:50', soundwave: 9100 },
      { day: '03', month: '7月', time: '23:20', soundwave: 6800 }
    ]
  },

  onShow() {
    const app = getApp()
    if (!app.globalData.isLoggedIn) {
      wx.redirectTo({ url: '/pages/landing/landing' })
    }
  },

  onSoundwaveInput(e) {
    this.setData({ soundwave: e.detail.value })
  },

  onCheckin() {
    if (!this.data.soundwave) return

    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    this.setData({
      checkedIn: true,
      checkinTime: time
    })

    wx.showToast({ title: '打卡成功', icon: 'success' })
  }
})
