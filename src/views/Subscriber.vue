<template>
  <div id="Subscriber">
    <div class="buttons-box">
      <button @click="doSubscribe" class="subscribe-button">订阅中国疫情地图</button>
    </div>


    <el-row>
      <el-col span="6">
        <div class="box">
          <h1>现有确诊</h1>
          <div class="test" id="confirmed_now"></div>
        </div>
      </el-col>
      <el-col span="6">
        <div class="box">
          <h1>累计确诊</h1>
          <div class="test" id="confirmed"></div>
        </div>
      </el-col>

      <el-col span="6">
        <div class="box">
          <h1>累计治愈</h1>
          <div class="test" id="cured"></div>
        </div>
      </el-col>
      <el-col span="6">
        <div class="box">
          <h1>累计死亡</h1>
          <div class="test" id="dead"></div>
        </div>
      </el-col>
    </el-row>


    <div class="show-chart-area">
      <div id="ChinaMap"></div>
    </div>
  </div>
</template>

<script>
import mqtt from "mqtt";
import chinaJson from '/src/assets/json/China.json';
import worldjs from '/src/assets/js/world.js';
export default {
  name: "Subscriber",
  data() {
    return {
      timer:null, //定时器名称
      connection : {
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
      client:{
        connected: false,
      },
      subscribeSuccess:false,
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
      ],
      all_country_map:new Map(),
      all_province:new Map(),
    }
  },
  methods: {
    createConnection(){
      // 创建连接
      const { host, port, endpoint, ...options }=this.connection
      const connectUrl = `ws://${host}:${port}${endpoint}`
      try {
        // 连接
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
        switch (topic){
          case "allCountry":
            var data=`${message}`
            var dataJSON = JSON.parse(data)
            for(var i=0; i<dataJSON.length; i++){
              if(this.all_country_map.has(dataJSON[i].name)){
                console.log('has')
                this.all_country_map.get(dataJSON[i].name).confirmed_now=dataJSON[i].confirmed_now
                this.all_country_map.get(dataJSON[i].name).confirmed=dataJSON[i].confirmed
                this.all_country_map.get(dataJSON[i].name).cured=dataJSON[i].cured
                this.all_country_map.get(dataJSON[i].name).dead=dataJSON[i].dead
              }
              else{
                // console.log('no')
                var name=dataJSON[i].name
                var value={
                  confirmed_now:dataJSON[i].confirmed_now,
                  confirmed:dataJSON[i].confirmed,
                  cured:dataJSON[i].cured,
                  dead:dataJSON[i].dead,
                }
                // console.log(value)
                this.all_country_map.set(name,value)
                console.log(this.all_country_map.get(name).confirmed)
              }
            }
            document.getElementById('confirmed_now').innerHTML=
                `<h1 style="color: tomato">${this.all_country_map.get('中国').confirmed_now}</h1>`;
            document.getElementById('confirmed').innerHTML=
                `<h1 style="color: tomato">${this.all_country_map.get('中国').confirmed}</h1>`;
            document.getElementById('cured').innerHTML=
                `<h1 style="color: tomato">${this.all_country_map.get('中国').cured}</h1>`;
            document.getElementById('dead').innerHTML=
                `<h1 style="color: tomato">${this.all_country_map.get('中国').dead}</h1>`;
            break;
          case "ChinaProvince":
            var data=`${message}`
            var dataJSON = JSON.parse(data)
            for(var i=0; i<dataJSON.length; i++){
              var name=dataJSON[i].name
              var value={
                confirmed_now:dataJSON[i].confirmed_now,
                confirmed:dataJSON[i].confirmed,
                cured:dataJSON[i].cured,
                dead:dataJSON[i].dead,
              }
              console.log(value)
              console.log('end')
              this.all_province.set(name,value)
              console.log(this.all_province.get(name).confirmed)
              console.log(this.china_map_confirmed[0].value)
            }
            this.china_map_confirmed[0].value=this.all_province.get('台湾').confirmed_now
            this.china_map_confirmed[1].value=this.all_province.get('河北省').confirmed_now
            this.showChinaMap()
            break;
        }
      })
    },
    // 订阅主题
    doSubscribe() {
      // 订阅并请求数据

      // 订阅所有国家的allCountry{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.subscribe('allCountry', { qos: 2 }, function (error, granted) {
        if (error) {
          console.log(error)
        } else {
          console.log(`${granted[0].topic} was subscribed`)
        }
      })

      // 订阅中国的ChinaProvince{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.subscribe('ChinaProvince', { qos: 2 }, function (error, granted) {
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
        payload: 'allCountry',
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
    // 展示数据
    showData(){
      var myDom = document.getElementById('test');

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
    showChinaOverview(){
      var myDom=document.getElementById('china_overview')

    },
  },
  mounted() {
    this.createConnection()
    this.doSubscribe()
  },
  destroyed() {
    clearInterval(this.timer)
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
  padding-left: 100px;
}
.show-chart-area{
  margin:0 auto;
}
</style>