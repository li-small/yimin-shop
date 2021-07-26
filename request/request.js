// 同时发送异步请求的次数
let ajaxCount = 0
export function request(params) {
  // 判断 url路径中是否带有 /my/ 有的话 带上header和token
  let header = { ...params.header }
  if (params.url.includes("/my/")) {
    // 拼接header 带上token
    header["Authorization"] = wx.getStorageSync("token");
  }

  ajaxCount++
  // 开启正在加载图标
  wx.showLoading({
    title: '正在加载',
    mask: true
  });

  // 定义公共的url
  const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1';
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseURL + params.url,
      success: (result) => {
        resolve(result.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        if (--ajaxCount === 0) {
          // 关闭加载的图标
          wx.hideLoading();
        }
      }
    });
  })
}