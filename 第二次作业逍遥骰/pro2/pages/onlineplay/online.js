// pages/onlineplay/online.js
var Timer,GameTimer;
var timer;
var resultpoint;
var MyUserID;
var serverip = '192.168.31.212'
Page({
  /**
   * 页面的初始数据
   */
  data: {
      gamestate: false,
      waiting: true,
      
      Enumcount:0,
      Mnumcount:0,

      player1 : true,
      player2 : false,
      p1Turn : false,
      p2Turn : true,
      WhichSide: 1,
      whichTurn: 1,
      num : 1,
      extra : 1,
      Mscore : 0,
      Escore : 0,
      number : null,
      mp1 : '',mp2 : '',mp3 : '',mp4 : '',mp5 : '',mp6 : '',mp7 : '',mp8 : '',mp9 : '',
      ep1 : '',ep2 : '',ep3 : '',ep4 : '',ep5 : '',ep6 : '',ep7 : '',ep8 : '',ep9 : '',
      mp: ['','','','','','','','',''],
      ep: ['','','','','','','','',''],
      p1touziImage : ['','','','','','','','',''],
      p2touziImage : ['','','','','','','','',''],
      Gameover : false,
      Gamenotover : true,
      winner : '',
      touziImage: '/images/1.png',
      isThrowing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    wx.login({
      success(res){
        if(res.code){
          MyUserID = res.code;
           wx.request({
             url: 'http://'+serverip+':5000/onlineuser',
             method: 'POST',
             data: {
                usercode: MyUserID,
             },
             header: {
             'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
             success(res) {
               console.log('loginSuccess');
               if(res.data == 1){
                console.log("你是玩家1")
                that.setData({
                  WhichSide: 1,
                  player1: true,
                  player2: false
                })
               }
               else if(res.data == 2){
                if(res.data == 2){
                  console.log("你是玩家2")
                  that.setData({
                    WhichSide:2,
                    player1: false,
                    player2: true
                  })
                 }
               }
             }
           })
        }
      }
      
    })
    this.TimerWaitPlayer();
  },
  GetWaitStatus(){
       var that = this;
       wx.request({
        url: 'http://'+serverip+':5000/gameready',
        method: 'POST',
        data: {
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
            if(res.data != 'disconnect')
                {
                  console.log('connect!')
                  if(res.data[0] == true) console.log('玩家1先')
                  else console.log('玩家2先')
                  that.setData({
                    gamestate: true,
                    waiting: false,
                    p1Turn: res.data[0],
                    p2Turn: res.data[1]
                  })
                  that.updateGameStatus();
                  clearInterval(Timer);
                }
           else 
               console.log(res.data);
            
        }
       })
  },
  

  getGameStatus(){
      var that = this;
      wx.request({   
        url: 'http://'+serverip+':5000/getGameStatus',
        method: 'POST',
        data: {
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
           that.setData({
              mp: res.data.m1,
              ep: res.data.m2,
              p1touziImage: res.data.Image1,
              p2touziImage: res.data.Image2,
              touziImage: res.data.isThrowing
           })
        }
       })   
       wx.request({
        url: 'http://'+serverip+':5000/getTurn',
        method: 'POST',
        data: {
        },
        header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
         },
        success(res) {
          that.setData({
            p1Turn: res.data[0],
            p2Turn: res.data[1]
          })
        }
      })   
      if(this.data.p1Turn == true)  this.setData({
        whichTurn : 1})
      else this.setData({
        whichTurn : 2}) 
      this.GetNowPutNum();
  },
  updateGameStatus(){
      GameTimer = setInterval(this.getGameStatus,100);
  },
  TimerWaitPlayer(){
      Timer = setInterval(this.GetWaitStatus, 500);
  },
  timerGO(){
    timer = setInterval(this.change, 100);
    setTimeout(()=>
   {
     clearInterval(timer);
     timer = 0;
   }, 1000)
  },
  change(){
    // 设置随机 : 1 ~ 6
    var temp = parseInt(Math.random() * 6)+1
    this.setData({
      num: temp,
      touziImage: '/images/'+String(temp)+'.png'
    })
    wx.request({
      url: 'http://'+serverip+':5000/getTouzi',
      method: 'POST',
      data: {
         number: this.data.num
      },
      header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
       },
      success(res) {}
      })
},
  play(){
    if((this.data.player1 == true&&this.data.p1Turn == true) || (this.data.player2 == true&&this.data.p2Turn == true))
    {
       
        this.timerGO();
    }
  },
  sendtoserver(key,value){
    var that = this;
    wx.request({
      url: 'http://'+serverip+':5000/sendToServer',
      method: 'POST',
      data: {
         key:key,
         value:value,
      },
      header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
       },
      success(res) {}
})

  },
  colScore(data1,data2,data3){
    var colSameCount = [0,0,0,0,0,0,0];
    var tempScore = 0;
      if(data1 != '')
      colSameCount[data1]++;
      if(data2 != '')
      colSameCount[data2]++;
      if(data3 != '')
      colSameCount[data3]++;
      for(var i = 1;i <= 6;i++)
        tempScore += colSameCount[i] * i * colSameCount[i];
      return  tempScore;
  },
  CalResult(){
      var MyScore = 0,EnemyScore = 0;
      for(let i = 0;i <= 2;i++)
        MyScore += this.colScore(this.data.mp[i],this.data.mp[i+3],this.data.mp[i+6]);
        for(let i = 0;i <= 2;i++)
      EnemyScore += this.colScore(this.data.ep[i],this.data.ep[i+3],this.data.ep[i+6]);

      if(MyScore > EnemyScore) this.setData({
        Gamenotover: false,
        Gameover: true,winner : "你赢了",Mscore : MyScore,Escore : EnemyScore});
      else if(MyScore < EnemyScore) this.setData({
        Gamenotover: false,
        Gameover: true,winner : "对手赢了",Mscore : MyScore,Escore : EnemyScore});
      else this.setData({
        Gamenotover: false,
        Gameover: true,winner : "平局"});
  },
changeTurn(){
  wx.request({
    url: 'http://'+serverip+':5000/changeTurn',
    method: 'POST',
    data: {
    },
    header: {
    'content-type': 'application/x-www-form-urlencoded' // 默认值
     },
    success(res) {}
})
},
updatePutNumToAll(side ,sig){
  wx.request({
    url: 'http://'+serverip+':5000/updatePutNumToAll',
    method: 'POST',
    data: {
      side:side,
      sig:sig
    },
    header: {
    'content-type': 'application/x-www-form-urlencoded' // 默认值
     },
    success(res) {}
})
},
GetNowPutNum(){
  var that = this;
  wx.request({
    url: 'http://'+serverip+':5000/GetNowPutNum',
    method: 'POST',
    data: {
    },
    header: {
    'content-type': 'application/x-www-form-urlencoded' // 默认值
     },
    success(res) {
      that.setData({
         Mnumcount: res.data[0],
         Enumcount: res.data[1],
      })
    }
})
if(this.data.Enumcount == 9||this.data.Mnumcount == 9){
  this.CalResult();
}
},

set(res){
  console.log(res.currentTarget.dataset);
  if(res.currentTarget.dataset.num == ''&&this.data.player1 == true&&this.data.p1Turn == true&&timer == 0){
      let index = res.currentTarget.dataset.index;
      this.changeTurn();
      this.sendtoserver('m'+String(index+1),this.data.num);

      let x = index;
      while(x - 3 >= 0) x-=3;

      for(let i = 0;i <= 2;i++)
     {
         let xb = `ep[${x+3*i}]`;
         let xbImage = `p2touziImage[${x+3*i}]`
         if(this.data.ep[(x+3*i)] == this.data.num) this.sendtoserver('e'+String(x+3*i+1),''),this.updatePutNumToAll('E','-');
     }    
      this.updatePutNumToAll('M','+');   
      if(this.data.Mnumcount == 9){
        this.CalResult();
      }
  }
},
eset(res){
console.log(res.currentTarget.dataset);
console.log(res.currentTarget.dataset);
  if(res.currentTarget.dataset.num == ''&&this.data.player2 == true&&this.data.p2Turn == true&&timer == 0){
      let index = res.currentTarget.dataset.index;
      this.changeTurn();
      this.sendtoserver('e'+String(index+1),this.data.num);

      let x = index;
      while(x - 3 >= 0) x-=3;

      for(let i = 0;i <= 2;i++)
     {
         let xb = `mp[${x+3*i}]`;
         let xbImage = `p1touziImage[${x+3*i}]`
         if(this.data.mp[(x+3*i)] == this.data.num) this.sendtoserver('m'+String(x+3*i+1),''),this.updatePutNumToAll('M','-');
     }    
      this.updatePutNumToAll('E','+');   
      if(this.data.Enumcount == 9){
        this.CalResult();
      }
  }
},
  restart(){
    this.setData({
      p1Turn : false,
      p2Turn : false,
      waiting : true,
      gamestate : false,
      num : 1,
      Mscore : 0,
      Escore : 0,
      number : null,
      mp1 : '',mp2 : '',mp3 : '',mp4 : '',mp5 : '',mp6 : '',mp7 : '',mp8 : '',mp9 : '',
      ep1 : '',ep2 : '',ep3 : '',ep4 : '',ep5 : '',ep6 : '',ep7 : '',ep8 : '',ep9 : '',
      Gameover : false,
      winner : '',
  }
    )
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    wx.request({
      url: 'http://'+serverip+':5000/deleteuser',
      method: 'POST',
      data: {
      },
      header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
       },
      success(res) {
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})