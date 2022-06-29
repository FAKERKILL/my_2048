// pages/index/index.js
const DB = wx.cloud.database().collection("2048Users")
let best_point=""
let _id=""
let userid=""
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  //获取玩家userid
  getuserid(){
    wx.cloud.callFunction({
      name:"getopenid",
      success(res){
        userid=res.result.openid
        _id=res.result._id
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
          }
        },
        fail(res){
          console.log("失败")
        }
      })
     },
 
  

  //更新玩家最高分
    //输入玩家最高分
   pointInput(event){
      best_point=event.detail.value
     
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
  }
})