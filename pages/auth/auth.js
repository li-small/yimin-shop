import { login } from "../../utils/asyncWx.js"
import { request } from "../../request/request.js"

Page({
  // 处理用户授权点击
  async handleGetuserinfo(e) {
    try {
      // 1. 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2. 获取小程序登录成功后的code
      const { code } = await login()

      // 需要传递过去获取用户token的参数
      const loginParams = { encryptedData, rawData, iv, signature, code }

      // 3. 发送请求 获取用户的token
      // const token = await request({ url: "/users/wxlogin", data: loginParams, method: "POST" })
      // 这里的接口因为没有权限 所以获取不了token 为null
      // 所以我自己这里创建了一个token变量 假装获取到
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"

      // 4. 把token存入缓存中 同时跳转回上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})