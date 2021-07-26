import { showToast } from "../../utils/asyncWx"

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    chooseImgs: [],  // 选中的图片 数组
    textVal: ""  // 文本域的内容
  },

  upLoadImgs: [], // 外网的图片路径数组

  // 顶部导航栏点击事件
  handleChangeTabItem(e) {
    // 获取子组件tabs传过来的索引
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false)
    this.setData({
      tabs
    })
  },

  // 处理 +按钮点击事件
  handleChooseImg() {
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片的 原图和压缩
      sizeType: ['original', 'compressed'],
      // 图片来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
  },

  // 处理 添加图片上的 x点击
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset
    let { chooseImgs } = this.data
    chooseImgs.splice(index, 1)
    this.setData({
      chooseImgs
    })
  },

  // 处理 文本域输入事件
  handleText(e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  // 处理 提交按钮事件
  async handleForm() {
    // 1. 获取文本域的内容 图片数组
    const { textVal, chooseImgs } = this.data
    //  2. 内容 合法性检验
    if (!textVal.trim()) {
      await showToast("输入不合法")
    }
    // 判断用户有没有上传图片 有 执行下面提交 没有 跳到else提交
    if (chooseImgs.length !== 0) {
      // 3. 上传图片 到专门的服务器中
      // api 不支持 多个文件同时上传 所以要遍历数组 挨个上传
      chooseImgs.forEach((item, index) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'http://img.coolcr.cn/api/upload',
          // 被上传文件的路径
          filePath: item,
          // 上传文件的名称 后台来获取文件
          name: "image",
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).data.url
            this.upLoadImgs.push(url)

            // 上传的过程中 显示等待
            wx.showLoading({
              title: '正在上传',
              mask: true,
            });

            // 4. 所有图片都上传完毕才触发
            if (index === chooseImgs.length - 1) {
              wx.hideLoading();
              wx.showToast({
                title: '您的反馈已收到',
              });

              console.log("把文本的内容和外网的图片数组 提交到后台");
              // 5. 重置当前页面
              this.setData({
                textVal: '',
                chooseImgs: []
              })
              // 6. 返回上一个页面
              // setTimeout(() => {
              //   wx.navigateBack({
              //     delta: 1
              //   });
              // }, 2000);
            }
          }
        });
      })
    } else {
      console.log("提交文本到后台");
      await showToast("您的反馈已收到")
      this.setData({
        textVal: '',
      })
      // setTimeout(() => {
      //   wx.navigateBack({
      //     delta: 1
      //   });
      // }, 2000);
    }
  }
})