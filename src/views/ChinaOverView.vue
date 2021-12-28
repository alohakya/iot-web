<template>
  <div class="show-chart-area">
    <h1>国内疫情</h1>
    <div class="china">
      <el-row>
        <el-col :span="5">
          <div class="box">
            <h1>现有确诊</h1>
            <div class="test" id="confirmed_now"></div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="box">
            <h1>累计确诊</h1>
            <div class="test" id="confirmed"></div>
          </div>
        </el-col>

        <el-col :span="5">
          <div class="box">
            <h1>累计治愈</h1>
            <div class="test" id="cured"></div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="box">
            <h1>累计死亡</h1>
            <div class="test" id="dead"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <h1>国内各地区疫情统计汇总</h1>
    <div>
      <div class="text">
        <div class="country" v-for="item in province_list">
          <a @click="to(item.name)">{{item.name}}</a>
        </div>
      </div>
    </div>
    <div class="china">
      <el-row>
        <el-col :span="5">
          <div class="box">
            <h2>地区</h2>
            <div class="test" id="name1"></div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="box">
            <h2>现有确诊</h2>
            <div class="test" id="confirmed_now1"></div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="box">
            <h2>累计确诊</h2>
            <div class="test" id="confirmed1"></div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="box">
            <h2>累计治愈</h2>
            <div class="test" id="cured1"></div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="box">
            <h2>累计死亡</h2>
            <div class="test" id="dead1"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div id="test-box"></div>
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
      all_province:new Map(),
      province_list:[
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
        if(topic=='ChinaProvince'){
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
        if(topic=='allCountry'){
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
            this.all_province.set(name,value)
            // console.log(this.all_province.keys())
          }
          document.getElementById('name1').innerHTML=
              `<h1 style="color: tomato" v-for="item in 4">{item}</h1>`;
          document.getElementById('confirmed_now1').innerHTML=
              `<h1 style="color: tomato" v-for="item in 4">1</h1>`;
          document.getElementById('confirmed1').innerHTML=
              `<h1 style="color: tomato">1</h1>`;
          document.getElementById('cured1').innerHTML=
              `<h1 style="color: tomato">1</h1>`;
          document.getElementById('dead1').innerHTML=
              `<h1 style="color: tomato">1</h1>`;
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
      // 订阅中国的ChinaProvince{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.subscribe('ChinaProvince', { qos: 1 }, function (error, granted) {
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

      // 订阅后发布请求，提醒服务器发送数据
      // 订阅中国的ChinaProvince{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.publish('api', 'ChinaProvince', { qos: 1, retain: false }, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api : ChinaProvince')
        }
      })
      // 请求allCountry,订阅所有国家的allCountry{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.publish('api', 'allCountry', { qos: 1, retain: false }, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api : allCountry')
        }
      })

    },
    to(name){
      this.$router.push({
        path:`/Country/${name}`
      })
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
  padding: 0 0 0 100px;
}
.china{
  padding-left: 60px;
}
.text{
  height: 650px;
  overflow: auto;
  border: 1px solid blanchedalmond;
  padding-top: 30px;
  padding-left: 50px;
}
.country{
  width: 150px;
  height: 50px;
  float: left;
  font-size: 25px;
}
a{
  color: black;
  cursor: pointer;
}
a:hover{
  color: lightskyblue;
  cursor: pointer;
}
</style>