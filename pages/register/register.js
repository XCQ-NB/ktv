Page({
  data: {
    avatarUrl: '',
    agreed: false,
    canSubmit: false,
    form: {
      realName: '',
      stageName: '',
      phone: '',
      idNumber: '',
      entryDate: ''
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`form.${field}`]: e.detail.value
    }, () => this.checkCanSubmit())
  },

  onDateChange(e) {
    this.setData({
      'form.entryDate': e.detail.value
    })
  },

  onAgreeChange(e) {
    this.setData({
      agreed: e.detail.value.includes('agree')
    }, () => this.checkCanSubmit())
  },

  onChooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ avatarUrl: res.tempFiles[0].tempFilePath })
      }
    })
  },

  checkCanSubmit() {
    const { form, agreed } = this.data
    const canSubmit = agreed &&
      form.realName.trim() &&
      form.stageName.trim() &&
      /^1\d{10}$/.test(form.phone) &&
      /^\d{17}[\dXx]$/.test(form.idNumber)
    this.setData({ canSubmit })
  },

  onSubmit() {
    if (!this.data.canSubmit) return

    wx.showLoading({ title: '提交中...' })
    setTimeout(() => {
      wx.hideLoading()
      wx.showModal({
        title: '提交成功',
        content: '您的注册申请已提交，请等待管理员审核',
        showCancel: false,
        success: () => {
          wx.navigateBack()
        }
      })
    }, 1500)
  }
})
