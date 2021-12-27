<template>
  <div class="show-chart-area">
    <div id="WorldMap"></div>
  </div>
</template>

<script>
import mqtt from "mqtt";
import '/src/assets/js/world'
import world_data from '/src/api/world.json'
import worldJson from "../assets/json/world.json";
export default {
  name: "WorldMap",
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
      all_country:new Map(),
      dataArr: [
        {
          "name": "阿富汗",
          "value": 28397.812
        },
        {
          "name": "安哥拉",
          "value": 19549.124
        },
        {
          "name": "阿尔巴尼亚",
          "value": 3150.143
        },
        {
          "name": "阿尔及利亚",
          "value": 8441.537
        },
        {
          "name": "阿根廷",
          "value": 40374.224
        },
        {
          "name": "亚美尼亚",
          "value": 2963.496
        },
        {
          "name": "澳大利亚",
          "value": 268.065
        },
        {
          "name": "奥地利",
          "value": 22404.488
        },
        {
          "name": "阿塞拜疆",
          "value": 8401.924
        },
        {
          "name": "布隆迪",
          "value": 9094.718
        },
        {
          "name": "比利时",
          "value": 9232.753
        },
        {
          "name": "贝宁",
          "value": 10941.288
        },
        {
          "name": "布基纳法索",
          "value": 9509.798
        },
        {
          "name": "孟加拉国",
          "value": 15540.284
        },
        {
          "name": "保加利亚",
          "value": 151125.475
        },
        {
          "name": "波斯尼亚和黑塞哥维那",
          "value": 7389.175
        },
        {
          "name": "白俄罗斯",
          "value": 66402.316
        },
        {
          "name": "伯利兹",
          "value": 3845.929
        },
        {
          "name": "百慕大群岛",
          "value": 9491.07
        },
        {
          "name": "玻利维亚",
          "value": 308.595
        },
        {
          "name": "巴西",
          "value": 64.951
        },
        {
          "name": "文莱",
          "value": 716.939
        },
        {
          "name": "不丹",
          "value": 195210.154
        },
        {
          "name": "博茨瓦纳",
          "value": 27.223
        },
        {
          "name": "柬埔寨",
          "value": 716.939
        },
        {
          "name": "喀麦隆",
          "value": 1969.341
        },
        {
          "name": "加拿大",
          "value": 4349.921
        },
        {
          "name": "中非共和国",
          "value": 34126.24
        },
        {
          "name": "乍得",
          "value": 7830.534
        },
        {
          "name": "智利",
          "value": 17150.76
        },
        {
          "name": "中国",
          "value": 1359821.465
        },
        {
          "name": "哥伦比亚",
          "value": 60508.978
        },
        {
          "name": "刚果",
          "value": 17150.343
        },
        {
          "name": "科特迪瓦",
          "value": 17150.343
        },
        {
          "name": "哥斯达黎加",
          "value": 20624.343
        },
        {
          "name": "克罗地亚",
          "value": 62191.161
        },
        {
          "name": "古巴",
          "value": 3573.024
        },
        {
          "name": "塞浦路斯",
          "value": 46444.798
        },
        {
          "name": "捷克共和国",
          "value": 4669.685
        },
        {
          "name": "民主刚果",
          "value": 11281.768
        },
        {
          "name": "丹麦",
          "value": 1.468
        },
        {
          "name": "吉布提",
          "value": 1103.685
        },
        {
          "name": "多米尼加共和国",
          "value": 10553.701
        },
        {
          "name": "东帝汶",
          "value": 83017.404
        },
        {
          "name": "厄瓜多尔",
          "value": 834.036
        },
        {
          "name": "埃及",
          "value": 5550.959
        },
        {
          "name": "萨尔瓦多",
          "value": 10016.797
        },
        {
          "name": "赤道几内亚",
          "value": 37062.82
        },
        {
          "name": "厄立特里亚",
          "value": 15001.072
        },
        {
          "name": "爱沙尼亚",
          "value": 78075.705
        },
        {
          "name": "埃塞俄比亚",
          "value": 5741.159
        },
        {
          "name": "福克兰群岛",
          "value": 46182.038
        },
        {
          "name": "斐济",
          "value": 1298.533
        },
        {
          "name": "芬兰",
          "value": 87095.281
        },
        {
          "name": "法国",
          "value": 5367.693
        },
        {
          "name": "法属圭亚那",
          "value": 860.559
        },
        {
          "name": "法属南部领地",
          "value": 49.581
        },
        {
          "name": "加蓬",
          "value": 63230.866
        },
        {
          "name": "冈比亚",
          "value": 1556.222
        },
        {
          "name": "德国",
          "value": 62066.35
        },
        {
          "name": "佐治亚州",
          "value": 4388.674
        },
        {
          "name": "加纳",
          "value": 24262.901
        },
        {
          "name": "希腊",
          "value": 10876.033
        },
        {
          "name": "格陵兰",
          "value": 1680.64
        },
        {
          "name": "危地马拉",
          "value": 10876.033
        },
        {
          "name": "几内亚",
          "value": 696.167
        },
        {
          "name": "几内亚比绍",
          "value": 11109.999
        },
        {
          "name": "圭亚那",
          "value": 56.546
        },
        {
          "name": "海地",
          "value": 14341.576
        },
        {
          "name": "赫德岛和麦克唐纳群岛",
          "value": 4338.027
        },
        {
          "name": "洪都拉斯",
          "value": 231.169
        },
        {
          "name": "匈牙利",
          "value": 786.126
        },
        {
          "name": "冰岛",
          "value": 7621.204
        },
        {
          "name": "印度",
          "value": 4338.027
        },
        {
          "name": "印度尼西亚",
          "value": 9896.4
        },
        {
          "name": "伊朗",
          "value": 10014.633
        },
        {
          "name": "伊拉克",
          "value": 240676.485
        },
        {
          "name": "爱尔兰",
          "value": 15624.648
        },
        {
          "name": "以色列",
          "value": 4467.561
        },
        {
          "name": "意大利",
          "value": 240676.485
        },
        {
          "name": "象牙海岸",
          "value": 30962.38
        },
        {
          "name": "牙买加",
          "value": 318.042
        },
        {
          "name": "日本",
          "value": 7420.368
        },
        {
          "name": "乔丹",
          "value": 60508.978
        },
        {
          "name": "克什米尔",
          "value": 15921.485
        },
        {
          "name": "哈萨克斯坦",
          "value": 2741.485
        },
        {
          "name": "肯尼亚",
          "value": 6454.554
        },
        {
          "name": "科索沃",
          "value": 127352.833
        },
        {
          "name": "科威特",
          "value": 15921.127
        },
        {
          "name": "吉尔吉斯斯坦",
          "value": 40909.194
        },
        {
          "name": "老挝",
          "value": 5334.223
        },
        {
          "name": "老挝人民民主共和国",
          "value": 127352.833
        },
        {
          "name": "拉脱维亚",
          "value": 14364.931
        },
        {
          "name": "黎巴嫩",
          "value": 51452.352
        },
        {
          "name": "莱索托",
          "value": 97.743
        },
        {
          "name": "利比里亚",
          "value": 2991.58
        },
        {
          "name": "利比亚",
          "value": 6395.713
        },
        {
          "name": "立陶宛",
          "value": 4341.092
        },
        {
          "name": "卢森堡",
          "value": 3957.99
        },
        {
          "name": "马达加斯加",
          "value": 6040.612
        },
        {
          "name": "马其顿",
          "value": 20758.779
        },
        {
          "name": "马拉维",
          "value": 2008.921
        },
        {
          "name": "马来西亚",
          "value": 3068.457
        },
        {
          "name": "马里",
          "value": 507.885
        },
        {
          "name": "毛里塔尼亚",
          "value": 2090.519
        },
        {
          "name": "墨西哥",
          "value": 31642.36
        },
        {
          "name": "摩尔多瓦",
          "value": 103.619
        },
        {
          "name": "蒙古",
          "value": 21079.532
        },
        {
          "name": "黑山",
          "value": 117886.404
        },
        {
          "name": "摩洛哥",
          "value": 507.885
        },
        {
          "name": "莫桑比克",
          "value": 13985.961
        },
        {
          "name": "缅甸",
          "value": 51931.231
        },
        {
          "name": "纳米比亚",
          "value": 620.078
        },
        {
          "name": "荷兰",
          "value": 2712.738
        },
        {
          "name": "新喀里多尼亚",
          "value": 23967.265
        },
        {
          "name": "新西兰",
          "value": 3609.42
        },
        {
          "name": "尼泊尔",
          "value": 15013.694
        },
        {
          "name": "尼加拉瓜",
          "value": 28275.835
        },
        {
          "name": "尼日尔",
          "value": 2178.967
        },
        {
          "name": "尼日利亚",
          "value": 246.379
        },
        {
          "name": "朝鲜",
          "value": 15893.746
        },
        {
          "name": "北塞浦路斯",
          "value": 159707.78
        },
        {
          "name": "挪威",
          "value": 5822.209
        },
        {
          "name": "阿曼",
          "value": 16615.243
        },
        {
          "name": "巴基斯坦",
          "value": 4891.251
        },
        {
          "name": "巴拿马",
          "value": 26846.016
        },
        {
          "name": "巴布亚新几内亚",
          "value": 4368.136
        },
        {
          "name": "巴拉圭",
          "value": 2802.768
        },
        {
          "name": "秘鲁",
          "value": 173149.306
        },
        {
          "name": "刚果共和国",
          "value": 3678.128
        },
        {
          "name": "菲律宾",
          "value": 29262.83
        },
        {
          "name": "波兰",
          "value": 93444.322
        },
        {
          "name": "葡萄牙",
          "value": 6858.945
        },
        {
          "name": "波多黎各",
          "value": 38198.754
        },
        {
          "name": "卡塔尔",
          "value": 3709.671
        },
        {
          "name": "塞舌尔共和国",
          "value": 1000.556
        },
        {
          "name": "罗马尼亚",
          "value": 10589.792
        },
        {
          "name": "俄罗斯",
          "value": 6459.721
        },
        {
          "name": "卢旺达",
          "value": 1749.713
        },
        {
          "name": "萨摩亚",
          "value": 11749.713
        },
        {
          "name": "沙特阿拉伯",
          "value": 21861.476
        },
        {
          "name": "塞内加尔",
          "value": 21861.476
        },
        {
          "name": "塞尔维亚",
          "value": 18862.257
        },
        {
          "name": "塞拉利昂",
          "value": 10836.732
        },
        {
          "name": "斯洛伐克",
          "value": 514.648
        },
        {
          "name": "斯洛文尼亚",
          "value": 27258.387
        },
        {
          "name": "所罗门群岛",
          "value": 35652.002
        },
        {
          "name": "索马里兰",
          "value": 9940.929
        },
        {
          "name": "索马里",
          "value": 12950.564
        },
        {
          "name": "南非",
          "value": 526.447
        },
        {
          "name": "南乔治亚和南桑德威奇群岛",
          "value": 6218.195
        },
        {
          "name": "韩国",
          "value": 5751.976
        },
        {
          "name": "南苏丹",
          "value": 6218.195
        },
        {
          "name": "西班牙",
          "value": 9636.173
        },
        {
          "name": "斯里兰卡",
          "value": 9636.173
        },
        {
          "name": "苏丹",
          "value": 3573.024
        },
        {
          "name": "苏里南",
          "value": 524.96
        },
        {
          "name": "斯威士兰",
          "value": 5433.437
        },
        {
          "name": "瑞典",
          "value": 2054.232
        },
        {
          "name": "瑞士",
          "value": 9382.297
        },
        {
          "name": "叙利亚",
          "value": 1193.148
        },
        {
          "name": "塔吉克斯坦",
          "value": 7830.534
        },
        {
          "name": "坦桑尼亚",
          "value": 9876.785
        },
        {
          "name": "泰国",
          "value": 11720.781
        },
        {
          "name": "汤加王国",
          "value": 10710.701
        },
        {
          "name": "巴哈马",
          "value": 6306.014
        },
        {
          "name": "多哥",
          "value": 66402.316
        },
        {
          "name": "特立尼达和多巴哥",
          "value": 7627.326
        },
        {
          "name": "突尼斯",
          "value": 5041.995
        },
        {
          "name": "土耳其",
          "value": 10016.797
        },
        {
          "name": "土库曼斯坦",
          "value": 1328.095
        },
        {
          "name": "乌干达",
          "value": 10631.83
        },
        {
          "name": "乌克兰",
          "value": 72137.546
        },
        {
          "name": "阿拉伯联合酋长国",
          "value": 44973.33
        },
        {
          "name": "大不列颠联合王国",
          "value": 33987.213
        },
        {
          "name": "坦桑尼亚联合共和国",
          "value": 46050.22
        },
        {
          "name": "美国",
          "value": 3371.982
        },
        {
          "name": "美利坚合众国",
          "value": 312247.116
        },
        {
          "name": "乌拉圭",
          "value": 27769.27
        },
        {
          "name": "乌兹别克斯坦",
          "value": 236.299
        },
        {
          "name": "瓦努阿图",
          "value": 89047.397
        },
        {
          "name": "委内瑞拉",
          "value": 236.299
        },
        {
          "name": "越南",
          "value": 13.565
        },
        {
          "name": "西岸",
          "value": 22763.008
        },
        {
          "name": "西撒哈拉",
          "value": 51452.352
        },
        {
          "name": "也门",
          "value": 13216.985
        },
        {
          "name": "赞比亚",
          "value": 13076.978
        },
        {
          "name": "津巴布韦",
          "value": 11056.426
        }
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
            this.all_country.set(name,value)
          }
          for(i=0; i<this.dataArr.length; i++){
            var name1=this.dataArr[i].name
            var value2
            if(this.all_country.has(name1)){
              value2=this.all_country.get(name1).confirmed_now
            }
            else{
              value2=0
            }
            this.dataArr[i].value=value2
            console.log(name1)
            console.log(value2)
            console.log('test')
          }
          this.showWorldMap(world_data.namemap,this.dataArr)
        }
      })
    },
    // 订阅主题
    doSubscribe() {
      // 订阅并请求数据
      // 订阅allCountry{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.subscribe('allCountry', { qos: 2 }, function (error, granted) {
        if (error) {
          console.log(error)
        } else {
          console.log(`${granted[0].topic} was subscribed`)
        }
      })

      // 订阅后发布请求，提醒服务器发送数据
      // 订阅allCountry{List<>名称,现有确诊、累计、治愈、死亡}
      this.client.publish('api', 'allCountry', { qos: 1, retain: false }, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log('Published api allCountry')
        }
      })
    },
    // 加载中国地图
    showWorldMap(name,data){

      // 基于准备好的dom，初始化echarts实例
      let chart = this.$echarts.init(document.getElementById('WorldMap'),null,{
        width: 980,
        height: 700
      })
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function () {
        chart.resize()
      })
      // 绘制图表
      chart.setOption({
        // 图表主标题
        title: {
          text: '世界地图', // 主标题文本，支持使用 \n 换行
          top: 10, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
          left: 'center', // 值: 'left', 'center', 'right' 同上
          textStyle: { // 文本样式
            fontSize: 24,
            fontWeight: 600,
            color: '#000'
          }
        },
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
          showDelay: 0,
          transitionDuration: 0.2,
          // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
          // 使用函数模板  传入的数据值 -> value: number | Array
          formatter: function (val) {
            if(val.data == null) return ;
            return val.data.name + ': ' + val.data.value
          }
        },
        // 视觉映射组件
        visualMap: {
          left: 'left',
          min: 1,
          max: 3000000,
          realtime: false,
          calculable: true,
          inRange: {
            color: ['rgba(255,255,255,1)','#c3e0ff','#0064d0'],
            // color: [
            //   'rgb(255,255,255)',
            //   '#ffffbf',
            //   '#fee090',
            //   '#fdae61',
            //   '#f46d43',
            //   '#d73027',
            //   '#a50026'
            // ]
          },
          text: ['High', 'Low'],
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
  },
  mounted() {
    this.createConnection()
    this.doSubscribe()
  }

}
</script>

<style scoped>

</style>