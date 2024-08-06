// layout/tabbar/index.js
Component({
  /**
   * 组件的属性列表
   */

  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
    border:false,
    tabbarPlaceholder:true,
    list: [
			{
				text: '会话',
				url: '/pages/conversation/index'
			},
			{
				text: '联系人',
				url: '/pages/contacts/index'
      },
      {
        text:'我的',
        url:'/pages/mine/index'
      }
		]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTabbarChange(event) {
      this.setData({ active: event.detail });
      wx.switchTab({
				url: this.data.list[event.detail].url
			});
    },
    init() {
      const page = getCurrentPages().pop();
      console.log(page.route)
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
  }
})