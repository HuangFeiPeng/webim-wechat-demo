import { EMClient } from "./EaseIM/index"
App({
  globalData: {
    globalActiveTab: 0,
    tabbarHeight: 50,
    safeAreaBottomHeight: 0
  },
  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        const tabbarHeight = (res.screenHeight - res.safeArea.bottom) + 50
        const safeAreaInsetBottom = res.screenHeight - res.safeArea.bottom
        console.log('tabbarHeigth', tabbarHeight)
        console.log('safeAreaBottomHeigth', safeAreaInsetBottom);
        this.globalData.safeAreaBottomHeight = safeAreaInsetBottom
        this.globalData.tabbarHeight = tabbarHeight
      }
    })
  },
  onUnload() {},

});