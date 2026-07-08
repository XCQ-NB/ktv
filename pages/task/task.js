const { mockUser, formatNumber } = require('../../utils/mock')

Page({
  data: {
    progress: 8,
    current: '20,384',
    target: '25万',
    remaining: '22.96万',
    dailyTasks: []
  },

  onLoad() {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const amounts = [9852, 8230, 7650, 9100, 6800, 0, 0]
    const dailyTasks = []

    for (let i = 1; i <= 7; i++) {
      const d = new Date(2026, 6, i)
      const amount = amounts[i - 1]
      dailyTasks.push({
        day: i,
        weekday: weekdays[d.getDay()],
        amount: amount > 0 ? formatNumber(amount) : '-',
        percent: amount > 0 ? Math.min(100, (amount / 10000) * 100) : 0,
        done: amount > 0
      })
    }

    this.setData({
      progress: mockUser.monthTaskProgress,
      current: formatNumber(mockUser.monthSoundwave),
      target: formatNumber(mockUser.monthTaskTarget),
      remaining: formatNumber(mockUser.monthTaskTarget - mockUser.monthSoundwave),
      dailyTasks
    })
  }
})
