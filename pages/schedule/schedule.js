Page({
  data: {
    weekText: '',
    weekDays: [],
    timeSlots: []
  },

  onLoad() {
    this.initWeek()
  },

  onShow() {
    const app = getApp()
    if (!app.globalData.isLoggedIn) {
      wx.redirectTo({ url: '/pages/landing/landing' })
    }
  },

  initWeek() {
    const now = new Date()
    const dayOfWeek = now.getDay() || 7
    const monday = new Date(now)
    monday.setDate(now.getDate() - dayOfWeek + 1)

    const dayNames = ['一', '二', '三', '四', '五', '六', '日']
    const weekDays = dayNames.map((name, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return {
        name,
        date: d.getDate(),
        isToday: d.toDateString() === now.toDateString()
      }
    })

    const endDate = new Date(monday)
    endDate.setDate(monday.getDate() + 6)
    const weekText = `${monday.getMonth() + 1}月${monday.getDate()}日 - ${endDate.getMonth() + 1}月${endDate.getDate()}日`

    const times = ['10:00', '14:00', '18:00', '20:00', '22:00']
    const bookedNames = ['', '李淑娴', '', '宋浩琳', '娄英健', '', '']
    const timeSlots = times.map(time => ({
      time,
      cells: dayNames.map((_, i) => {
        const rand = Math.random()
        if (i === 2 && time === '20:00') return { day: i, status: 'mine' }
        if (bookedNames[i] && rand > 0.5) return { day: i, status: 'booked', name: bookedNames[i] }
        return { day: i, status: 'free' }
      })
    }))

    this.setData({ weekDays, weekText, timeSlots })
  },

  onPrevWeek() {
    wx.showToast({ title: '上一周', icon: 'none' })
  },

  onNextWeek() {
    wx.showToast({ title: '下一周', icon: 'none' })
  },

  onSlotTap(e) {
    const { slot, day } = e.currentTarget.dataset
    wx.showActionSheet({
      itemList: ['申请排班', '查看详情'],
      success: () => {}
    })
  }
})
