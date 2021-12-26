<template>
  <div id="ChinaMap"></div>
</template>

<script>
import chinaJson from '/src/assets/json/China.json';
export default {
  name: "ChinaMap",
  props:{
    child_data:[],
  },
  data(){
    return{
      data:[
        { name: '台湾', value: 10 },
        { name: '河北', value: 20 },
        { name: '山西', value: 30 },
        { name: '内蒙古', value: 40 },
        { name: '辽宁', value: 50 },
        { name: '吉林', value: 60 },
        { name: '黑龙江', value: 70 },
        { name: '江苏', value: 80 },
        { name: '浙江', value: 90 },
        { name: '安徽', value: 100 },
        { name: '福建', value: 110 },
        { name: '江西', value: 120 },
        { name: '山东', value: 130 },
        { name: '河南', value: 140 },
        { name: '湖北', value: 150 },
        { name: '湖南', value: 160 },
        { name: '广东', value: 170 },
        { name: '广西', value: 180 },
        { name: '海南', value: 190 },
        { name: '四川', value: 200 },
        { name: '贵州', value: 210 },
        { name: '云南', value: 220 },
        { name: '西藏', value: 230 },
        { name: '陕西', value: 240 },
        { name: '甘肃', value: 250 },
        { name: '青海', value: 260 },
        { name: '宁夏', value: 270 },
        { name: '新疆', value: 280 },
        { name: '北京', value: 290 },
        { name: '天津', value: 300 },
        { name: '上海', value: 310 },
        { name: '重庆', value: 320 },
        { name: '香港', value: 330 },
        { name: '澳门', value: 340 },
      ],
    }
  },
  mounted() {
    var jsonObj=JSON.parse(this.child_data)
    var chartDom = document.getElementById('ChinaMap');
    var myChart = this.$echarts.init(chartDom);
    var option;

    myChart.showLoading();

    myChart.hideLoading();
    this.$echarts.registerMap('China', chinaJson, {});
    option = {
      title: {
        text: '中国疫情分布 (2021-12-24)',
        subtext: '数据来源：丁香园网站',
        sublink: 'https://portal.dxy.cn',
        left: 'right'
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: function (params) {
          const value = (params.value + '').split('.');
          const valueStr = value[0].replace(
              /(\d{1,3})(?=(?:\d{3})+(?!\d))/g,
              '$1,'
          );
          return params.seriesName + '<br/>' + params.name + ': ' + valueStr;
        }
      },
      visualMap: {
        left: 'right',
        min: 1,
        max: 340,
        inRange: {
          color: [
            // '#313695',
            // '#4575b4',
            // '#74add1',
            // '#abd9e9',
            // '#e0f3f8',
              'rgb(255,255,255)',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026'
          ]
        },
        text: ['High', 'Low'],
        calculable: true
      },
      toolbox: {
        show: true,
        //orient: 'vertical',
        left: 'left',
        top: 'top',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '中国疫情分布情况',
          type: 'map',
          // roam: true,
          map: 'China',
          label: {
            show: true,
            fontSize:10,
          },
          // emphasis: {
          //   label: {
          //     show: true
          //   }
          // },
          data:[
              { name: '台湾', value: jsonObj[0].value },
              { name: '河北', value: jsonObj[1].value },
              { name: '山西', value: 30 },
              { name: '内蒙古', value: 40 },
              { name: '辽宁', value: 50 },
              { name: '吉林', value: 60 },
              { name: '黑龙江', value: 70 },
              { name: '江苏', value: 80 },
              { name: '浙江', value: 90 },
              { name: '安徽', value: 100 },
              { name: '福建', value: 110 },
              { name: '江西', value: 120 },
              { name: '山东', value: 130 },
              { name: '河南', value: 140 },
              { name: '湖北', value: 150 },
              { name: '湖南', value: 160 },
              { name: '广东', value: 170 },
              { name: '广西', value: 180 },
              { name: '海南', value: 190 },
              { name: '四川', value: 200 },
              { name: '贵州', value: 210 },
              { name: '云南', value: 220 },
              { name: '西藏', value: 230 },
              { name: '陕西', value: 240 },
              { name: '甘肃', value: 250 },
              { name: '青海', value: 260 },
              { name: '宁夏', value: 270 },
              { name: '新疆', value: 280 },
              { name: '北京', value: 290 },
              { name: '天津', value: 300 },
              { name: '上海', value: 310 },
              { name: '重庆', value: 320 },
              { name: '香港', value: 330 },
              { name: '澳门', value: 340 },
          ]
        }
      ]
    };
    myChart.setOption(option);
  }
}
</script>

<style scoped>
body{
  width: 90%;
  height: 650px;
}
#ChinaMap{
  width: 95%;
  height: 750px;
}
</style>