import { observable, action } from 'mobx-miniprogram';
export const conversationStore = observable({
  // 定义两个全局参数
  chatList: [], // 购物车商品
  totalPrice: 0, // 购物车商品总价

  // 初始化购物车
  initChat: action(function (list) {
    this.chatList = list;
  }),

  // 修改价格
  setPrice: action(function (price) {
    this.totalPrice = price;
  }),
});
