// pages/cart/index.js
import {
  chooseAddress,
  showModal,
  showToast
} from '../../utils/asyncWx.js'
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 2 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 对没有图片的商品进行自定义图片
    cart.forEach(v => {
      if (!v.goods_small_logo) {
        v.goods_small_logo = 'https://xiaowei849.gitee.io/api/image/yougou/no_image.jpg'
      }
    })
    this.setData({
      address
    });
    this.setCart(cart);

  },

  // 点击收货地址
  async handleChooseAddress() {
    let address = await chooseAddress()
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
    // 存入到缓存中
    wx.setStorageSync('address', address)
  },

  // 商品选中
  handleItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组 
    let {
      cart
    } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);

  },

  // 修改状态
  setCart(cart) {
    let allChecked = true;
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },

  // 修改全选反选
  handleItemAllCheck() {
    // 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data
    // 修改值
    allChecked = !allChecked
    // 循环修改cart中的选中状态
    cart.forEach(v => v.checked = allChecked)
    // 把修改的值填充到data或缓存中
    this.setCart(cart)
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数 
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let {
      cart
    } = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({
        content: "您是否要删除？"
      });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4  进行修改数量
      cart[index].num += operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
    }
  },
  // 商品结算
  async handlePay() {
    // 判断收货地址和商品数量
    const {
      address,
      totalNum
    } = this.data
    if (totalNum === 0) {
      await showToast({
        title: "您还没有选购商品！"
      })
      return
    }
    if (!address.userName) {
      await showToast({
        title: "您还没有选择收货地址！"
      })
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})