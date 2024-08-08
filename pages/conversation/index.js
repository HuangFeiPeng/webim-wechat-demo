// pages/conversation/index.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emConversation from '../../EaseIM/emApis/emConversation'
const {
  fetchConversationFromServer
} = emConversation()
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
    actions: [{
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
    this.store = createStoreBindings(this, {
      store,
      fields: ['conversationList'],
      actions: ['initConversationListFromServer'],
    });

    setTimeout(() => {
      if (!this.data.conversationLoading?.length) {
        console.log('initConversationListFromServer');
        this.setData({
          conversationLoading: true,
          loading: true
        });
        this.fetchConversationDataFromServer()
      }
    }, 500)



  },
  async fetchConversationDataFromServer() {
    try {
      const res = await fetchConversationFromServer()
      this.initConversationListFromServer({
        ...res
      })
    } catch (error) {
      console.log('error',error);
      wx.showToast({
        title: '会话列表获取失败',
      })
    } finally {
      this.setData({
        conversationLoading: false,
        loading: false
      })
    }
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
    this.store.destroyStoreBindings();
  }
});