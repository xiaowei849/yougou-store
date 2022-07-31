import {
  request
} from '../../request/index.js'
Page({
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容距离滚动条的距离
    scrollTop: 0
  },
  // 接口返回数据
  Cates: [],

  // 左侧菜单点击事件
  handleItemTap(e) {
    // 获取索引
    let currentIndex = e.currentTarget.dataset.index
    // 构造右侧商品数据
    let rightContent = this.Cates[currentIndex].children
    this.setData({
      currentIndex,
      rightContent,
      scrollTop: 0
    })
  },

  onLoad(options) {
    /* 
      1 先判断本地存储有没有旧的数据
      2 没有旧数据 直接发送新请求
      3 有旧数据，而且旧数据没过期 直接用旧数据
    */

    // 1 获取本地存储的数据
    const Cates = wx.getStorageSync('cates')
    // 2 判断，不存在则发送请求
    if (!Cates) {
      this.getCates()
    } else {
      // 有旧的数据，定义过期时间
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        // 重新发送请求
        this.getCates()
      } else {
        // 可以使用旧数据
        this.Cates = Cates.data
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        // 构造右侧商品数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  // 获取分类数据
  async getCates() {
    const res = await request({
      url: '/categories'
    })
    this.Cates = res
    // 把接口数据存储到本地存储中
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    })
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent,
    })
  }
})