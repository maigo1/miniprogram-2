
/* 1 页面加载的时候 
     1 从缓存中获取购物车数据 渲染到页面中
      这些数据 checked=true
   2 微信支付
    1 那些人 哪些账号 可以实现微信支付
    1 需要企业账号（跳过）
  3 支付按钮
    1 先判断缓存中有没有token
    2 没有 跳转到授权页面 进行获取token
    3 有token

*/
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
Page({
  data: {
    adress: {},
    cart: [],

    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1 获取缓存中的收货地址信息
    const adress = wx.getStorageSync("adress");
    //1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //过滤后的购物车数组
    cart = cart.filter(v => v.checked);

    this.setData({
      adress
    })
    //1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {

      totalPrice += v.num * v.goods_price;
      totalNum += v.num;

    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      adress
    })
  }

})