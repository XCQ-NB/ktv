Page({
  data: {
    notices: [
      {
        id: 1,
        type: 'important',
        typeText: '重要',
        title: '7月份音浪任务调整通知',
        preview: '经管理层研究决定，7月份音浪任务目标调整为25万...',
        date: '2026-07-01',
        read: false
      },
      {
        id: 2,
        type: 'normal',
        typeText: '通知',
        title: '排班规则更新说明',
        preview: '即日起直播间排班实行新规则，请各位主播注意...',
        date: '2026-06-28',
        read: false
      },
      {
        id: 3,
        type: 'info',
        typeText: '活动',
        title: '月度优秀主播评选活动',
        preview: '本月将评选月度优秀主播，奖励丰厚，快来参与...',
        date: '2026-06-25',
        read: true
      },
      {
        id: 4,
        type: 'normal',
        typeText: '通知',
        title: '系统维护公告',
        preview: '系统将于6月20日凌晨2:00-4:00进行维护升级...',
        date: '2026-06-18',
        read: true
      }
    ]
  },

  onNoticeTap(e) {
    const id = e.currentTarget.dataset.id
    const notice = this.data.notices.find(n => n.id === id)
    if (notice) {
      const notices = this.data.notices.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
      this.setData({ notices })
      wx.showModal({
        title: notice.title,
        content: notice.preview,
        showCancel: false
      })
    }
  }
})
