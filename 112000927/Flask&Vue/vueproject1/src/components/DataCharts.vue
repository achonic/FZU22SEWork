<template>

    <div id="map-china" style="width: 800px; height: 800px"></div>
    <div id="echart-line" style="width: 800px; height: 800px"></div>
</template>


<script>
import echarts from 'echarts'
import "echarts/map/js/china.js"
export default {
  name: "DataCharts",
  methods:{
    initChart(name,xData,yData) {
      let getchart = echarts.init(document.getElementById('echart-line'));
      var  option = {
        title:{
          text:'国内本土新增趋势',
          left:'auto'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [name],
          bottom:'up',
          left:'right'
        },
        grid: { //调整图表上下左右位置
          top:'10%',
          left: '3%',
          right: '8%',
          bottom: '11%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: name,
            type: 'line',
            stack: '总量',
            data: yData
          },
        ]
      };

      getchart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        getchart.resize();
      });
    },
    initMap(TodayCases) {
      // 初始化echarts实例
      this.chinachart = echarts.init(document.getElementById("map-china"));
      // 进行相关配置
      this.chartOption = {
        title:{
          text:'国内本土新增疫情地图',
          left:'auto'
        },
        // geo配置详解： https://echarts.baidu.com/option.html#geo
        geo: {
          // 地理坐标系组件用于地图的绘制
          map: "china", // 表示中国地图
          // roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: 1.2, // 当前视角的缩放比例（地图的放大比例）
          label: {
            show: true,
          },
          itemStyle: {
            // 地图区域的多边形 图形样式。
            borderColor: "rgba(0, 0, 0, 0.2)",
            emphasis: {
              // 高亮状态下的多边形和标签样式
              shadowBlur: 20,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
        series: [
          {
            name: "各区域人数", // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
            type: "map",
            geoIndex: 0,
            label: {
              show: true,
            },
            // 这是需要配置地图上的某个地区的数据（下面是定义的假数据）
            data: TodayCases
          },
        ],
        tooltip: {
          // 鼠标移到图里面的浮动提示框
          // formatter详细配置： https://echarts.baidu.com/option.html#tooltip.formatter
          formatter(params) {
            // params.data 就是series配置项中的data数据遍历
            let localValue;
            if (params.data) {
              localValue = params.data.value;
            } else {
              // 为了防止没有定义数据的时候报错写的
              localValue = 0;
            }
            let htmlStr = `
             <div style='font-size:18px;'> ${params.name}</div>
             <br>
             <p style='text-align:left;margin-top:-10px;'>
               确诊：${localValue}例<br/>
             </p>
           `;
            return htmlStr;
          },
          backgroundColor:"#ff7f50",//提示标签背景颜色
          textStyle:{color:"#fff"} //提示标签字体颜色
        },
        // visualMap的详细配置解析：https://echarts.baidu.com/option.html#visualMap
        visualMap: {
          // 左下角的颜色区域
          type: "piecewise", // 定义为分段型 visualMap
          min: 0,
          max: 1000,
          itemWidth: 40,
          bottom: 10,
          left: 10,
          pieces: [
            // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，
            // 以及每一段的文字，以及每一段的特别的样式
            { gt: 999, label: ">1000人", color: "#82121b" }, // (1000, ]
            { gt: 100, lte: 999, label: "100-999人", color: "#bb2222" }, // (100, 999]
            { gt: 10, lte: 99, label: "10-99人", color: "#fe7b6c" }, // (10, 99]
            { gt: 0, lte: 9, label: "1-9人", color: "#ffaa85" }, // (0, 9]
          ],
        },
      };
      // 使用刚指定的配置项和数据显示地图数据
      this.chinachart.setOption(this.chartOption);
    }
  }
}
</script>
<style>

</style>
