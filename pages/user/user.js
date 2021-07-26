Page({
  data: {
    userInfo: {},
    collectNum: 0  // 收藏的数量
  },
  onShow() {
    const userInfo = wx.getStorageSync("userInfo");
    const collectNum = wx.getStorageSync("collect").length
    this.setData({
      userInfo,
      collectNum
    })
  }
})