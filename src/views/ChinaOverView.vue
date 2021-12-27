<template>
  <div class="show-chart-area">
    <el-row>
      <el-col :span="6">
        <div class="box">
          <h1>现有确诊</h1>
          <div class="test" id="confirmed_now"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <h1>累计确诊</h1>
          <div class="test" id="confirmed"></div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="box">
          <h1>累计治愈</h1>
          <div class="test" id="cured"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <h1>累计死亡</h1>
          <div class="test" id="dead"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import mqtt from "mqtt";
export default {
  name: "ChinaOverView",
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
        if(topic=='allCountry'){
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

      // 订阅后发布请求，提醒服务器发送数据
      // 请求allCountry,订阅所有国家的allCountry{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.publish('api', 'allCountry', { qos: 1, retain: false }, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api : allCountry')
        }
      })

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