import { request } from '../../request/request.js'

Page({
  data: {
    leftMenuList: [],  // 左侧菜单数据
    rightGoods: [],  // 右侧商品展示数据
    currentIndex: 0,  // 当前选中的索引
    scrollTop: 0  // 右侧商品展示内容距离顶部的距离
  },
  categoryData: [],  // 接口返回数据
  onLoad: function (options) {
    /**
     * 缓存优化
     */
    //  获取本地存储中的数据 
    const NativeData = wx.getStorageSync('nativeData');
    //  判断本地有没有存储旧数据
    if (!NativeData) {
      // 不存在 发送请求获取数据
      this.getCategory();
    }
    else {
      // 判断旧数据有没有过期
      if (Date.now() - NativeData.time > 1000 * 60) {
        // 重新发送请求
        this.getCategory();
      }
      else {
        // 可以使用旧的数据
        this.categoryData = NativeData.data;
        let leftMenuList = this.categoryData.map(res => res.cat_name)
        let rightGoods = this.categoryData[0].children
        this.setData({
          leftMenuList,
          rightGoods
        })
      }
    }
  },
  // 获取分类数据
  /*   getCategory() {
      request({ url: '/categories' }).then(res => {
        this.categoryData = res;
        //  把接口的数据存入到本地存储中
        wx.setStorageSync('nativeData', { time: Date.now(), data: this.categoryData });
  
        // 构造左侧菜单数据
        let leftMenuList = this.categoryData.map(res => res.cat_name)
        // 构造右侧商品展示数据
        let rightGoods = this.categoryData[0].children
  
        this.setData({
          leftMenuList,
          rightGoods
        })
      })
    }, */

  // async 对上面的优化
  async getCategory() {
    // 使用es7的async await来发送异步请求
    const res = await request({ url: '/categories' });  // 这一行请求代码没回来之前不会执行下面的代码
    this.categoryData = res;
    //  把接口的数据存入到本地存储中
    wx.setStorageSync('nativeData', { time: Date.now(), data: this.categoryData });

    // 构造左侧菜单数据
    let leftMenuList = this.categoryData.map(res => res.cat_name)
    // 构造右侧商品展示数据
    let rightGoods = this.categoryData[0].children

    this.setData({
      leftMenuList,
      rightGoods
    })
  },


  // 左侧菜单点击
  handleMenuItem(e) {
    const { index } = e.currentTarget.dataset;
    // 获取当前索引商品展示数据
    let rightGoods = this.categoryData[index].children;
    this.setData({
      currentIndex: index,
      // 最后赋值渲染
      rightGoods,
      scrollTop: 0  // 点击后设置右侧商品内容回到顶部
    })
  }
})