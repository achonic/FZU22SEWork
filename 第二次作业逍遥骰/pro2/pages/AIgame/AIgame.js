// index.js
var timer;
var resultpoint;
var Mnumcount = 0,Enumcount = 0;
Page({
  data:{
    time : (new Date()).toString(),
    tid1 : "hehe",
    condition : true,
    array : [{
        message : 'foo',
      },{
        message : 'bar'
      }],
      MyTurn : true,
      EnemyTurn : false,
      num : 1,
      extra : 1,
      Mscore : 0,
      Escore : 0,
      number : null,
      ss : [0,0],
      istuoguan : false,
      mp: ['','','','','','','','',''],
      ep: ['','','','','','','','',''],
      p1touziImage : ['','','','','','','','',''],
      p2touziImage : ['','','','','','','','',''],
      Gameover : false,
      winner : '',
      touziImage: '/images/3.png'
    },
  onUnload: function(){

  },
  
  //前后端数据交互 wx.request
  onLoad: function() {
    var that = this;
   
    
    //新闻资讯
    wx.request({
      url: 'http://124.222.161.184:5000/wxflask',
      method: 'POST',
      data: {
        data: 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        that.setData({
          extra: res.data
        });
       console.log(that.data.extra);
      }
    })
  },

  timerGO(){
    timer = setInterval(this.change, 50);
    
    setTimeout(()=>
   {
     clearInterval(timer);
     timer = 0;
     if(this.data.MyTurn == true&&this.data.istuoguan == true) this.MAIplay();
     else if(this.data.EnemyTurn == true) this.AIplay();
     console.log(timer);
   }, 1000)
  },
  change(){
    // 设置随机 : 1 ~ 6
    var temp = parseInt(Math.random() * 6)+1
    this.setData({
      num: temp,
      touziImage: '/images/'+String(temp)+'.png'
    })
  },
  play(){
    this.timerGO();
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

      if(MyScore > EnemyScore) this.setData({Gameover: true,winner : "你赢了",Mscore : MyScore,Escore : EnemyScore});
      else if(MyScore < EnemyScore) this.setData({Gameover: true,winner : "对手赢了",Mscore : MyScore,Escore : EnemyScore});
      else this.setData({Gameover: true,winner : "平局"});
  },
  calNowScore(){
      var MyScore = 0,EnemyScore = 0;
      for(let i = 0;i <= 2;i++)
          MyScore += this.colScore(this.data.mp[i],this.data.mp[i+3],this.data.mp[i+6]);
      for(let i = 0;i <= 2;i++)
          EnemyScore += this.colScore(this.data.ep[i],this.data.ep[i+3],this.data.ep[i+6]);
      return [MyScore, EnemyScore];
  },
  MAIplay(){
    let tempPos,tempScore=[],maxScore = -1000,maxPos = 0,tempClear=[];
    for(let i = 0;i <= 2;i++){
       for(let j = 0;j <= 2;j++)
       {
         if(this.data.mp[i+3*j] == ''){
             tempPos = i+3*j;
             let xb = `mp[${i+3*j}]`;
             this.setData({
                [xb]: this.data.num
             });
             let x = tempPos;
             while(x - 3 >= 0) x-=3;
             for(let k = 0;k <= 2;k++)
           {
              let xb2 = `ep[${x+3*i}]`;
              console.log(x+3*i)
              console.log(this.data.ep[x+3*i])
              if(this.data.ep[(x+3*i)] == this.data.num) this.setData({[xb2]: ''}),tempClear.push(xb2);
           }

             tempScore = this.calNowScore();

             this.setData({[xb]: ''});
             for(let k = 0;k < tempClear.length;k++){
               let a = tempClear[k];
               this.setData({[a]: this.data.num});
             }
             break;
         }
       }
       if(tempScore[1] - tempScore[0] > maxScore) {maxPos = tempPos; maxScore = tempScore[1] - tempScore[0];}
    } 
    let xb = `mp[${maxPos}]`;
    let infoImage = `p1touziImage[${maxPos}]`
    this.setData({
        [xb]: this.data.num,
        [infoImage]: '/images/'+String(this.data.num)+'.png',
        MyTurn : false,
        EnemyTurn : true,
    });
    let x = maxPos;
    while(x - 3 >= 0) x-=3;
    for(let i = 0;i <= 2;i++)
     {
         let xb = `ep[${x+3*i}]`;
         let xbImage = `p2touziImage[${x+3*i}]`
         console.log(x+3*i)
         console.log(this.data.ep[x+3*i])
         if(this.data.ep[(x+3*i)] == this.data.num) this.setData({[xb]: '',[xbImage]:''}),Enumcount--;
     }
     Mnumcount++;
     
     if(Mnumcount == 9){
        this.CalResult();
     }
     else 
       this.play();
  },

  AIplay(){
    let tempPos,tempScore=[],maxScore = -1000,maxPos = 0,tempClear=[];
    for(let i = 0;i <= 2;i++){
       for(let j = 0;j <= 2;j++)
       {
         if(this.data.ep[i+3*j] == ''){
             tempPos = i+3*j;
             let xb = `ep[${i+3*j}]`;
             this.setData({
                [xb]: this.data.num
             });
             let x = tempPos;
             while(x - 3 >= 0) x-=3;
             for(let k = 0;k <= 2;k++)
           {
              let xb2 = `mp[${x+3*i}]`;
              console.log(x+3*i)
              console.log(this.data.mp[x+3*i])
              if(this.data.mp[(x+3*i)] == this.data.num) this.setData({[xb2]: ''}),tempClear.push(xb2);
           }

             tempScore = this.calNowScore();

             this.setData({[xb]: ''});
             for(let k = 0;k < tempClear.length;k++){
               let a = tempClear[k];
               this.setData({[a]: this.data.num});
             }
             break;
         }
       }
       if(tempScore[1] - tempScore[0] > maxScore) {maxPos = tempPos; maxScore = tempScore[1] - tempScore[0];}
    } 
    let xb = `ep[${maxPos}]`;
    let infoImage = `p2touziImage[${maxPos}]`
    this.setData({
        [xb]: this.data.num,
        [infoImage]: '/images/'+String(this.data.num)+'.png',
        MyTurn : true,
        EnemyTurn : false,
    });
    let x = maxPos;
    while(x - 3 >= 0) x-=3;
    for(let i = 0;i <= 2;i++)
     {
         let xb = `mp[${x+3*i}]`;
         let xbImage = `p1touziImage[${x+3*i}]`
         console.log(x+3*i)
         console.log(this.data.mp[x+3*i])
         if(this.data.mp[(x+3*i)] == this.data.num) this.setData({[xb]: '',[xbImage]:''}),Mnumcount--;
     }
     Enumcount++;
     
      if(Enumcount == 9){
        this.CalResult();
     }
     else if(this.data.istuoguan == true){
        this.play();
     }
},
tuoguan(){
   if(this.data.istuoguan == false&&this.data.MyTurn == true)
   {
       this.setData({
          istuoguan: true,
       })
       this.play();
    }
    else 
     {
       clearInterval(timer);
       this.setData({
           istuoguan: false,
       })
      }

},
  set(res){
      console.log(res.currentTarget.dataset);
      if(res.currentTarget.dataset.num == ''&&this.data.MyTurn == true&&timer == 0&&this.data.istuoguan == false){
        let index = res.currentTarget.dataset.index
        console.log(res.currentTarget.dataset.index);
        let info = `mp[${index}]`
        let infoImage = `p1touziImage[${index}]`
        this.setData({
          [info]: this.data.num,
          [infoImage]: '/images/'+String(this.data.num)+'.png',
          MyTurn : false,
          EnemyTurn : true,
        })
        let x = index;
        while(x - 3 >= 0) x-=3;
        for(let i = 0;i <= 2;i++)
         {
             let xb = `ep[${x+3*i}]`;
             let xbImage = `p2touziImage[${x+3*i}]`
             if(this.data.ep[x+3*i] == this.data.num) this.setData({[xb]: '',[xbImage]: ''}),Enumcount--;
         }
         Mnumcount++;
      if(Mnumcount == 9){
        this.CalResult();
      }
      else this.play();
     }
},


eset(res){
  console.log(res.currentTarget.dataset);
  if(res.currentTarget.dataset.num == ''&&this.data.EnemyTurn == true){
    let index = res.currentTarget.dataset.index
    console.log(res.currentTarget.dataset.index);
    let info = `ep[${index}]`
    let infoImage = `p2touziImage[${index}]`
    this.setData({
      [info]: this.data.num,
      [infoImage]: '/images/'+String(this.data.num)+'.png',
      MyTurn : true,
      EnemyTurn : false,
    })
    let x = index;
    while(x - 3 >= 0) x-=3;
    for(let i = 0;i <= 2;i++)
     {
         let xb = `mp[${x+3*i}]`;
         let xbImage = `p1touziImage[${x+3*i}]`
         console.log(x+3*i)
         console.log(this.data.mp[x+3*i])
         if(this.data.mp[(x+3*i)] == this.data.num) this.setData({[xb]: '',[xbImage]:''}),Mnumcount--;
     }
     Enumcount++;
  if(Enumcount == 9){
    this.CalResult();
  }
  }
},
  restart(){
    Mnumcount = 0,Enumcount = 0;
    this.setData({
      MyTurn : true,
      EnemyTurn : false,
      num : 1,
      Mscore : 0,
      Escore : 0,
      number : null,
      istuoguan : false,
      mp: ['','','','','','','','',''],
      ep: ['','','','','','','','',''],
      p1touziImage : ['','','','','','','','',''],
      p2touziImage : ['','','','','','','','',''],
      Gameover : false,
      winner : '',
  }
    )
  }
})
