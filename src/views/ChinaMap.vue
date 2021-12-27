<template>
  <div class="show-chart-area">
    <div id="ChinaMap"></div>
  </div>
</template>

<script>
import mqtt from "mqtt";
import chinaJson from '/src/assets/json/China.json';
export default {
  name: "ChinaMap",
  data(){
    return{
      connection : {
        host:'ha4edd68.cn-shenzhen.emqx.cloud',
        port: 13506, //ws
        endpoint: '/mqtt',
        clean: false, // 保留会话
        connectTimeout: 10000, // 超时时间
        reconnectPeriod: 0, // 重连间隔时间，单位为毫秒，默认为 1000 毫秒，注意：当设置为 0 以后将取消自动重连
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
      all_province:new Map(),
    }
  },
  methods:{
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
        if(topic=='ChinaProvince'){
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
          let province = ['台湾','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省',
            '江西省','山东省','河南省','湖北省','湖南省','广东省','广西壮族自治区','海南省','四川省','贵州省','云南省','西藏自治区',
            '陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区','北京市','天津市','上海市','重庆市','香港','澳门']
          for (var i=0;i < province.length;i++) {
            if (this.all_province.get(province[i])){
              this.china_map_confirmed[i].value=this.all_province.get(province[i]).confirmed_now
            }
          }
          this.showChinaMap()
        }
      })
    },
    // 订阅主题
    doSubscribe() {
      // 订阅并请求数据
      // 订阅中国的ChinaProvince{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.subscribe('ChinaProvince', { qos: 2 }, function (error, granted) {
        if (error) {
          console.log(error)
        } else {
          console.log(`${granted[0].topic} was subscribed`)
        }
      })

      // 订阅后发布请求，提醒服务器发送数据
      // 订阅中国的ChinaProvince{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.publish('api', 'ChinaProvince', { qos: 1, retain: false }, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api ChinaProvince')
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
    this.doSubscribe()
  }
}
</script>

<style scoped>
.show-chart-area{
  margin:0 auto;
}
</style>