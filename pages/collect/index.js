// pages/collect/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: [{
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false
      }
    ]
  },
  onShow() {
    let collect = wx.getStorageSync("collect") || [];
    // 对没图片的商品进行自定义图片
    collect.forEach(v => {
      if (!v.goods_small_logo) {
        v.goods_small_logo = 'https://xiaowei849.gitee.io/api/image/yougou/no_image.jpg'
      }
    })
    this.setData({
      collect
    });
  },
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  }
})