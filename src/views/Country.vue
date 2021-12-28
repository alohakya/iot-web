<template>
<div id="Country">
  <div class="show-chart-area">
    <h1 style="margin-bottom: 0px">{{this.$route.params.name}}疫情</h1>
    <div class="china">
      <el-row>
        <el-col :span="5">
          <div class="box">
            <h1>现有确诊</h1>
            <div class="test" id="confirmed_now3"></div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="box">
            <h1>累计确诊</h1>
            <div class="test" id="confirmed3"></div>
          </div>
        </el-col>

        <el-col :span="5">
          <div class="box">
            <h1>累计治愈</h1>
            <div class="test" id="cured3"></div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="box">
            <h1>累计死亡</h1>
            <div class="test" id="dead3"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <div id="myCountry" style="padding-left: 100px"></div>
</div>
</template>

<script>
import mqtt from "mqtt";
export default {
  name: "Country",
  data(){
    return{
      name:this.$route.params.name,
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
      all_province:new Map(),
      all_country_map:new Map(),
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
        console.log(topic)
        if(topic=='no'){
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
            if(dataJSON[i].name==this.$route.params.name){
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
        if(topic=='allCountry'){
          var data=`${message}`
          var dataJSON = JSON.parse(data)
          console.log('topic == allCountry')
          for(var i=0; i<dataJSON.length; i++){
            var name=dataJSON[i].name
            var value={
              confirmed_now:dataJSON[i].confirmed_now,
              confirmed:dataJSON[i].confirmed,
              cured:dataJSON[i].cured,
              dead:dataJSON[i].dead,
            }
            this.all_country_map.set(name,value)
          }
          document.getElementById('confirmed_now3').innerHTML=
              `<h1 style="color: tomato">${this.all_country_map.get(this.$route.params.name).confirmed_now}</h1>`;
          document.getElementById('confirmed3').innerHTML=
              `<h1 style="color: tomato">${this.all_country_map.get(this.$route.params.name).confirmed}</h1>`;
          document.getElementById('cured3').innerHTML=
              `<h1 style="color: tomato">${this.all_country_map.get(this.$route.params.name).cured}</h1>`;
          document.getElementById('dead3').innerHTML=
              `<h1 style="color: tomato">${this.all_country_map.get(this.$route.params.name).dead}</h1>`;
        }

        if(topic=='ChinaProvince'){
          var data=`${message}`
          // console.log(data)
          var dataJSON = JSON.parse(data)
          console.log('I got')
          // console.log(dataJSON)
          for(var i=0; i<dataJSON.length; i++){
            var name=dataJSON[i].name // 带省份
            var value={
              confirmed_now:dataJSON[i].confirmed_now,
              confirmed:dataJSON[i].confirmed,
              cured:dataJSON[i].cured,
              dead:dataJSON[i].dead,
            }
            this.all_province.set(name,value)
          }
          let province = ['台湾','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省',
            '江西省','山东省','河南省','湖北省','湖南省','广东省','广西壮族自治区','海南省','四川省','贵州省','云南省','西藏自治区',
            '陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区','北京市','天津市','上海市','重庆市','香港','澳门']
          var provincename = "";
          for (var i=0;i<province.length;i++){
            if (province[i].search(this.$route.params.name)!==-1) {
              provincename = province[i];
              console.log(provincename)
              break;
            }
          }
          // this.all_province
          if (provincename!==""){
            document.getElementById('confirmed_now3').innerHTML=
                `<h1 style="color: tomato">${this.all_province.get(provincename).confirmed_now}</h1>`;
            document.getElementById('confirmed3').innerHTML=
                `<h1 style="color: tomato">${this.all_province.get(provincename).confirmed}</h1>`;
            document.getElementById('cured3').innerHTML=
                `<h1 style="color: tomato">${this.all_province.get(provincename).cured}</h1>`;
            document.getElementById('dead3').innerHTML=
                `<h1 style="color: tomato">${this.all_province.get(provincename).dead}</h1>`;
          }
        }
      })
    },
    // 订阅主题
    doSubscribe() {
      // 订阅并请求数据
      this.client.subscribe('no', { qos: 2 }, (error, granted)=> {
        if (error) {
          console.log(error)
        } else {
          console.log(`${granted[0].topic} was subscribed`)
        }
      })
      // 订阅History{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.subscribe('History', { qos: 2 }, (error, granted)=> {
        if (error) {
          console.log(error)
        } else {
          console.log(`${granted[0].topic} was subscribed`)
        }
      })
      // 订阅所有国家的allCountry{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.subscribe('allCountry', { qos: 1 }, function (error, granted) {
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
      // 请求所有ChinaProvince,订阅ChinaProvince{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.publish('api', 'ChinaProvince', { qos: 1, retain: false },  (error)=> {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api : ChinaProvince')
        }
      })
      //请求某个国家
      this.client.publish('api', this.$route.params.name, { qos: 1, retain: false }, (error)=> {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api : ' + this.$route.params.name)
        }
      })
      // 请求allCountry,订阅所有国家的allCountry{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.publish('api', 'allCountry', { qos: 1, retain: false },  (error)=> {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api : allCountry')
        }
      })
    },
    // 加载折线图
    showLineChart(xData,yData,xxData,yyData){
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
      var chartDom = document.getElementById('myCountry');
      var myChart = this.$echarts.init(chartDom,null,{
        width: 800,
        height: 600
      });
      var option;
      option = {
        title: {
          text: this.$route.params.name + '现有确诊趋势',
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
#Country{
  /*background-color: pink;*/
  height: 690px;
  overflow: auto;
  padding-left: 100px;
}
</style>