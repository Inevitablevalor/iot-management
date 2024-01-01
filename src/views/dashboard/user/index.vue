<template>
  <div class="dashboard-user-container">
    <github-corner class="github-corner" />

    <panel-group v-if="info && Object.keys(info).length > 0" :info-data="info" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :info-data="info" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart :info-data="info" />
        </div>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="8">
      <el-col :span="24" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { mapGetters } from 'vuex'
import { fetchList } from '@/api/home'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

// const lineChartData = {
//   newVisitis: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165],
//     actualData: [120, 82, 91, 154, 162, 140, 145]
//   },
//   messages: {
//     expectedData: [200, 192, 120, 144, 160, 130, 140],
//     actualData: [180, 160, 151, 106, 145, 150, 130]
//   },
//   purchases: {
//     expectedData: [80, 100, 121, 104, 105, 90, 100],
//     actualData: [120, 90, 100, 138, 142, 130, 130]
//   },
//   shoppings: {
//     expectedData: [130, 140, 141, 142, 145, 150, 160],
//     actualData: [120, 82, 91, 154, 162, 140, 130]
//   }
// }

export default {
  name: 'DashboardUser',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    // RaddarChart,
    PieChart,
    BarChart
    // TodoList,
    // BoxCard
  },
  props: {
    infoData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      lineChartDataType: {
        users: {},
        devices: {}
      },
      lineChartData: undefined,
      query: {
        username: undefined
      },
      info: {}
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'avatar',
      'introduction',
      'email'
    ])
  },
  created() {
    this.getData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = this.lineChartDataType[type]
    },
    getData() {
      this.query.username = this.username
      fetchList(this.query).then(response => {
        this.info = { ...response.data }
        this.lineChartDataType.users = {
          expectedData: this.info.users_num_week,
          actualData: this.info.users_num_week
        }
        this.lineChartDataType.devices = {
          expectedData: this.info.devices_num_week,
          actualData: this.info.devices_num_week
        }
        this.lineChartData = this.lineChartDataType.users
        console.log(this.info)
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .dashboard-user-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
  </style>

