App({
  globalData: {
    userInfo: null,
    isLoggedIn: false
  },

  onLaunch() {
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')
    if (userInfo && token) {
      this.globalData.userInfo = userInfo
      this.globalData.isLoggedIn = true
    }
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.isLoggedIn = true
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('token', 'mock_token_' + Date.now())
  },

  logout() {
    this.globalData.userInfo = null
    this.globalData.isLoggedIn = false
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('token')
  }
})
