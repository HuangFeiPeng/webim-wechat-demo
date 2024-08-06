// pages/chat/chatInputbar/InputAudioComp/index.js
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
    show: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup() {
      this.setData({ show: true });
    },
  
    onClose() {
      this.setData({ show: false });
    },
  }
})