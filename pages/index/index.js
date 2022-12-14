// 引入用来发送请求的方法，把路径补全
import {
  request
} from '../../request/index.js'
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: [],
  },
  // 页面开始加载就会触发
  onLoad() {
    // 1.发送异步请求获取轮播图数据、导航菜单、楼层数据
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },

  // 获取轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata'
    }).then(result => {
      this.setData({
        swiperList: result
      })
    })
  },

  // 获取分类导航数据
  getCateList() {
    request({
      url: '/home/catitems'
    }).then(result => {
      this.setData({
        catesList: result
      })
    })
  },

  // 获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata'
    }).then(result => {
      this.setData({
        floorList: result
      })
    })
  },
})