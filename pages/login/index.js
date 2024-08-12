// pages/login/index.js
import emConnect from '../../EaseIM/emApis/emConnect.js'
const {
  loginWithPassword
} = emConnect()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginPhoneNumber: "",
    loginSms: "",
    loginLoadingStatus: false,
    loginBtnDisabledStatus: false,
    privacyChecked: false,
    smsButtonText: "发送验证码"
  },
  onPrivacyChecked() {
    this.setData({
      'privacyChecked': !this.data.privacyChecked
    })
    console.log(this.data.privacyChecked)
  },
  async onEntryConversationPage() {
    try {
      await loginWithPassword('hfp', '1')
      wx.switchTab({
        url: '../conversation/index',
      })
    } catch (error) {
      console.log('error',error);
      wx.showToast({
        title: 'IM Open Fail'
      })
    }

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