import emGroups from '../../EaseIM/emApis/emGroups'
const {
  getGroupMembersFromServer
} = emGroups()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mockGroupMember: new Array(500).fill(1).map((_, i) => `user${i + 1}`),
    groupId: "",
    groupRole: "",
    groupMemberCount:1,
    groupMemberList: [],
    isLast: false,
    pageNum: 1,
    pageSize: 100,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      groupId,
      groupRole,
      groupMemberCount
    } = options
    if (groupId) {
      this.setData({
        groupId,
        groupRole,
        groupMemberCount
      })
      this.fetchGroupMemberListData(groupId)
    }
  },
  onClickLeft() {
    wx.navigateBack()
  },
  async fetchGroupMemberListData(groupId) {
    const pageNum = this.data.pageNum
    const pageSize = this.data.pageSize
    try {
      const res = await getGroupMembersFromServer(groupId || this.data.groupId, pageNum, pageSize)
      if (res?.length) {
        this.setData({
          groupMemberList: [...this.data.groupMemberList, ...res],
          pageNum: pageNum + 1
        })
      } else {
        console.log('>>>>已拉取至最后一页');
        this.setData({
          isLast: true
        })
        return
      }
      console.log(res);
    } catch (error) {
      wx.showToast({
        title: '群组成员获取失败',
      })
    }
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
  onGroupMemberListScrolltolower() {
    console.log('>>>>>滚动置底');
    if (this.data.isLast) return;
    console.log('执行加载更多成员列表');
    this.fetchGroupMemberListData()
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