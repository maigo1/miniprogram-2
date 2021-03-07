// pages/order/index.js

import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 1 页面被打开的时候 onShow
   *  0 onShow 不同于onLoad 无法在形参上接收 options参数
   *  0.5 判断缓存中有没有token
   *    1 没有 跳转到授权页面
   *    2 有 直接往下进行
   *  1 获取url上的参数type
   *  2 根据type来决定页面标题的数组元素 那个被激活选中
   *  2 根据type 去发送请求获取订单数据
   *  3 渲染页面
   * 2 点击不同的标题 重新发送请求来获取和渲染
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true,
      },
      {
        id: 1,
        value: "待付款",
        isActive: false,
      },
      {
        id: 2,
        value: "待发货",
        isActive: false,
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false,
      },
    ],
  },

  onShow(options) {
    // 1 获取当前的小程序的页面栈-数组 长度最大是10 页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的type参数
    const { type } = currentPage.options;
    // 4 激活选中
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
    wx.setStorageSync(
      "token",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
    );
    //1 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    //2 判断
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/index",
      });
      return;
    }
  },
  // 获取订单列表的方法
  async getOrders(type) {
    //请求头参数未封装
    const token = wx.getStorageSync("token");
    const header = { Authorization: token };
    const res = await request({
      url: "/my/orders/all",
      data: { type },
      header,
    });
    this.setData({
      orders: res.orders,
    });
  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    let { tabs } = this.data;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    //3 赋值到data中
    this.setData({
      tabs,
    })

  },

  //标题点击事件
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 2 重新发送请求 type=1 index=0
    this.getOrders(index+1);

  },
});
