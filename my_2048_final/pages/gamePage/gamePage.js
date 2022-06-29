var Main =require("./main");


const DB = wx.cloud.database().collection("2048Users")
let best_point=wx.getStorageSync('best_point')
let _id=""
let userid=""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    map: [],
    point: 2,
    best_point: 0, // 最高分
  },


  //重新开始或游戏失败
  restart: function(){
    //显示结果框
    let point=this.data.point;
    this.over(point);
    wx.showModal({
      title: '游戏结束',
      content: '得分：'+point+'\n'+'最高分：'+best_point,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
      //随机生成两格
      var main = new Main(4);
      this.setData({
        main: main,
        point:2
      });
      this.data.main.__proto__ = main.__proto__;
      this.setData({
        map: this.data.main.board.grid
      });  
  },



 // 触摸
 touchStartX: 0,
 touchStartY: 0,
 touchEndX: 0,
 touchEndY: 0,
 absdisX: 0,
 absdisY: 0,

 touchStart: function(ev) { // 触摸开始坐标
   var touch = ev.touches[0];
   this.touchStartX = touch.clientX;
   this.touchStartY = touch.clientY;

 },
 touchMove: function(ev) { // 触摸最后移动时的坐标
   var touch = ev.touches[0];
   this.touchEndX = touch.clientX;
   this.touchEndY = touch.clientY;
 },

 disX: 0,
 disY: 0,
 //获取到用户操作
 get_operation:function() {
    this.disX = this.touchStartX - this.touchEndX;
    this.absdisX= Math.abs(this.disX);
    this.disY = this.touchStartY - this.touchEndY;
    this.absdisY = Math.abs(this.disY);
 },

 //更新map,并且计算出map当前的得分point,然后判断map是否已经是结束状态
operation:function() {
  if(this.judge_over()) { // 游戏是否结束
    this.restart();
  } else {
    if (Math.max(this.absdisX, this.absdisY) > 10) { // 确定是否在滑动
      var direction = this.absdisX > this.absdisY ? (this.disX < 0 ? 1 : 3) : (this.disY < 0 ? 2 : 0);  // 确定移动方向
      var data = this.data.main.move(direction);
      this.updateView(data);
    }   
  }      
},

//触摸结束
 touchEnd: function() {
   this.get_operation();
   this.operation();
 },

 //更新视图
 updateView(data) {
   var max = 0;
   for(var i = 0; i < 4; i++)
     for(var j = 0; j < 4; j++)
       if(data[i][j] != "" && data[i][j] > max)
         max = data[i][j];
   this.setData({
     map: data,
     point: max
   });
 },


 
  // 更新最高分
  update_database:function(){
    //根据userid查询出_id
    DB.where({
     'user_id':userid
    }).get({
      success(res){
        _id=res.data[0]._id
      },
      fail(res){
        console.log("更新失败")
      }
    })
    DB.doc(_id).update({
      data:{
        'bestpoint': best_point
      },
      success(res){
        console.log("更新成功,新的最高分为",best_point)
      },
      fail(res){
        console.log("更新失败",res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    best_point = wx.getStorageSync('best_point');
    _id = wx.getStorageSync('_id');
    userid = wx.getStorageSync('userid');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //随机生成两格
    var main = new Main(4);
    this.setData({
      main: main,
      point:2
    });
    this.data.main.__proto__ = main.__proto__;
    this.setData({
      map: this.data.main.board.grid
    });  
  },


  //结束
 over: function(point) {
  let bestpoint = best_point;
  let current_point = point;

  if(bestpoint < current_point){
    best_point = current_point;
    this.update_database();
  }
},

  //判断结束
  judge_over: function(point) {
    this.data.main.board.__proto__ = this.bproto;
    if (!this.data.main.board.cellEmpty()) {
      return false;
    } else {
      for (var i = 0; i < 4; i++) // 左右不等
        for (var j = 1; j < 4; j++) {
          if (this.data.main.board.grid[i][j] == this.data.main.board.grid[i][j - 1])
            return false;
        }
      for (var j = 0; j < 4; j++)  // 上下不等
        for (var i = 1; i < 4; i++) {
          if (this.data.main.board.grid[i][j] == this.data.main.board.grid[i - 1][j])
            return false;
        }
    }
    return true;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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