// pages/login/index.js
Page({
  handleGetUserInfo(e){
   const {userInfo}=e.detail;
   wx.setStorageSync("userInfo", userInfo);
    //  跳回到调用页面
    wx.navigateBack({
      delta: 1
    });
  }
})