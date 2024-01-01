<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.device_name" placeholder="设备名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="设备类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="250px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" min-width="110px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.device_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" max-width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备描述" min-width="110px">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拥有者" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.owner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="min-width: 100px; max-width: 500px; margin-left:30px;">
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期" prop="create_time">
          <el-date-picker v-model="temp.create_time" type="datetime" disabled />
        </el-form-item>
        <el-form-item label="设备名称" prop="device_name">
          <el-input v-model="temp.device_name" />
        </el-form-item>
        <el-form-item label="设备描述">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入..." />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle, deleteArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

const calendarTypeOptions = [
  { key: 'device0001', display_name: 'device0001' },
  { key: 'device0002', display_name: 'device0002' },
  { key: 'device0003', display_name: 'device0003' },
  { key: 'device0004', display_name: 'device0004' },
  { key: 'device0005', display_name: 'device0005' },
  { key: 'offline', display_name: '离线设备' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime,
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        device_name: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        description: '',
        create_time: new Date(),
        device_name: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: '设备类型必选', trigger: 'change' }],
        create_time: [{ type: 'date', required: true, message: '创建日期必选', trigger: 'change' }],
        device_name: [{ required: true, message: '设备名称必填', trigger: 'blur' }]
      },
      downloadLoading: false
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
    this.getUser()
    this.getList()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.username,
        email: this.email,
        avatar: this.avatar,
        introduction: this.introduction
      }
    },
    getList() {
      this.listLoading = true
      this.listQuery.owner = this.username
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.0 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        description: '',
        create_time: new Date(),
        device_name: '',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.owner = this.username
          this.temp.create_time = new Date(this.temp.create_time).toISOString().slice(0, 19).replace('T', ' ')
          createArticle(this.temp).then(response => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '设备创建成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.create_time = new Date(this.temp.create_time)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.create_time = +new Date(tempData.create_time) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          tempData.create_time = new Date(tempData.create_time).toISOString().slice(0, 19).replace('T', ' ')
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '设备信息已更新！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // handleDelete(row, index) {
    //   this.$notify({
    //     title: 'Success',
    //     message: 'Delete Successfully',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   this.list.splice(index, 1)
    // },+
    handleDelete(row, index) {
      this.$confirm('你确定你要删除这个设备吗？', '注意', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        const tempData = Object.assign({}, row)
        deleteArticle(tempData).then(() => {
          this.list.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '该设备相关信息已删除！',
            type: 'success'
          })
        })
      }).catch(() => {
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
