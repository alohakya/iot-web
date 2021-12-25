<template>
  <div id="Home">
    <div class="buttons-box">
      <button @click="doSubscribe" class="subscribe-button">订阅中国新增本土趋势</button>
    </div>
    <div class="show-chart-area">
      <div id="increment_line_chart"></div>
    </div>
  </div>
</template>

<script>
import mqtt from 'mqtt'
export default {
  name: 'Home',
  data() {
    return {
      connection: {
        host:'ha4edd68.cn-shenzhen.emqx.cloud',
        port: 13506, //ws
        endpoint: '/mqtt',
        clean: false, // 是否清除会话。当设置为 true 时，断开连接后将清除会话，订阅过的 Topics 也将失效。当设置为 false 时，离线状态下也能收到 QoS 为 1 和 2 的消息
        connectTimeout: 10000, // 连接超时时长，收到 CONNACK 前的等待时间，单位为毫秒，默认 30000 毫秒
        reconnectPeriod: 10000, // 重连间隔时间，单位为毫秒，默认为 1000 毫秒，注意：当设置为 0 以后将取消自动重连
        clientId: 'user1',
        username: 'admin', // 认证用户名，如果 Broker 要求用户名认证的话，请设置该值
        password: 'admin', // 认证密码，如果 Broker 要求密码认证的话，请设置该值
      },
      qosList: [
        { label: 0, value: 0 },
        { label: 1, value: 1 },
        { label: 2, value: 2 },
      ],
      client: {
        connected: false,
      },
      data_list:[
        { name: '台湾', value: 1 },
        { name: '河北', value: 3 },
        { name: '山西', value: 2 },
        { name: '澳门', value: 4 },
      ]
    }
  },
  methods: {
    // 创建连接
    createConnection() {
      const { host, port, endpoint, ...options } = this.connection
      const connectUrl = `ws://${host}:${port}${endpoint}`
      try {
        // 连接到指定的 MQTT Broker 的函数，并始终返回一个 Client 对象
        // Options 对象，用于配置 MQTT 连接时的选项
        this.client = mqtt.connect(connectUrl, options)
      } catch (error) {
        console.log('mqtt.connect error', error)
      }
      // 是否连接成功
      this.client.on('connect', () => {
        console.log('Connection succeeded!')
      })
      // 是否出错
      this.client.on('error', error => {
        console.log('Connection failed', error)
      })

      // 监听消息
      this.client.on('message', (topic, message) =>{
        if(topic=='topic/china_confirmed_line'){
          var data=`${message}`
          var dataJSON = JSON.parse(data)
          let xData=[];
          let yData=[];
          for(let i=0; i<dataJSON.length; i++){
            xData.push(dataJSON[i].name)
            yData.push(dataJSON[i].value)
          }
          // 一收到数据就更新图表
          this.showChart(xData,yData)
        }
        else{
          console.log('it is not topic/china_confirmed_line')
        }
      })
    },
    doSubscribe() {
      // 订阅并请求数据
      // 订阅
      this.client.subscribe('topic/china_confirmed_line', { qos: 2 }, function (error, granted) {
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
        payload: '{ "name": "china" }',
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
    showChart(xData,yData){
      // 展示新增确诊折线图
      var chartDom = document.getElementById('increment_line_chart');
      var myChart = this.$echarts.init(chartDom,null, {
        width: 600,
        height: 400
      });
      var option;
      option = {
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yData,
            type: 'line',
            smooth: true
          }
        ]
      };
      option && myChart.setOption(option);
    }
  },
  mounted() {
    this.createConnection()
    // 页面加载时即显示地图，可选项
    // this.showChart()
  }
}
</script>
<style>
#increment_line_chart{

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
.show-chart-area{
  margin:0 auto;
}
</style>
