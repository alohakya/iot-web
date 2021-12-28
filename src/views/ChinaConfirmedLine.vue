<template>
  <div class="show-chart-area">
    <div id="ChinaConfirmedLine"></div>
  </div>
</template>

<script>
import mqtt from "mqtt";
export default {
  name:'ChinaConfirmedLine',
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
        if(topic=='no'){
          // window.alert(`${message}`)
          this.$notify.info({
            title: '消息',
            message: `${message}`
          });
        }
        if(topic=='History'){
          var data=`${message}`
          var dataJSON = JSON.parse(data)
          var xData=[];
          var yData=[];
          var xxData=[];
          var yyData=[];
          for(var i=0; i<dataJSON.length; i++){
            if(dataJSON[i].name=='中国'){
              var time=dataJSON[i].time
              var value={
                confirmed_now:dataJSON[i].confirmed_now,
                confirmed:dataJSON[i].confirmed,
                cured:dataJSON[i].cured,
                dead:dataJSON[i].dead,
                type:dataJSON[i].type,
              }
              if(value.type==0){
                xData.push(time)
                yData.push(value.confirmed_now)
              }
              else{
                xxData.push(time)
                yyData.push(value.confirmed_now)
              }
            }
          }
          this.showLineChart(xData,yData,xxData,yyData)
        }
      })
    },
    // 订阅主题
    doSubscribe() {
      // 订阅并请求数据
      this.client.subscribe('no', { qos: 2 }, function (error, granted) {
        if (error) {
          console.log(error)
        } else {
          console.log(`${granted[0].topic} was subscribed`)
        }
      })
      // 订阅History{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.subscribe('History', { qos: 2 }, function (error, granted) {
        if (error) {
          console.log(error)
        } else {
          console.log(`${granted[0].topic} was subscribed`)
        }
      })

      // 订阅后发布请求，提醒服务器发送数据
      this.client.publish('api', '中国', { qos: 1, retain: false }, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api 中国')
        }
      })
    },
    // 加载折线图
    showLineChart(xData,yData,xxData,yyData){
      // console.log('start')
      // console.log(xData)
      // console.log(xxData)
      var xxxData=[]
      var yyyData=[]
      for(let i=0; i<xData.length;i++){
        xxxData.push(xData[i])
      }
      for(let i=0; i<xxData.length; i++){
        xxxData.push(xxData[i])
      }
      for(let i=0; i<yData.length;i++){
        yyyData.push(yData[i])
      }
      for(let i=0; i<yyData.length; i++){
        yyyData.push(yyData[i])
      }
      var chartDom = document.getElementById('ChinaConfirmedLine');
      var myChart = this.$echarts.init(chartDom,null,{
        width: 800,
        height: 700
      });
      var option;
      option = {
        title: {
          text: '全国现有确诊趋势',
          top: 10, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
          bottom:10,
          left: 'center', // 值: 'left', 'center', 'right' 同上
          textStyle: { // 文本样式
            fontSize: 24,
            fontWeight: 600,
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          data: xxxData
        },
        yAxis: {
          type: 'value'
        },
        visualMap: {
          show: false,
          dimension: 0,
          pieces: [
            {
              lte: xData.length-1,
              color: 'red'
            },
            {
              gt: xData.length-1,
              lte: (xData.length),
              color: 'red'
            },
            {
              gt: (xData.length),
              color: 'green'
            }
          ]
        },
        series: [
          {
            name: '现有确诊人数',
            type: 'line',
            data: yyyData,
            smooth:true,
            markArea: {
              itemStyle: {
                color: 'rgba(255, 173, 177, 0.4)'
              },
              data: [
                [
                  {
                    name: '10天预测确诊人数',
                    xAxis: xxData[0]
                  },
                  {
                    xAxis: xxData[xxData.length-1]
                  }
                ],
              ]
            }

          },
        ]
      };
      option && myChart.setOption(option);
    }
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