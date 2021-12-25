<template>
  <div id="Subscriber">
    <div class="buttons-box">
      <button @click="doSubscribe" class="subscribe-button">订阅中国疫情地图</button>
    </div>
    <div class="show-chart-area">
      <div id="ChinaMap"></div>
    </div>
  </div>
</template>

<script>
import mqtt from "mqtt";
import chinaJson from '/src/assets/json/China.json';
export default {
  name: "Subscriber",
  data() {
    return {
      connection: {
        host:'ha4edd68.cn-shenzhen.emqx.cloud',
        port: 13506, //ws
        endpoint: '/mqtt',
        clean: false, // 保留会话
        connectTimeout: 10000, // 超时时间
        reconnectPeriod: 10000, // 重连时间间隔
        clientId: 'subscriber',
        username: 'admin',
        password: 'admin',
      },
      client: {
        connected: false,
      },
      china_map_confirmed:[
        { name: '台湾', value: 0 },
        { name: '河北', value: 0 },
        { name: '山西', value: 0 },
        { name: '内蒙古', value: 0 },
        { name: '辽宁', value: 0 },
        { name: '吉林', value: 0 },
        { name: '黑龙江', value: 0 },
        { name: '江苏', value: 0 },
        { name: '浙江', value: 0 },
        { name: '安徽', value: 0 },
        { name: '福建', value: 0 },
        { name: '江西', value: 0 },
        { name: '山东', value: 0 },
        { name: '河南', value: 0 },
        { name: '湖北', value: 0 },
        { name: '湖南', value: 0 },
        { name: '广东', value: 0 },
        { name: '广西', value: 0 },
        { name: '海南', value: 0 },
        { name: '四川', value: 0 },
        { name: '贵州', value: 0 },
        { name: '云南', value: 0 },
        { name: '西藏', value: 0 },
        { name: '陕西', value: 0 },
        { name: '甘肃', value: 0 },
        { name: '青海', value: 0 },
        { name: '宁夏', value: 0 },
        { name: '新疆', value: 0 },
        { name: '北京', value: 0 },
        { name: '天津', value: 0 },
        { name: '上海', value: 0 },
        { name: '重庆', value: 0 },
        { name: '香港', value: 0 },
        { name: '澳门', value: 0 },
      ]
    }
  },
  methods: {
    // 创建连接
    createConnection() {
      const { host, port, endpoint, ...options } = this.connection
      const connectUrl = `ws://${host}:${port}${endpoint}`
      try {
        this.client = mqtt.connect(connectUrl, options)
      } catch (error) {
        console.log('mqtt.connect error', error)
      }
      this.client.on('connect', () => {
        console.log('Connection succeeded!')
      })
      this.client.on('error', error => {
        console.log('Connection failed', error)
      })
      // 接收message
      this.client.on('message', (topic, message) => {
        if(topic=='topic/china_info'){
          var data=`${message}`
          var dataJSON = JSON.parse(data)
          for(var i=0; i<dataJSON.length; i++){
            this.china_map_confirmed[i].value=dataJSON[i].value
          }
          this.showChinaMap()
        }
        else{
          console.log('it is not topic/china_info')
        }
      })
    },
    // 订阅主题
    doSubscribe() {
      // 订阅并请求数据
      // 订阅
      this.client.subscribe('topic/china_info', { qos: 2 }, function (error, granted) {
        if (error) {
          console.log(error)
        } else {
          console.log(`${granted[0].topic} was subscribed`)
        }
      })

      // 订阅后发布请求，提醒服务器发送数据
      var publish= {
        topic: 'api',
        qos: 1,
        payload: '{ "map_name": "china" }',
      }
      const { topic, qos, payload } = publish
      this.client.publish(topic, payload, qos, error => {
        if (error) {
          console.log('Publish error', error)
        }
        else {
          console.log('Publish succeeded!')
        }
      })
    },
    // 加载中国地图
    showChinaMap(){
      var chartDom = document.getElementById('ChinaMap');
      var myChart = this.$echarts.init(chartDom,null, {
        width: 980,
        height: 700
      });
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
            data:[
              { name: '台湾', value: this.china_map_confirmed[0].value },
              { name: '河北', value: this.china_map_confirmed[1].value },
              { name: '山西', value: this.china_map_confirmed[2].value },
              { name: '内蒙古', value: this.china_map_confirmed[3].value },
              { name: '辽宁', value: this.china_map_confirmed[4].value },
              { name: '吉林', value: this.china_map_confirmed[5].value },
              { name: '黑龙江', value: this.china_map_confirmed[6].value },
              { name: '江苏', value: this.china_map_confirmed[7].value },
              { name: '浙江', value: this.china_map_confirmed[8].value },
              { name: '安徽', value: this.china_map_confirmed[9].value },
              { name: '福建', value: this.china_map_confirmed[10].value },
              { name: '江西', value: this.china_map_confirmed[11].value },
              { name: '山东', value: this.china_map_confirmed[12].value },
              { name: '河南', value: this.china_map_confirmed[13].value },
              { name: '湖北', value: this.china_map_confirmed[14].value },
              { name: '湖南', value: this.china_map_confirmed[15].value },
              { name: '广东', value: this.china_map_confirmed[16].value },
              { name: '广西', value: this.china_map_confirmed[17].value },
              { name: '海南', value: this.china_map_confirmed[18].value },
              { name: '四川', value: this.china_map_confirmed[19].value },
              { name: '贵州', value: this.china_map_confirmed[20].value },
              { name: '云南', value: this.china_map_confirmed[21].value },
              { name: '西藏', value: this.china_map_confirmed[22].value },
              { name: '陕西', value: this.china_map_confirmed[23].value },
              { name: '甘肃', value: this.china_map_confirmed[24].value },
              { name: '青海', value: this.china_map_confirmed[25].value },
              { name: '宁夏', value: this.china_map_confirmed[26].value },
              { name: '新疆', value: this.china_map_confirmed[27].value },
              { name: '北京', value: this.china_map_confirmed[28].value },
              { name: '天津', value: this.china_map_confirmed[29].value },
              { name: '上海', value: this.china_map_confirmed[30].value },
              { name: '重庆', value: this.china_map_confirmed[31].value },
              { name: '香港', value: this.china_map_confirmed[32].value },
              { name: '澳门', value: this.china_map_confirmed[33].value },
            ]
          }
        ]
      };
      myChart.setOption(option);
    },
  },
  mounted() {
    this.createConnection()
    // 页面加载时即显示地图，可选项
    // this.showChinaMap()
  }
}
</script>

<style scoped>
#Subscriber{
  width: 100%;

}
.subscribe-button{
  /*width: 20px;*/
  height: 40px;
  font-size: 20px;
  background-color: papayawhip;
  border: none;
  border-radius: 5px;
  margin:10px;
}
#ChinaMap{
  /*width: 1000px;*/
  /*height: 750px;*/
  /*margin: 0 auto;*/
  padding-left: 100px;
}
.show-chart-area{
  margin:0 auto;
}
</style>