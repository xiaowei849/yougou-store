// pages/login/index.js
import {
  request
} from "../../request/index.js";
import {
  getUserProfiles
} from "../../utils/asyncWx.js";

Page({
  async handleGetUserInfo() {
    // 1 获取用户信息
    const {
      userInfo
    } = await getUserProfiles();
    wx.setStorageSync('userinfo', userInfo)
    wx.navigateBack({
      delta: 1
    })
  }
})