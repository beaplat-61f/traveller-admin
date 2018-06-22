<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Your name:{{name}}</div>
    <div class="dashboard-text">Your roles:<span v-for='role in roles' :key='role'>{{role}}</span></div>
    <button @click="register">Create</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { REGISTER_MUTATION } from '@/graphql'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    register() {
      this.$apollo
        .mutate({
          mutation: REGISTER_MUTATION,
          variables: {
            name: 'terry',
            email: '12345678@qq.com',
            password: '123456'
          }
        })
        .then(res => {
          // 重定向到登录页面
          console.log(res)
          // this.$router.replace('/login')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
