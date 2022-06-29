const DB = wx.cloud.database().collection("2048Users")
let best_point=0
let _id=""
let userid=""

Page({
  data: {
    point:40
  },
  goToGamePage: function(){
    wx.redirectTo({
      url: '../gamePage/gamePage'
    });
  },

  //获取玩家userid
  getuserid(){
    var that = this;
    wx.cloud.callFunction({
      name:"getopenid",
      success(res){
        userid=res.result.openid
        _id=res.result._id
        that.onReady()
      },fail(res){
        console.log("获取userid失败",res)
      }
    })
  },

  //   加入缓存中
  set_storage:function(key,data){
      wx.setStorage({
        data: data,
        key: key,
      })
  },

  //查询玩家数据，若是新用户自动注册
  cloud_database(){
    var that=this;
    DB.where({
      'user_id':userid
    }).get({
      success(res){
        if(res.data.length == 0){
          DB.add({
            data:{
              'user_id': userid,
              'bestpoint':0
            },
            success(res){
              console.log("您是新用户，已为您注册")
              console.log("user_id为",userid)
              console.log("最高分为0")
            },
            fail(res){
              console.log("添加失败",res)
            }
          })
        }
        else{
          _id=res.data[0]._id
          best_point=res.data[0].bestpoint
          console.log("user_id为",userid)
          console.log("最高分为",best_point)
          that.onShow()          
        }
      },
      fail(res){
        console.log("失败")
      }
    })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuserid()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (userid != ''){
      this.cloud_database()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.set_storage('best_point' , best_point)
    this.set_storage('_id' , _id)
    this.set_storage('userid' , userid)
    console.log(best_point)
    best_point = parseInt(best_point)
    this.setData({
      point : best_point
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})