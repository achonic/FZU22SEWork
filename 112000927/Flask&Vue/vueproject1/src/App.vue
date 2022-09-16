<template>

  <HelloWorld msg="本土疫情实时大数据报告"/>
  <div class="analysisTask">
    <DataCharts ref="chart_China_map"/>
    <DataCharts ref="chart_line_one"/>
  </div>
  <div class="provincetable">
    <h2>各省市本日新增疫情状况</h2>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="province" label="地区" width="300">

    </el-table-column>
    <el-table-column prop="newLocal" label="新增本土" width="300" />
    <el-table-column prop="newAsyLocal" label="新增无症状" />
  </el-table>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import DataCharts from "@/components/DataCharts";
import axios from 'axios'

export default {
  name: 'App',
  components: {
    HelloWorld,
    DataCharts
  },

  setup(){

  },

  mounted: function () {

    // 当日本土疫情数据获取
    let that = this
    let TodaysCases = []

    let chart1datax = []
    let chart1datay = []


    axios
        .get('http://localhost:5000/getjson')
        .then(function (response){
          TodaysCases = response.data
          that.$refs.chart_China_map.initMap(TodaysCases)
        })
        .catch(function (error){
          console.log(error);
        });
    this.$refs.chart_China_map.initMap(TodaysCases)
    axios
        .get('http://localhost:5000/LocalNewCases')
        .then(function (response){
          chart1datax = []
          chart1datay = []
          for (var i = 0;i < response.data.length;i++){
            chart1datax.push(response.data[i].name)
            chart1datay.push(response.data[i].value)
          }
          that.$refs.chart_line_one.initChart("本土新增趋势",chart1datax,chart1datay)
        })
        .catch(function (error){
          console.log(error);
        });
    this.$refs.chart_line_one.initChart("本土新增趋势",chart1datax,chart1datay)

    axios
        .get('http://localhost:5000/provinceList')
        .then(function (response){
          that.tableData = []
          that.tableData = response.data
          console.log(that.tableData)
        })
        .catch(function (error){
          console.log(error);
        });
    this.$refs.chart_line_one.initChart("本土新增趋势",chart1datax,chart1datay)

  //  this.$refs.chart_line_one.initChart(name,xData,yData)
  },
  data(){
      return{
        tableData : []
      }
  },
}
</script>

<style>
#building{
  background:url("./assets/background.jpeg");
  width:100%;
  height:100vh;
  position:absolute;
  background-size:100% 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.provincetable{
  border: 3px solid ;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 400%;
  transform: translate(-50%,-50%);

}
.analysisTask{
  border: 3px solid ;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 280%;
  transform: translate(-50%,-50%);
}
body{
  margin:0;
  padding:0;
  border:0;
}

</style>
