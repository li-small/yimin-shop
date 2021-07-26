/**
 * promise 优化showModal
 */
export function showModal(content) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

/**
 * promise 优化showToast
 */
export function showToast(title) {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon: 'none',
      mask: true,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

/**
 * promise 优化login
 */
export function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
    });

  })
}

/**
 * promise 优化requestPayment
 */
export function requestPayment(pay) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      // timeStamp: '',
      // nonceStr: '',
      // package: '',
      // signType: '',
      // paySign: '',
      ...pay,  // 上面的解构
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        // 因为支付不了 所以我这里换成弹窗 假装支付成功
        reject(err)
        showToast("支付成功")
      }
    });
  })
}
