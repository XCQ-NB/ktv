Page({
  data: {
    activeTab: 'apply',
    leaveTypes: ['事假', '病假', '年假', '调休'],
    leaveTypeIndex: 0,
    startDate: '',
    endDate: '',
    reason: '',
    holidayBalance: 0.5,
    canSubmit: false,
    records: [
      {
        id: 1,
        type: '事假',
        startDate: '2026-06-15',
        endDate: '2026-06-15',
        reason: '家中有事',
        statusText: '已通过',
        statusClass: 'approved'
      },
      {
        id: 2,
        type: '病假',
        startDate: '2026-05-20',
        endDate: '2026-05-21',
        reason: '身体不适',
        statusText: '已通过',
        statusClass: 'approved'
      },
      {
        id: 3,
        type: '年假',
        startDate: '2026-07-10',
        endDate: '2026-07-12',
        reason: '个人休假',
        statusText: '审批中',
        statusClass: 'pending'
      }
    ]
  },

  onTabChange(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  onTypeChange(e) {
    this.setData({ leaveTypeIndex: e.detail.value })
  },

  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value }, () => this.checkSubmit())
  },

  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value }, () => this.checkSubmit())
  },

  onReasonInput(e) {
    this.setData({ reason: e.detail.value }, () => this.checkSubmit())
  },

  checkSubmit() {
    const { startDate, endDate, reason } = this.data
    this.setData({
      canSubmit: !!(startDate && endDate && reason.trim())
    })
  },

  onSubmit() {
    if (!this.data.canSubmit) return
    wx.showLoading({ title: '提交中...' })
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '申请已提交', icon: 'success' })
      this.setData({
        activeTab: 'history',
        startDate: '',
        endDate: '',
        reason: '',
        canSubmit: false
      })
    }, 1000)
  }
})
