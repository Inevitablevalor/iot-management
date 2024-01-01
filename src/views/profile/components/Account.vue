<template>
  <el-form>
    <el-form-item label="用户名">
      <el-input v-model.trim="user.name" :disabled="true" />
    </el-form-item>
    <el-form-item label="邮箱地址">
      <el-input v-model.trim="user.email" :disabled="true" />
    </el-form-item>
    <el-form-item label="个人介绍">
      <el-input v-model.trim="user.introduction" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { update } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data() {
    return {
      form: {
        username: '',
        email: '',
        introduction: ''
      }
    }
  },
  methods: {
    submit() {
      this.form.username = this.user.name
      this.form.email = this.user.email
      this.form.introduction = this.user.introduction
      update(this.form).then(() => {
        this.$message({
          message: '用户信息更新成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
