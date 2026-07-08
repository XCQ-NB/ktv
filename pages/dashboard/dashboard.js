const { mockTopStreamers, mockUser, getInitial } = require('../../utils/mock')

Page({
  data: {
    activeTab: 'today',
    tabs: [
      { id: 'today', name: '今日' },
      { id: 'yesterday', name: '昨日' },
      { id: 'week', name: '本周' },
      { id: 'month', name: '本月' },
      { id: 'all', name: '全部' }
    ],
    topStreamers: [],
    myData: []
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    const app = getApp()
    if (!app.globalData.isLoggedIn) {
      wx.redirectTo({ url: '/pages/landing/landing' })
    }
  },

  loadData() {
    const topStreamers = mockTopStreamers.map(s => ({
      ...s,
      initial: getInitial(s.name)
    }))

    const myData = [
      { label: '我的音浪', value: '0' },
      { label: '开播场次', value: '0' },
      { label: '场均音浪', value: '0' },
      { label: '排名', value: '第-名', highlight: true }
    ]

    this.setData({ topStreamers, myData })
  },

  onTabChange(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ activeTab: id })
    // 实际项目中根据 tab 请求不同时间段数据
    const dataMap = {
      today: [
        { label: '我的音浪', value: '0' },
        { label: '开播场次', value: '0' },
        { label: '场均音浪', value: '0' },
        { label: '排名', value: '第-名', highlight: true }
      ],
      yesterday: [
        { label: '我的音浪', value: String(mockUser.yesterdaySoundwave) },
        { label: '开播场次', value: '2' },
        { label: '场均音浪', value: '4,926' },
        { label: '排名', value: '第2名', highlight: true }
      ],
      week: [
        { label: '我的音浪', value: '45,230' },
        { label: '开播场次', value: '12' },
        { label: '场均音浪', value: '3,769' },
        { label: '排名', value: '第3名', highlight: true }
      ],
      month: [
        { label: '我的音浪', value: String(mockUser.monthSoundwave) },
        { label: '开播场次', value: String(mockUser.monthlySessions) },
        { label: '场均音浪', value: '433' },
        { label: '排名', value: '第2名', highlight: true }
      ],
      all: [
        { label: '我的音浪', value: '1,234,567' },
        { label: '开播场次', value: '320' },
        { label: '场均音浪', value: '3,858' },
        { label: '排名', value: '第5名', highlight: true }
      ]
    }
    this.setData({ myData: dataMap[id] || dataMap.today })
  }
})
