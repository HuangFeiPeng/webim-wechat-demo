// pages/chat/chatMessage/index.js
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
    scrollHeight: 0, // 初始滚动位置
    mockMessageList: new Array(100).fill(1).map((_, i) => `user${i + 1}`)
  },
  lifetimes: {
    ready() {
      console.log("ready+++++", this.data.scrollTop)
      this.scrollToBottom()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onMessageScrolltoupper() {
      console.log('>>>>>列表滚动置顶。。。')

    },
    scrollToBottom() {
      console.log('>>>>执行滚动置底');
      setTimeout(()=>{
         this.setData({
        scrollHeight: 10000000
      })
      },100)
     

    }
  }
})