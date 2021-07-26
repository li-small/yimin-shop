// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    HandleTabItem(e) {
      // 获取点击的索引
      const { index } = e.currentTarget.dataset;
      // 触发自定义事件给 父组件 并传索引值
      this.triggerEvent("changeTabItem", { index })
    }
  }
})
