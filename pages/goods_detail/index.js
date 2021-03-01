/* 1 发送请求获取数据
   2 点击轮播图 预览大图
    1 给轮播图绑定点击事件
    2 调用小程序的api previewImage
   3 点击 加入购物车（这里是在本地存储模拟，实际是接后台数据库）
    1 先绑定点击事件
    2 获取缓存中的购物车数据 数组格式
    3 先判断 当前的商品是否已经存在于 购物车
    4 已经存在 修改商品数据 执行购物车数量++ 然后重新把购物车数组 填充回缓存中
    5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num 重新把购物车数组 填充回缓存中
    6 弹出提示
    */


// 引入用来发送请求的方法
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}

  },

  //商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
    
  },
//获取商品详情
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;
    this.setData({
      //该页面只用到接收到goodsObj里的四个属性，全部赋值给goodsObj的话会导致小程序变卡
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        //iphone 部分手机 不识别 webp图片格式
        //最好让后台 进行修改
        // 或者自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      }
    })
  },

  handlePreviewImage(e){
    // 1 先构造要预览的图片数组
    const urls= this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 2 接受传递过来的图片url
    const current=e.currentTarget.dataset.url;
      wx.previewImage({
        // 下面写法相当于current = current
        current,
        urls
      });
    
  },
// 点击 加入购物车
  hanleCartAdd(){
    //1 获取缓存中的购物车数据 数组
    let cart=wx.getStorageSync("cart")||[];
    //2 判断 商品是否已经存在于 购物车
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //3 不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //4 已经存在购物车数据 执行num++
      cart[index].num++;
      
    }
    //5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 1500,
      // true 的话可以防止用户一直点击
      mask: true
    });
  }

})