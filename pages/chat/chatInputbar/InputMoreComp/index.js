// pages/chat/chatInputbar/InputMoreComp/index.js
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
    inputMoreFunctionAction:[
      {icon:'/static/input/img.png',title:'相册'},
      {icon:'/static/input/camera_fill.png',title:'相机'},
      {icon:'/static/input/person_single_fill.png',title:'个人名片'}
    ]
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