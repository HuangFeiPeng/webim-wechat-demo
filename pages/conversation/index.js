// pages/conversation/index.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emConversation from '../../EaseIM/emApis/emConversation'
import emUserInfos from '../../EaseIM/emApis/emUserInfos'
const {
  fetchConversationFromServer,
  removeConversationFromServer
} = emConversation()
const {
  fetchUserInfoWithLoginId
} = emUserInfos()
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true, //骨架屏加载
    conversationLoading: false,
    searchConversationValue: '',
    searchStatus: false,
    searchSourceData: [],
    tabbarPlaceholderHeight: app.globalData.tabbarHeight,
    showConversationHandlerActionSheet: false,
    chooseConversation: {
      conversationId: '',
      conversationType: '',
    },
    actions: [{
        name: '删除',
        color: '#ee0a24',
        type: 'DELETE'
      },
      // {
      //   name: '置顶',
      // },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: ['conversationList','loginUserInfosData'],
      actions: ['initConversationListFromServer', 'removeConversation','getLoginUserInfos'],
    });
    setTimeout(() => {
      if (!this.data.conversationLoading?.length) {
        console.log('initConversationListFromServer');
        this.setData({
          conversationLoading: true
        });
        this.fetchConversationDataFromServer()
      }
    }, 500)
    this.fetchLoginUserInfosData()
  },
  async fetchLoginUserInfosData() {
    try {
      const res = await fetchUserInfoWithLoginId()
      console.log('>>>>>登录用户获取成功',res);
      
      this.getLoginUserInfos(res)
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '登录用户属性获取失败',
      })
    }
  },
  async fetchConversationDataFromServer() {
    try {
      const res = await fetchConversationFromServer()
      this.initConversationListFromServer({
        ...res
      })
    } catch (error) {
      console.log('error', error);
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
  onCallOpenConversationHandlerActionSheet(event) {
    console.log('event', event);
    const conversationId = event.currentTarget.dataset.conversationid;
    const conversationType = event.currentTarget.dataset.conversationtype;
    this.setData({
      chooseConversation: {
        conversationId,
        conversationType
      },
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
    const {
      type
    } = event.detail
    if (type === 'DELETE') {
      this.callDeleteConversationItem()
    }
  },
  async callDeleteConversationItem() {
    console.log('>>>>删除会话列表', this.data.chooseConversation);
    const {
      conversationId,
      conversationType
    } = this.data.chooseConversation
    if (!conversationId || !conversationType) return;
    try {
      await removeConversationFromServer(conversationId, conversationType)
      this.removeConversation(conversationId)
      wx.showToast({
        title: '会话已删除',
      })
    } catch (error) {
      wx.showToast({
        title: '会话删除失败',
      })
    }
  },
  /* Search */
  onSearchFocus() {
    console.log('>>>>>搜索框聚焦');
    this.setData({
      searchStatus: true,
      searchSourceData: this.data.conversationList
    })
  },
  onSearchBlur() {
    this.setData({
      searchStatus: false
    })
  },
  onSearchCancel(){
    this.setData({
      searchStatus: false
    })
  },
  onActionSearchInputValue() {
    const searchResult = this.data.conversationList.filter(conversation => {
      const {
        conversationType,
        conversationId,
        lastMessage
      } = conversation;
      const searchValue = this.data.searchConversationValue;
      const matchesId = conversationId?.includes(searchValue);
      const matchesMessage = lastMessage?.msg?.includes(searchValue);
      if (conversationType === 'singleChat') {
        return matchesId || conversation?.nickname?.includes(searchValue) || matchesMessage;
      } else if (conversationType === 'groupChat') {
        return matchesId || conversation?.name?.includes(searchValue) || matchesMessage;
      }
      return false; // 如果 conversationType 不是 singleChat 或 groupChat，则不匹配
    });
    this.setData({
      searchSourceData:searchResult
    })
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