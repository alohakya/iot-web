<template>
  <div id="Subscriber">
    <div class="buttons-box">
      <button @click="doSubscribe" class="subscribe-button">订阅中国疫情地图</button>
    </div>
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


    <div class="show-chart-area">
      <div id="ChinaMap"></div>
      <div id="ChinaLine"></div>
      <div class='chart' id='chart'></div>
    </div>

  </div>
</template>

<script>
import mqtt from "mqtt";
import chinaJson from '/src/assets/json/China.json';
import '/src/assets/js/world'
import world_data from '/src/api/world.json'
export default {
  name: "Subscriber",
  data() {
    return {
      // timer:null, //定时器名称
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
      all_country_map:new Map(),
      all_province:new Map(),
    }
  },
  methods: {
    getWorld (data) {

    },
    drawChart (name, data){
      // 基于准备好的dom，初始化echarts实例
      let chart = this.$echarts.init(document.getElementById('chart'))
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function () {
        chart.resize()
      })
      // 绘制图表
      chart.setOption({
      // 图表主标题
      // title: {
      //   text: '世界地图', // 主标题文本，支持使用 \n 换行
      //   top: 10, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
      //   left: 'center', // 值: 'left', 'center', 'right' 同上
      //   textStyle: { // 文本样式
      //     fontSize: 24,
      //     fontWeight: 600,
      //     color: '#000'
      //   }
      // },
        //geo用于显示地图坐标
        // geo: {
        //   map: "china", //导入的china.js，该文件中注册的china地图。
        //   zoom: 1.2, //默认显示的缩放倍数
        //   roam: true, //是否开启鼠标的缩放
        //   scaleLimit: { //控制鼠标缩放的最小倍数，最大倍数
        //     min: 1,
        //     max: 1
        //   },
        grid: {
          width:'100%',
          height:'100%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        // 提示框组件
        tooltip: {
          trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
          // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
          // 使用函数模板  传入的数据值 -> value: number | Array
          formatter: function (val) {
            if(val.data == null) return ;
            return val.data.name + ': ' + val.data.value
          }
        },
        // 视觉映射组件
        visualMap: {
          min: 0,
          max: 10000,
          text:['max','min'],
          realtime: false,
          calculable: true,
          color: ['rgba(255,0,0,1)','rgba(255,255,255,1)'],
        },
        series:[
          {
            type: 'map', // 类型
            // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
            name: '世界地图',
            mapType: 'world', // 地图类型
            // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
            roam: true,
            // 图形上的文本标签
            label: {
              show: false // 是否显示对应地名
            },
            zoom: 1.2,
            // 地图区域的多边形 图形样式
            itemStyle: {
              // areaColor: '#7B68EE', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
              borderWidth: 0.5, // 描边线宽 为 0 时无描边
              borderColor: '#000', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
              borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
            },
            // 高亮状态下的多边形和标签样式
            emphasis: {
              label: {
                show: true, // 是否显示标签
                color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
              },
              itemStyle: {
                areaColor: '#FF6347' // 地图区域的颜色
              }
            },
            // 自定义地区的名称映射
            nameMap: name,
            // 地图系列中的数据内容数组 数组项可以为单个数值
            data: data
          }
        ]
      })
    },
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
            let province = ['台湾','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省',
              '江西省','山东省','河南省','湖北省','湖南省','广东省','广西壮族自治区','海南省','四川省','贵州省','云南省','西藏自治区',
              '陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区','北京市','天津市','上海市','重庆市','香港','澳门']
            for (var i=0;i < province.length;i++) {
              if (this.all_province.get(province[i])){
                this.china_map_confirmed[i].value=this.all_province.get(province[i]).confirmed_now
              }
            }
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
      // 订阅中国的(List<>Date,现有确诊、累计、治愈、死亡，类型)
      this.client.subscribe('CountryHistory', { qos: 2 }, function (error, granted) {
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
          console.log('Published')
        }
      })
      // 订阅中国的ChinaProvince{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.publish('api', 'ChinaProvince', { qos: 1, retain: false }, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api ChinaProvince')
        }
      })
      // 订阅中国的(List<>日期,现有确诊、累计、治愈、死亡，类型)
      this.client.publish('CountryHistory', 'China', { qos: 1, retain: false }, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log('Published')
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
    this.drawChart(world_data.namemap, world_data.dataArr)
  },
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
.chart{
  width: 80%;
  margin:0 auto;
  height: 600px;
  border: 1px solid #eeeeee;
  /* background: url(../../public/static/bg.png) no-repeat; 背景图设置*/
  background-size: 100% 100%;
}
</style>