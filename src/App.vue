<template id="app">
  <el-row id="row">
    <el-col :span="4" id="left">
      <el-menu
          id="menu"
          default-active="activeIndex"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="rgba(255,255,255,0.9)"
          active-text-color="#ffd04b">
        <el-submenu index="1" style="margin-top: 10px">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span style="font-size: 24px;">国内疫情</span>
          </template>
          <el-menu-item-group>

            <el-menu-item @click="toChinaOverview" index="1-1" style="font-size: 19px;margin-left: 10px">国内疫情概况</el-menu-item>
            <el-menu-item @click="toChinaConfirmedLine" index="1-2" style="font-size: 19px;margin-left: 10px">现有确诊趋势</el-menu-item>
            <el-menu-item @click="toC" index="1-3" style="font-size: 19px;margin-left: 10px">累计确诊趋势</el-menu-item>
            <el-menu-item @click="toChinaMap" index="1-4" style="font-size: 19px;margin-left: 10px">中国疫情地图</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="2" style="margin-top: 10px">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span style="font-size: 24px;">国外疫情</span>
          </template>
          <el-menu-item-group>
            <el-menu-item @click="toChinaOverview" index="2-1" style="font-size: 19px;margin-left: 10px">国外疫情概况</el-menu-item>
            <el-menu-item @click="toB" index="2-2" style="font-size: 19px;margin-left: 10px">新增确诊趋势</el-menu-item>
            <el-menu-item @click="toC" index="2-3" style="font-size: 19px;margin-left: 10px">累计确诊趋势</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

      </el-menu>
    </el-col>
    <el-col :span="20" id="right">
      <div class="title">疫情数据发布订阅及预测系统</div>
      <div class="view">
        <router-view></router-view>
      </div>

    </el-col>
  </el-row>
</template>
<script>
export default {
  name:'app',
  data(){
    return{
      activeIndex:'1',

    }
  },
  methods:{
    toChinaOverview(){
      this.$router.push('/ChinaOverview')
    },
    toB(){
      this.$router.push('/Two')
    },
    toC(){
      this.$router.push('/')
    },
    toChinaMap(){
      this.$router.push('/ChinaMap')
    },
    toChinaConfirmedLine(){
      this.$router.push('/ChinaConfirmedLine')
    }
  }
}
</script>
<style>
body{
  /*background-color: black;*/
  padding: 0;
  margin: 0;
}
#app {
  width: 100%;
  height: 100%;
  /*background-color: red;*/
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#row{
  height: 750px;
  overflow: hidden;
  /*border: 1px solid red;*/
}
#menu{
  height: 1000px;
  /*border: 1px solid orangered;*/
  overflow: hidden;
}
#left{
  /*border: 1px solid #0d334b;*/
  overflow: hidden;
}
#right{
  /*border: 1px solid pink;*/
}
.title{
  height: 65px;
  font-size: 35px;
  line-height: 75px;
  padding-left: 70px;
}
.view{
  background-color: whitesmoke;
  /*background-color: gainsboro;*/
  border: pink;
  width: 100%;
  height: 100%;
}
a{
  text-decoration: none;
  color: rgba(255,255,255,0.9);
}
</style>