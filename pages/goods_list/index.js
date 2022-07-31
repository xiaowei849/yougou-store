// 下拉加载下一页，判断
import {
  request
} from '../../request/index'
Page({
  data: {
    tabs: [{
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,

  // 获取商品列表数据
  async getGoodsList() {
    let res = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    // 给没图片链接的商品自定义图片
    res.goods.forEach(v => {
      if(!v.goods_small_logo){
        v.goods_small_logo = 'https://xiaowei849.gitee.io/api/image/yougou/no_image.jpg'
      }
    })
    // 获取总条数
    const total = res.total
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 数据回来了，手动关闭刷新效果
    wx.stopPullDownRefresh()
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) { 
    // 获取索引
    const {
      index
    } = e.detail
    // 修改原数组
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 赋值到data中
    this.setData({
      tabs
    })
  },
  onLoad(options) {
    this.QueryParams.cid = options.cid || ''
    this.QueryParams.query = options.query || ''
    this.getGoodsList()
  },
  // 页面上划 触底
  onReachBottom() {
    // 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据'
      })
    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  // 下拉触发事件
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1
    // 重新发送请求
    this.getGoodsList()
  }
})