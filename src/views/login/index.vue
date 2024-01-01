<template>
  <div class="login-container">
    <!-- Now we input several empty lines -->
    <br>
    <br>
    <br>
    <div class="title-container">
      <h3 class="title">IoT信息管理平台</h3>
    </div>
    <div class="card-container">
      <el-row class="center-row" :gutter="20">
        <el-col :span="24" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab" class="form-tab" stretch>
              <el-tab-pane label="登录" name="login">
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
                  <el-form-item prop="username">
                    <span class="svg-container">
                      <svg-icon icon-class="user" />
                    </span>
                    <el-input
                      ref="username"
                      v-model="loginForm.username"
                      placeholder="用户名"
                      name="username"
                      type="text"
                      tabindex="1"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <span class="svg-container">
                      <svg-icon icon-class="password" />
                    </span>
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="loginForm.password"
                      :type="passwordType"
                      placeholder="密码"
                      name="password"
                      tabindex="2"
                      auto-complete="on"
                      @keyup.enter.native="handleLogin"
                    />
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                  <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
                  <!-- <div class="tips">
            <span style="margin-right:20px;">username: admin</span>
            <span> password: any</span>
          </div> -->
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="注册" name="register">
                <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" auto-complete="on" label-position="left">
                  <el-form-item prop="email">
                    <span class="svg-container">
                      <svg-icon icon-class="email" />
                    </span>
                    <el-input
                      ref="email"
                      v-model="registerForm.email"
                      placeholder="邮箱"
                      name="email"
                      type="text"
                      tabindex="1"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="username">
                    <span class="svg-container">
                      <svg-icon icon-class="user" />
                    </span>
                    <el-input
                      ref="username"
                      v-model="registerForm.username"
                      placeholder="用户名"
                      name="username"
                      type="text"
                      tabindex="2"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <span class="svg-container">
                      <svg-icon icon-class="password" />
                    </span>
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="registerForm.password"
                      :type="passwordType"
                      placeholder="密码"
                      name="password"
                      tabindex="3"
                      auto-complete="on"
                    />
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                  <el-form-item prop="confirmPassword">
                    <span class="svg-container">
                      <svg-icon icon-class="password" />
                    </span>
                    <el-input
                      :key="passwordType"
                      ref="confirmPassword"
                      v-model="registerForm.confirmPassword"
                      :type="passwordType"
                      placeholder="确认密码"
                      name="confirmPassword"
                      tabindex="4"
                      auto-complete="on"
                    />
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                  <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { validUsername, validEmail, validPassword } from '@/utils/validate'

export default {
  name: 'LoginRegister',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名，用户名只能由数字和字母组成且位于4至16位'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码只能由数字和字母组成且不少于6位'))
      } else {
        callback()
      }
    }

    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }

    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      activeTab: 'login',
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      registerRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      // Your original showPwd method code
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // Your original handleLogin method code
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.password = this.$md5(this.loginForm.password)
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister() {
      // Your new handleRegister method code
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.registerForm.password = this.$md5(this.registerForm.password)
          this.registerForm.confirmPassword = this.$md5(this.registerForm.confirmPassword)
          this.loading = true
          this.$store.dispatch('user/register', this.registerForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000000;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-tabs__item {
    color: #283443;
    }
  .el-tabs__item.is-active {
    color: #0095ffb1;
    }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #000000;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cg %3E%3Ccircle fill='%23000000' cx='400' cy='400' r='600'/%3E%3Ccircle fill='%23230046' cx='400' cy='400' r='500'/%3E%3Ccircle fill='%232f0052' cx='400' cy='400' r='400'/%3E%3Ccircle fill='%233b075e' cx='400' cy='400' r='300'/%3E%3Ccircle fill='%2348156a' cx='400' cy='400' r='200'/%3E%3Ccircle fill='%23552277' cx='400' cy='400' r='100'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .card-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .center-row {
    justify-content: center!important;
  }
  .form-tab {
    width: 500px;
    margin: 0 auto;
    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 20px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

  .register-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 20px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }
  }
  .tips {
    font-size: 14px;
    color: #000000;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 40px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
