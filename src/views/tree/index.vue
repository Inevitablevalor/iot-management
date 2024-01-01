<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <label>请选择您想要查看的设备名称：</label>
        <el-select v-model="selectedDevice" v-loading="listLoading2" placeholder="设备名称" clearable class="filter-item" style="min-width: 150px">
          <el-option v-for="item in deviceList" :key="item.key" :label="item.device_name+'('+item.type+')'" :value="item.device_name" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 40px;" @click="handleSearch">
          搜索
        </el-button>
      </div>
      <br>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="报警" width="200px" align="center">
          <template slot-scope="{row}">
            <el-tag v-if="row.alert == 1" type="danger">报警</el-tag>
            <el-tag v-else-if="row.alert == 0" type="success">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="信息" min-width="150px">
          <template slot-scope="{row}">
            <span> {{ row.info }} </span>
          </template>
        </el-table-column>
        <el-table-column label="纬度" width="150px" align="center">
          <template slot-scope="{row}">
            <span> {{ row.lat }} </span>
          </template>
        </el-table-column>
        <el-table-column label="经度" width="150px" align="center">
          <template slot-scope="{row}">
            <span> {{ row.lng }} </span>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="400px" align="center">
          <template slot-scope="{row}">
            <span> {{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} </span>
          </template>
        </el-table-column>
        <el-table-column label="Value" width="150px" align="center">
          <template slot-scope="{row}">
            <span> {{ row.value }} </span>
          </template>
        </el-table-column>

      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTableList" />
    </el-card>
    <el-card class="box-card">
      <baidu-map class="bmap" center="杭州" :zoom="zoom" @ready="handler">
        <bm-polyline :path="drawlineCoordination" stroke-color="green" :stroke-opacity="0.5" :stroke-weight="2" @lineupdate="updateDraw" />
      </baidu-map>
    </el-card>
  </div>
</template>

<script>
import { BaiduMap } from 'vue-baidu-map'
import { Card } from 'element-ui'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import { fetchList } from '@/api/article'
import { fetchInfoList } from '@/api/info'
export default {
  components: {
    'baidu-map': BaiduMap,
    'el-card': Card,
    Pagination
  },
  filters: {
    parseTime
    // statusFilter(status) {
    //   const statusMap = {
    //     '1': 'danger',
    //     0: 'success'
    //   }
    //   return statusMap[status]
    // }
  },
  data() {
    return {
      deviceList: [],
      tableKey: 0,
      list: null,
      total: 0,
      selectedDevice: undefined,
      listLoading: false,
      listLoading2: true,
      listQuery: {
        page: 1,
        limit: 5,
        device_name: undefined
      },
      timer: undefined,
      center: { lng: 119.9, lat: 30.1 },
      zoom: 10,
      mapInstance: null,
      drawlineCoordination: []
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
  mounted() {
    this.timer = setInterval(() => {
      this.getTableList()
    }, 3000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
    this.getList()
  },
  methods: {
    handler({ BMap, map }) {
      this.mapInstance = map
      map.enableScrollWheelZoom() // 启用滚轮放大缩小
    },
    handleSearch() {
      this.listQuery.device_name = this.selectedDevice
      this.drawlineCoordination.length = 0
      this.getTableList()
    },
    getList() {
      this.listLoading2 = true
      this.listQuery.owner = this.username
      fetchList(this.listQuery).then(response => {
        // 将reponse.data.items中的items解构出来，保留每个item的id, device_name与type，并将它们放入deviceList中，deviceList是一个数组，每个元素的结构为{key: id, device_name: device_name, type: type}
        // this.deviceList = response.data.items.map(({ id, device_name }) => ({ key: id, device_name }))
        this.deviceList = response.data.items.map(({ id, device_name, type }) => ({ key: id, device_name, type }))
        this.listLoading2 = false
      })
    },
    getTableList() {
      this.listLoading = true
      this.listQuery.owner = this.username
      this.listQuery.device_name = this.selectedDevice
      fetchInfoList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
        for (let i = 0; i < this.list.length; i++) {
          this.drawlineCoordination.push({ lng: this.list[i].lng, lat: this.list[i].lat })
        }
        // 对于this.list, 只保留当前页的items
        this.list = this.list.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)
        console.log(this.drawlineCoordination)
      })
    },
    updateDraw(e) {
      this.drawlineCoordination = e.target.getPath().map(item => ({ lng: item.lng, lat: item.lat }))
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 100%;
  height: 100%;
}
.bmap {
  width: 100%;
  height: 600px; /* 可根据需要修改地图的高度 */
}
</style>
