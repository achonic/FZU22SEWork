// pages/homepage/homepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleImageUrl: "/images/tit.png",
  },
  localgame(){
    wx.navigateTo({
      url: '/pages/index/index'
      })
  },
  onlinegame(){
    wx.navigateTo({
      url: '/pages/onlineplay/online'
    })
  },
  AIgame(){
    wx.navigateTo({
      url: '/pages/AIgame/AIgame'
    })
  },
  gamerule(){
    wx.showModal({
      title:'逍遥骰游戏规则',
      content:'游戏由两部分组成：己方九宫格棋盘 和 敌方九宫格棋盘。双方每回合投掷骰子，并放置于己方棋盘。棋盘有K、E、X三条线。若放置对方同线的位置有相同点数的骰子，可将其消除。一方棋盘放满开始计算得分。棋盘里同线点数相同分数翻一倍',

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})