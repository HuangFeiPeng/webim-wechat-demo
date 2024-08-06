// pages/chat/chatInputbar/index.js
const app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    messageContent: "1111",
    sageAreaBottomHeight: app.globalData.safeAreaBottomHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOpenRecordAudioPopup() {
      this.onCloseEmojiPickerContainer()
      this.selectComponent('#inputAudioComp').showPopup()
    },
    onHandleEomjiPickerContainer() {
      this.selectComponent('#inputEmojiComp').handleShowEmojiContainer()
    },
    onCloseEmojiPickerContainer() {
      const isShowEomjiContainerStatus = this.selectComponent('#inputEmojiComp').data.showEomjiContainer
      if (!isShowEomjiContainerStatus) return;
      this.onHandleEomjiPickerContainer()
    },
    onOpenMoreComponent(){
      this.onCloseEmojiPickerContainer()
      this.selectComponent('#inputMoreComp').showPopup()
    }
  }
})