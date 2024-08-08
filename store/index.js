import {
  observable,
  action,
  runInAction,
  set,
  computed
} from 'mobx-miniprogram';
import formaterDate from '../utils/formaterDate'
import emUserInfos from '../EaseIM/emApis/emUserInfos'
import emGroups from '../EaseIM/emApis/emGroups'
const {
  fetchOtherInfoFromServer,
} = emUserInfos()
const {
  getGroupInfosFromServer
} = emGroups()
export const store = observable({
  /* 会话列表相关 */
  conversationList: [], // 会话列表
  conversationCursor: '', //会话列表分页游标
  /* 联系人相关 */
  contactsList: [], //联系人列表
  contactsUserInfos: new Map(),
  groupInfos: new Map(), // 添加一个 Map 用于存储群组信息

  /* actions methods */
  /* 会话列表相关 */
  //获取会话列表数据
  initConversationListFromServer: action(function (data) {
    if (data?.conversations?.length) {
      // 先将会话列表转换为 observable 对象
      const observableConversations = data.conversations.map(conversationItem => {
        const observableConversationItem = observable(conversationItem);
        observableConversationItem.lastMessage.time = formaterDate('MM/DD/HH:mm', observableConversationItem.lastMessage.time);
        return observableConversationItem;
      });

      // 筛选出 singleChat 和 groupChat 类型的会话 ID
      const singleChatIds = observableConversations
        .filter(conversation => conversation.conversationType === 'singleChat')
        .map(conversation => conversation.conversationId);

      const groupChatIds = observableConversations
        .filter(conversation => conversation.conversationType === 'groupChat')
        .map(conversation => conversation.conversationId);

      // 获取 singleChat 用户信息
      const fetchSingleChatInfos = singleChatIds.length > 0 ?
        this.geContactsUserInfos(singleChatIds) :
        Promise.resolve({});

      // 获取 groupChat 群组信息
      const fetchGroupChatInfos = groupChatIds.length > 0 ?
        this.geGroupInfos(groupChatIds) :
        Promise.resolve({});

      // 批量获取用户和群组信息
      Promise.all([fetchSingleChatInfos, fetchGroupChatInfos]).then(([userInfos, groupInfos]) => {
        runInAction(() => {
          // 合并 singleChat 用户属性到对应的会话
          observableConversations.forEach(conversation => {
            if (conversation.conversationType === 'singleChat' && userInfos[conversation.conversationId]) {
              set(conversation, userInfos[conversation.conversationId]);
              // 更新 contactsUserInfos
              this.contactsUserInfos.set(conversation.conversationId, userInfos[conversation.conversationId]);
            }
            // 合并 groupChat 群组属性到对应的会话
            if (conversation.conversationType === 'groupChat') {
              const groupInfo = groupInfos.find(group => group.id === conversation.conversationId);
              if (groupInfo) {
                set(conversation, groupInfo);
                // 更新 groupInfos
                this.groupInfos.set(conversation.conversationId, groupInfo);
              }
            }
          });
          this.conversationList = observableConversations;
        });
      }).catch(err => {
        console.log('>>>>>会话列表对应的用户属性或群组详情获取失败', err);
      });
    }
    this.conversationCursor = data?.cursor;
  }),
  // 更新会话的 lastMessage
  updateConversationLastMessage: action(function (message) {
    let conversationIndex = this.conversationList.findIndex(conv => conv.conversationId === message.conversationId);
    let conversation;

    if (conversationIndex !== -1) {
      // 如果会话存在，更新 lastMessage 并将其移动到数组最前面
      runInAction(() => {
        conversation = this.conversationList[conversationIndex];
        conversation.lastMessage = {
          ...message,
          time: formaterDate('MM/DD/HH:mm', message.time)
        };
        this.conversationList.splice(conversationIndex, 1);
        this.conversationList.unshift(conversation);
      });
    } else {
      // 如果会话不存在，新建会话并移动到数组最前面
      runInAction(() => {
        conversation = observable({
          conversationId: message.conversationId,
          conversationType: message.conversationType,
          lastMessage: {
            ...message,
            time: formaterDate('MM/DD/HH:mm', message.time)
          }
        });
        this.conversationList.unshift(conversation);
      });
    }
  }),
  // 删除会话列表中的指定会话
  removeConversation: action(function (conversationId) {
    const index = this.conversationList.findIndex(conversation => conversation.conversationId === conversationId);
    if (index !== -1) {
      // 删除指定的会话并引起响应式更新
      runInAction(() => {
        // 删除指定的会话并引起响应式更新
        this.conversationList.splice(index, 1);
        // 重新赋值数组以确保 MobX 能够检测到变化
        this.conversationList = [...this.conversationList];
        console.log('>>>>>mobx执行删除', this.conversationList);
      });

    }
  }),
  /* 联系人相关 */
  //获取全部联系人
  initContactsListFromServer:action(function(data){
    this.contactsList = [...data]
  }),
  //获取用户属性
  geContactsUserInfos: action(function (userIds) {
    if (userIds.length) {
      return new Promise((resolve, reject) => {
        fetchOtherInfoFromServer(userIds).then(res => {
          console.log('>>>>>其他用户属性获取成功', res);
          resolve(res);
        }).catch(error =>
          reject(error))
      })
    }
  }),
  /* 群组相关 */
  // 获取群组详情
  geGroupInfos: action(function (groupIds) {
    if (groupIds.length) {
      return new Promise((resolve, reject) => {
        getGroupInfosFromServer(groupIds).then(res => {
          console.log('>>>>>群组详情获取成功', res);
          resolve(res);
        }).catch(error =>
          reject(error))
      })
    }
  }),
  /* 计算属性 */
  // 计算未读消息总数的计算属性
  get totalUnreadCount() {
    return this.conversationList.reduce((sum, conversation) => sum + (conversation.unReadCount || 0), 0);
  },
  // 计算联系人列表中包含用户属性的联系人
  get enrichedContactsList() {
    return this.contactsList.map(contact => {
      const userInfo = this.contactsUserInfos.get(contact.userId);
      if (userInfo) {
        return { ...contact, ...userInfo };
      }
      return contact;
    });
  }
});