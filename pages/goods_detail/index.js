import {
  request
} from '../../request/index'
Page({
  data: {
    goodsObj: {},
    // 商品默认收藏
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    const {
      goods_id
    } = currentPage.options
    this.getGoodsDetail(goods_id)

  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    })
    // 对没有轮播图的页面进行自定义图片
    if (!goodsObj.pics.length) {
      goodsObj.pics = [{
        pics_mid: 'https://xiaowei849.gitee.io/api/image/yougou/no_image.jpg'
      }]
    }
    this.GoodsInfo = goodsObj

    // 获取缓存中商品收藏的数组
    let collect = wx.getStorageSync('collect') || []
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图，放大预览
  handlePrevewImage(e) {
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    // 接收传递过来的图片url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      urls,
      current
    })
  },
  // 点击加入购物车
  handleCartAdd() {
    // 获取缓存中的购物车 数组
    let cart = wx.getStorageSync('cart') || []
    // 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 存在 数量加1
      cart[index].num++
    }
    // 把购物车添加进缓存中
    wx.setStorageSync('cart', cart)
    // 弹窗提示
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    })
  },
  // 点击 商品收藏图标
  handleCollect() {
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index！=-1表示 已经收藏过 
    if (index !== -1) {
      // 能找到 已经收藏过了  在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });

    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性  isCollect
    this.setData({
      isCollect
    })
  }
})