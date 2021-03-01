// pages/category/index.js

// 引入用来发送请求的方法
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  data: {
    //左侧的菜单栏数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],

    // 被点击的左侧的菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0

  },
//接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
      0 web中的本地存储 和 小程序中的本地存储的区别
        1 写代码的方式不一样了
          web: localStorage.setItem("key","value") localStorage.getItem("key")
          小程序：wx.setStorageSync("key","value") wx.getStorageSync("key")
        2 存的时候 有没有做类型转换
          web: 不管存入的是什么类型的数据，最终都会先调用 toString(),把数据变成字符串
          小程序：不存在 类型转换的这个操作 存什么类型的数据进去，获取的就是什么类型
      1  先判断一下本地存储中有没有旧的数据
      {time:Date.now(),data;[...]}
       2 没有旧数据 直接发送新请求
       3 有旧的数据 同时旧的数据也没有过期 就使用 本地存储的就数据即可*/
    

       //1 获取本地存储中的数据（小程序也是存在本地存储 技术）
       const Cates = wx.getStorageSync("cates");
       if(!Cates){
         this.getCates();
       }else{
         //有旧的数据 暂时定义过期时间 10秒 => 5min
         if(Date.now() - Cates.time>1000*10){
           //重新发送请求
          this.getCates();
         }else{
           //可以使用旧的数据
           this.Cates = Cates.data;
           let leftMenuList = this.Cates.map(v=>v.cat_name);
          //构造右侧的商品数据
          let rightContent = this.Cates[0].children;
          this.setData({
            leftMenuList,
            rightContent
          })

         }
       }
        

  },
  //获取分类数据
  async getCates(){
/*     request({
      url:"/categories"
    })
    .then(res =>{
      this.Cates=res.data.message;
      //把接口的数据存入到本地存储中
      wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
      // 构造左侧的大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧的商品数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })

    }) */
    const res=await request({url:"/categories"});
    // this.Cates=res.data.message;
    this.Cates=res;
    //把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    // 构造左侧的大菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    //构造右侧的商品数据
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })

  },
  //左侧菜单的点击事件
  handleItemTap(e){
    /* 
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值
    3 根据不同索引显示相应内容
     */
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      //重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop:0
    })
  }
})