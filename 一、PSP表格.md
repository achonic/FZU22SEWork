# 一、PSP表格
## 1.1、在开始实现程序之前，在附录提供的PSP表格记录下你估计将在程序的各个模块的开发上耗费的时间。
| **PSP2.1** | **Personal Software Process Stages** | **预估耗时（分钟）** | **实际耗时（分钟）** |
| ---------- | ------------------------------------ | -------------------- | -------------------- |
| Planning   | 计划                                 | 1000                 | 2000                 |
| 行2，列1   | 行2，列2                             | 行2，列3             |                      |
| 行3，列1   | 行3，列2                             | 行3，列3             |                      |

# 二、任务要求的实现

## 1、**项目设计与技术栈**

### 1.项目设计：

* 根据题目需求，将项目分为两个部分，***爬虫和数据统计处理*** 和 ***数据可视化***

* **爬虫和数据统计处理**：分为**爬取数据、处理数据、导入数据**三部分，使用python语言编写。技术栈：爬取数据使用request库向卫健委官网爬取疫情报告文本，处理数据使用beautifulsoup4，对爬取内容解析分割处理，导入数据excel使用pandas库，将处理完的数据自动写入excel中。
* **数据可视化**：分为**数据请求，后端，前端**三部分，使用python，Vue编写。技术栈：python使用flask库作为web后端，用以导入数据，更新数据，并且接收前端发送的axios数据请求。前端采用Vue，从后端请求疫情数据，结合Echarts图表库进行可视化。前后端分离开发，前端可视化做好之后build编译为静态文件由flask运行。

![8}8CYP68%D{A[3OICL1_3SW.png](https://github.com/achonic/FZU22SEWork/blob/main/112000927/8%7D8CYP68%25D%7BA%5B3OICL1_3SW.png?raw=true)

### 2.爬虫与数据处理：

#### (1)、爬取卫健委疫情报告列表

+ 要获取从疫情至今的新增数据，必须先获取每一份疫情报告的链接。

```python
'''
获取卫健委疫情报告列表

由分析得知 卫健委官网列表的链接有以下规律：
    'http://www.nhc.gov.cn/xcs/yqtb/list_gzbd_' + str(i)
    共42页 逐页爬取
'''
def Deal_EpidemicDaysList():

        
'''
  爬取卫健委官网页面  返回页面信息！
'''    
def requests_page(url):
    headers = {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    }
    try:
        response = requests.get(url=url, headers=headers)

        if response.status_code == 200:
            print("success!")
            return response.content.decode()
        else:
      #      print("retry")
            time.sleep(1)   #若没有成功则重试
    except requests.requestException:
        return None    
    
    
'''
  处理爬取到的页面
  每份疫情报告的链接存在页面的li标签里
  用beautifulsoup4库 将li标签里的链接筛选出来，并存取在列表中
'''     
def HandleContentData(soup):

'''
  将处理好的数据 写入 Excel 中 使用pandas库中的 Dataframe to_excel
'''     
def write_Data_To_Excel():    
```

#### (2)、爬取处理卫健委疫情报告

+ 上一步将每一份疫情报告的链接都写入excel之后，就可以开始对每份报告爬取我们想要的本土新增确诊，和本土新增无症状的人数（31省市含港澳台）。
+ 爬取部分与上一步相同，主要是对数据的处理

```python
#读取报告链接
df = pd.read_excel(epidemicPosters_links_file)

'''
  遍历每一份报告
'''
def Deal_EpidemicPost():
    
'''
  爬取疫情报告解析文本
'''    
def Get_Epidemic_Data(i):

'''
  爬取疫情报告解析文本
'''      
def HandleContentData(Pagei, soup):
    #开始文本处理
    for i in list:
        if i.text != "":  #筛掉报告为空的段落
            item = i
            break    
     s = item.text #遍历 本土新增疫情的段落
    
     local += s[i] + s[i + 1] + s[i + 2] + s[i + 3]
     if local == "本土病例":  #遍历文本 找到关键字：本土病例
               #本土病例的短句中有病例数，将其分割出来存贮在列表中 以及变量LocalcasesNum
            
     #疫情报告格式 在关键字：本土病例 后面的括号里为各省市的新增确诊人数 把这段文本提取出来
                # 本土新增文本提取 根据括号匹配
                while s[i] != "（":
                    i += 1
                leftbrackets = 1
                rightbrackets = 0
                i += 1
                while leftbrackets != rightbrackets and i < len(s) - 3:
                    if s[i] == '（':
                        leftbrackets += 1
                    if s[i] == '）':
                        rightbrackets += 1
                    NewCases_Text += s[i]
                    i += 1    
                    
provinces = ['河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川'
    , '贵州', '云南', '陕西', '甘肃', '青海', '内蒙古', '广西', '西藏', '宁夏', '新疆', '北京', '天津', '上海', '重庆', '兵团']
        '''
        提取出各省新增文本之后 
           遍历provinces
              调用GetTheCases(CasesText, province, LocalcasesNum) 返回省份对应的病例数
        '''
 '''
       参数为 （ 各省市本土新增文本，xx省，本土新增确诊人数）
       返回 xx省的新增确诊人数
       
       一般来说有普遍的格式为：  例： 北京xx例，上海xx例，广东xx例
                             省份接数字，只需遍历文本 和所要查询的省份比对，然后得到新增数，返回值
               不过有以下特殊形式
                  （均为广东）（在云南xxxxxxxx）
                  这种情况则 该省新增人数 = 本土新增（LocalcasesNum）           
'''    
def GetTheCases(CasesText, province, LocalcasesNum):
    
'''
    整段过程调用如下
    数据处理完之后 pandas 导入excel
'''
 # 获取该页报告的31省市自治区的新增确诊病例
    for i in range(0, 32):
        temp = GetTheCases(NewCases_Text, provinces[i], casesNum)
        TodayNewCases.append(temp)
        #检错机制
        if temp != "":
            casesPro += int(temp)
    dfNewCases.loc[df.iloc[Pagei+1, 1], :] = TodayNewCases
    
    
'''
   新增无症状 ， 港澳台同理 完成
'''
    
```

### 4、每日热点的实现思路

+ 连续6天有疫情 当前三天的均值 < 之前三天内的均值 鉴定为 疫情转折地区（

+ 七天无新增后，出现确诊，鉴定为 突发疫情地区

+ 疫情后，七天无病例，为新增七天无病例热点地区

  

### 5、数据可视化界面的展示

+ 前端可视化使用Echarts + ElementUI
+ 设计思路：如同百度疫情页面一样，能够获取各省折线图，中国疫情地图，各省新增情况的信息。

1、Echarts折线图的legend，可以在一张图上显示各省市自治区的新增情况，为避免杂乱同时仅一张图使用。数据由Vue使用axios请求json数据，向flask获取数据。

![F[MME%FG3D}87JQG3DM46]C.png](https://github.com/achonic/FZU22SEWork/blob/main/112000927/F%5BMME%25FG3D%7D87JQG3DM46%5DC.png?raw=true)

```javascript

Mounted(){
    that = this // axios域内无法调用 $refs  
axios
        .get('http://localhost:5000/LocalNewCases') //数据的接口
        .then(function (response){   //返回的数据
          chart1datax = []
          chart1datay = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
          for(var k = 0;k < 150;k++)
            chart1datax.push(response.data[k].name)  //日期时间x下标

          for (var i = 0;i < 33;i++) {   //各省市自治区
            for (var j = 0; j < 150; j++) {

              chart1datay[i].push(response.data[i * 150 + j].value) //每个省市自治区的疫情数据
  
            }
            console.log(chart1datay[i])
          }
          //将数据扔进初始化代码中
          that.$refs.chart_line_one.initChart(provinces,chart1datax,chart1datay)
        })
        .catch(function (error){
          console.log(error);
        });

}

 <div class="analysisTask">
    <DataCharts ref="chart_China_map"/>
    <DataCharts ref="chart_line_one"/>
</div>

/*      DataCharts.Vue        */
<template>
    <div id="map-china" style="width: 800px; height: 800px"></div>
    <div id="echart-line" style="width: 800px; height: 800px"></div>
</template>
<script>
import echarts from 'echarts'
import "echarts/map/js/china.js"
         methods:{
            initChart(name,xData,yData) 
            initMap(TodayCases)
         }
</script>
```

2、显示当日中国疫情新增地图

![img](https://raw.githubusercontent.com/achonic/FZU22SEWork/main/112000927/%25_2%7DO%5D%40Z%5D)MM%7B)2FOKEMEKA.png)

3、当日各省市新增情况

![UN$I@Y3X1M)_`~B3]AK0`FW.png](https://github.com/achonic/FZU22SEWork/blob/main/112000927/UN$I@Y3X1M)_%60~B3%5DAK0%60FW.png?raw=true)



# 三、心得体会

+ 这两个星期的编程，学到了很多东西。完成之后回头看，感觉有很多东西并不需要花那么久的时间，感觉效率太低了，做得不是很好却花了很多时间。
+ 对前后端分离开发，功能分块开发有了更深刻的理解
+ 学到了很多python工具库的使用