<template>

</template>

<script>
import mqtt from "mqtt";

export default {
  data(){return{
    province:new Map(),
  }
  },
  name: "ProvinceIncrease",
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
        if(topic=='History'){
          var data=`${message}`
          var dataJSON = JSON.parse(data)
          dataJSON.sortBy(name);
          // for(var i=0; i<dataJSON.length; i++){
          //   var name=dataJSON[i].name
          //   var value={
          //     confirmed:dataJSON[i].confirmed,
          //     cured:dataJSON[i].cured,
          //     dead:dataJSON[i].dead,
          //     type:dataJSON[i].type,
          //   }
          //   console.log(value)
          //   console.log('end')
          //   this.province.set(name,value)
          //   console.log(this.province.get(name).confirmed)
          // }
          // let province = ['台湾','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省',
          //   '江西省','山东省','河南省','湖北省','湖南省','广东省','广西壮族自治区','海南省','四川省','贵州省','云南省','西藏自治区',
          //   '陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区','北京市','天津市','上海市','重庆市','香港','澳门']
          // for (var i=0;i < province.length;i++) {
          //   if (this.all_province.get(province[i])){
          //     this.china_map_confirmed[i].value=this.all_province.get(province[i]).confirmed_now
          //   }
          // }
          this.showehart(dataJSON)
        }
      })
    },
  }

}
</script>

<style scoped>

</style>