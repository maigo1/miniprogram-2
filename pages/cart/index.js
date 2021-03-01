/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api 获取用户的收货地址（现在真机测试不需要 ）
   1 假设 用户 点击获取收货地址的提示框 确定 authSetting scope.address
    scope的值 true 直接调用 获取收货地址
   2 假设 用户 从来没有调用过 获取收货地址的API
    scope undefined 直接调用 获取收货地址
   3 假设 用户 点击获取收货地址的提示框 取消
    scope 值 false
    1 诱导用户 自己打开 授权设置页面 当用户重新给予 获取地址权限的时候
    2 获取收货地址
   4 把获取到的收货地址 存入到 本地存储中
2 页面加载完毕
  0 onload onshow
  1 获取本地存储的地址数据
  2 把数据 设置给data中的一个变量
3 onShow
  0 回到了商品详情页面 当第一次添加商品的时候 手动添加了属性(num,checked)
    num=1;
    checked=true;
  1 获取缓存中的购物车数组
  2 把购物车数据 填充到data中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组 
  2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中
5 总价格和总数量
  1 商品被选中 才被计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
  5 总数量 += 商品的数量
  6 把计算后的价格和数量 设置回data中即可  
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选。 总价格 总数量
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取 data中的全选变量 allChecked
  3 直接取反 allChecked=!allChecked
  4 遍历购物车数组 让里面 商品选中状态跟随allChecked改变而改变
  5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中
8 商品数量的编辑
  1 “+” “-” 按钮 绑定同一个点击事件
    1 “+” +1
    2 “-” -1
  2 传递被点击的商品id goods_id
  3 获取data中的购物车数组来获取需要被修改的商品对象
  4 当 购物车的数量=1 同时用户点击“-”
    弹窗提示(showModal) 询问用户 是否要删除
      1 确定 直接执行删除
      2 取消 什么都不做
  4 直接修改商品对象的数量
  5 把cart数组 重新设置回缓存中和 data中 this.setCart
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到支付页面！
*/

import { getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
Page({
  data:{
    adress:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1 获取缓存中的收货地址信息
    const adress=wx.getStorageSync("adress");
    //1 获取缓存中的购物车数据
    const cart=wx.getStorageSync("cart")||[];
    //1 计算全选
    //every 数组方法 会遍历 会接受一个回调函数 当每一个回调函数都返回true 那么every方法的返回值为true 
    // 只要 有一个回调函数返回了false 那么不再循环执行，直接返回false
    // 空数组调用 every，返回值就是true
    /* const allChecked=cart.length?cart.every(v=>v.checked):false; 
        下面也有一个foreach循环，放一起进行性能优化
    */
    /* let allChecked=true;
    //1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+= v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    //判断数组是否为空
    allChecked=cart.length?allChecked:false;

    this.setData({
      adress,
      cart,
      allChecked,
      totalPrice,
      totalNum
    }) */
    this.setData({
      adress
    })
    this.setCart(cart);
  },
  //点击 收货地址
  async handleChooseAddress(){
    // 2  获取收货地址
/*     wx.chooseAddress({
      success: (result)=>{
       console.log(result);
      }
    })} */
    // 1 获取 权限状态
  //   wx.getSetting({
  //     success: (result)=>{
  //       // 2 获取权限状态 当发现 一些属性名很怪异的时候（比如scope.address其实是一个属性）都要使用【】形式来获取
  //       const scopeAddress = result.authSetting["scope.address"];
  //       if(scopeAddress===true || scopeAddress==undefined){
  //       wx.chooseAddress({
  //         success: (result1)=>{
  //         console.log(result1);
  //         }
  //       });
  //       }else{
  //         //3 用户以前拒绝过授予权限 诱导用户 自己打开 授权设置页面
  //         wx.openSetting({
  //           success: (result2)=>{
  //             wx.chooseAddress({
  //               success: (result3)=>{
  //               console.log(result3);
  //               }
  //             });
  //           }
            
  //         });
  //       }
  //     },
  //     fail: ()=>{},
  //     complete: ()=>{}
  //   });
  // }

try {
    // 1 获取 权限状态
    const res1= await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    // 2 判断 权限状态
    if(scopeAddress===false){
      // 3 诱导用户 自己打开 授权设置页面
      await openSetting();
    }
    // 4 调用收货地址的 api 
    let adress=await chooseAddress();
    adress.all=adress.provinceName+adress.cityName+adress.countyName+adress.detailInfo;
    // 5 把获取到的收货地址 存入到 本地存储中
    wx.setStorageSync("adress", adress);
  
} catch (error) {
  console.log(error);
}
},

//商品的选中
handleItemChange(e){
  // 1 获取被修改的商品的id
  const goods_id=e.currentTarget.dataset.id;
  // 2 获取购物车数组
  let {cart}=this.data;
  // 3 找到被修改的商品对象
  let index=cart.findIndex(v=>v.goods_id===goods_id);
  // 4 选中状态取反
  cart[index].checked=!cart[index].checked;
  // 5 6 把购物车数据重新设置回data中和缓存中
  this.setCart(cart);
},
// 设置购物车状态同时 重新计算底部工具栏的数据 全选 总价格 购买的数量
setCart(cart){
  let allChecked=true;
    //1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+= v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    //判断数组是否为空
    allChecked=cart.length?allChecked:false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync("cart",cart);
  
},
//商品全选功能
handleItemAllCheck(){
  // 1 获取data中的数据
  let {cart,allChecked}=this.data;
  // 2 修改值
  allChecked=!allChecked;
  // 3 循环修改cart数组中的商品选中状态
  cart.forEach(v=>v.checked=allChecked);
  // 4 把修改后的值填充回data或者缓存中
  this.setCart(cart);
},

//商品数量的编辑
async handleItemNumEdit(e){


  //1 获取传递过来的参数
  const {operation,id} = e.currentTarget.dataset;
  //2 获取购物车数组
  let {cart}=this.data;
  //3 找到需要修改的商品的索引
  const index=cart.findIndex(v=>v.goods_id===id);
  //4 判断是否要执行删除
  if(cart[index].num===1 && operation===-1){
/*     wx.showModal({
      title: '提示',
      content: 'Are you sure to delete？',
      success :(res)=> {
        if (res.confirm) {
          cart.splice(index);
          this.setCart(cart);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) */
    const res=await showModal({content:"Are you sure to delete？"});
    if (res.confirm) {
      cart.splice(index);
      this.setCart(cart);
    }     
  }else{
  //4 进行修改数量
  cart[index].num+=operation;
  //5 设置回缓存和data中
  this.setCart(cart);
  }

},
//点击结算
async handlePay(){
  //1 判断收货地址
  const{adress,totalNum}=this.data;
  if(!adress.userName){
    await showToast({title:"please add your address first"});
    return;
  }
  //2 判断用户有没有选购商品
  if(totalNum===0){
    await showToast({title:"you haven't choosed any goods"});
    return;
  }
  //3 跳转到 支付页面
  wx.navigateTo({
    url: '/pages/pay/index'
  });

}
 
})