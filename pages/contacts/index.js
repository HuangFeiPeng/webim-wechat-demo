import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emContacts from '../../EaseIM/emApis/emContacts'
const {
  fetchContactsListFromServer
} = emContacts()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContactsValue: "",
    tabbarPlaceholderHeight: app.globalData.tabbarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: ['contactsList','contactsUserInfos','enrichedContactsList'],
      actions: ['initContactsListFromServer'],
    });
    setTimeout(() => {
      if (!this.data.contactsList.length) {
        console.log('<<<<<发起远端联系人请求');
        this.fetchContactsListFromServer()
      }
    }, 500)
  },
  async fetchContactsListFromServer() {
    try {
      const res = await fetchContactsListFromServer()
      this.initContactsListFromServer(res)
    } catch (error) {
      console.log('>>>>联系人请求成功', error);
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
    console.log(this.data);
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