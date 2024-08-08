import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emUserInfos from '../../EaseIM/emApis/emUserInfos'
const {
  fetchUserInfoWithLoginId
} = emUserInfos()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarPlaceholderHeight: app.globalData.tabbarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: ['loginUserInfosData','loginEMUserId'],
      actions: ['getLoginUserInfos'],
    });
    setTimeout(()=>{
      if(!Object.keys(this.data.loginUserInfosData).length){
       this.fetchLoginUserInfosData()
      }
    },500)
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
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
    this.store.destroyStoreBindings();
  }

})