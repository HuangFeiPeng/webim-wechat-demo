import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import {
  EMClient
} from '../../EaseIM/index'
import getMessageKey from '../../utils/setMessageKey'
import emMessages from '../../EaseIM/emApis/emMessages'
const {
  fetchHistoryMessagesFromServer
} = emMessages()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatType: 'singleChat',
    targetId: '',
    conversationParams: {},
    messageList: [],
    histroyMessageCursor: null,
    loadingHistoryMessage: false,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('chat page', options);
    const {
      conversationId,
      conversationType,
      conversationParams
    } = options
    console.log('JSON.parse(conversationParams)', JSON.parse(conversationParams));
    this.setData({
      chatType: conversationType,
      targetId: conversationId,
      conversationParams: JSON.parse(conversationParams)
    })
    this.store = createStoreBindings(this, {
      store,
      fields: ['chatingConversationId', 'loginUserInfosData'],
      actions: ['setChatingConversationId'],
    });
    this.mountEMPageListenner()
    this.getHistoryMessageData()
    this.setChatingConversationId && this.setChatingConversationId(conversationId)
  },
  mountEMPageListenner() {
    EMClient.addEventHandler('CHAT_PAGE_MESSAGE', {
      // 当前用户收到文本消息。
      onTextMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message)
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message
        })
      },
      // 当前用户收到图片消息。
      onImageMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message)
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message
        })
      },
      // 当前用户收到透传消息。
      onCmdMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message)
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message
        })
      },
      // 当前用户收到语音消息。
      onAudioMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message)
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message
        })
      },
      // 当前用户收到位置消息。
      onLocationMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message)
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message
        })
      },
      // 当前用户收到文件消息。
      onFileMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message)
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message
        })
      },
      // 当前用户收到自定义消息。
      onCustomMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message)
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message
        })
      },
      // 当前用户收到视频消息。
      onVideoMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message)
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message
        })
      },
    })
  },
  //更新当前消息列表，两个触发位置（消息监听、发送方调用发送）
  updateMessageList(data) {
    console.log('更新消息列表', data);
    let message = {}
    if (data?.detail) {
      message = {
        ...data.detail
      }
    } else {
      message = {
        ...data
      }
    }
    this.setData({
      messageList: [...this.data.messageList, message]
    })
    this.callScrollToBottom()
  },
  async getHistoryMessageData() {
    const targetId = this.data.targetId
    const chatType = this.data.chatType
    const cursor = this.data.histroyMessageCursor
    console.log('>>>>>getHistoryMessageData', cursor);
    this.setData({
      loadingHistoryMessage: true
    })
    try {
      const res = await fetchHistoryMessagesFromServer({
        targetId,
        chatType,
        cursor
      })
      console.log('>>>>>漫游获取成功', res);
      if (res?.messages.length > 0) {
        const histroyMessageList = res.messages.reverse()
        this.setData({
          histroyMessageCursor: res.cursor,
          messageList: [...histroyMessageList, ...this.data.messageList],
          noMore: res.isLast,
          loadingHistoryMessage: false
        })
      }
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '漫游获取失败',
      })
    }
  },
  onLoadMoreHistoryMessageData() {
    console.log('>>>>>>>加载更多历史消息', this.data.histroyMessageCursor);
    if (this.data.noMore) {
      wx.showToast({
        title: '暂无更多',
      })
      return
    }
    if (!this.data.loadingHistoryMessage && !this.data.noMore) {
      console.log('>>>>>条件满足加载更多历史记录');
      this.getHistoryMessageData()
    }
  },
  callScrollToBottom() {
    const chatMessageContainerComp = this.selectComponent('#chatMessageContainerComp')
    chatMessageContainerComp?.scrollToBottom()
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
    this.setChatingConversationId && this.setChatingConversationId('')
    this.store.destroyStoreBindings();
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

  },
  //监听聊天页面点击
  onMessagePageTap() {
    console.log('>>>>>>>聊天页面点击');
    const chatInputbar = this.selectComponent('#chatInputbarComp')
    chatInputbar.onCloseEmojiPickerContainer()
  }
})