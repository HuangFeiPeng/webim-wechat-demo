// pages/conversation/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { conversationStore } from '../../stores/conversation';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false, //骨架屏加载
    conversationLoading: false,
    searchConversationValue: '',
    mockConversationList: new Array(100).fill(1).map((_, i) => `user${i + 1}`),
    tabbarPlaceholderHeight: app.globalData.tabbarHeight,
    showConversationHandlerActionSheet: false,
    actions: [
      {
        name: '删除',
        color: '#ee0a24',
      },
      {
        name: '置顶',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.chatStore = createStoreBindings(this, {
      store: conversationStore,
      fields: ['chatList', 'totalPrice'],
      actions: ['initChat'],
    });
    let chat = [
      {
        name: 'XXXX',
        price: '111',
      },
      {
        name: 'XXXX',
        price: '111',
      },
    ];
    this.initChat(chat);
    this.setData({
      conversationLoading: true,
    });
    setTimeout(() => {
      this.setData({
        conversationLoading: false,
      });
    }, 2000);
    console.log(this.chatStore);
  },
  onConversationScrolltolower() {
    console.log('>>>>>>会话列表滚动置底');
  },
  onCallOpenConversationHandlerActionSheet() {
    this.setData({
      showConversationHandlerActionSheet: true,
    });
  },
  onCloseConversationHandlerActionSheet() {
    this.setData({
      showConversationHandlerActionSheet: false,
    });
  },
  onSelectConversationHandlerOptions(event) {
    console.log(event.detail);
  },
  onEntryChatPage() {
    wx.navigateTo({
      url: '../chat/index',
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.chatStore.destroyStoreBindings();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('>>>>>>滚动到底部');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
