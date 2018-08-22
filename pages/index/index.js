//index.js
//获取应用实例
const app = getApp()

Page({
  onReachBottom() {
    //上拉刷新
    this.getList();
  },
  onPullDownRefresh() {
     //下拉刷新
    this.getList(0,1,true);//拉取最新
    
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
      return {
        title: '币圈24小时',
        path: '/pages/index/index'
      }
    }
    return {
      title: '币圈24小时',
      path: '/pages/index/index'
    }
  },
	data: {
		list :[],
    nodata : '',
    moretext : '正在加载更多数据...',
    lastupdate : null
	},
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function () {
		this.getList();
  
	},
  nodata() {
    wx.showToast({
      title: '加载数据失败~',
      icon: 'none',
      duration: 2000
    });
    if (this.data.list.length === 0) {
      this.setData({
        nodata: '没有数据哦~~'
      });
    }
  },
  loadMore (){
    
   

  },
  getList(pageSize,isRefresh=1,pulldown) {
    let _this = this;
    if (pageSize !== 0 && this.data.lastupdate) {
      pageSize = this.data.lastupdate;
      isRefresh = 0;
    }
    wx.showNavigationBarLoading();
    if (!pulldown) {
      wx.showLoading({
        title: '加载中...'
      });
    }

    wx.request({
      url: 'https://api.finbtc.net/app//live/live', //仅为示例，并非真实的接口地址
      data: {
        isRefresh: isRefresh,
        publishAt: pageSize||0
      },
      header: {
        'content-type': 'application/json',
        'X-App-Info': '2.2.0/appstore/ios'
      },
      success (res){
        if (res.statusCode === 200 && res.data.code === 0) {
          let data = res.data.data.items;
          if (pageSize !== 0) {
            data = _this.data.list.concat(data);
          }
          _this.setData({
            lastupdate: data[data.length - 1].publishAt,
            list: data
          });
        }else {
          _this.setData({
            moretext : '已经到底了~~'
          });
        }
        console.log(res.data)
      },
      fail(res) {
        
        _this.nodata();
        
      },
      complete() {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        
      }
    });
	}
})
