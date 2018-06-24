<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Your name:{{name}}</div>
    <div class="dashboard-text">Your roles:<span v-for='role in roles' :key='role'>{{role}}</span></div>
    <button @click="register">Create</button>

    <input type="text" v-model="email" placeholder="Your email">
    <input type="text" v-model="password" placeholder="Your password">
    <button @click="login">Login</button>
    <div v-if="token">Congratulation, your token is {{ token }}</div>
    <ul>
      <li v-for="user in allUsers" :key="user.id">
        {{ user.id }} - {{ user.name }} - {{ user.email }}
      </li>
    </ul>

    <input type="text" v-model="title" placeholder="Your title">
    <input type="text" v-model="content" placeholder="Your content">
    <button @click="addPost">Add</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  ALL_USERS_QUERY,
  USER_QUERY,
  ADD_ARTICLE_MUTATION,
  ALL_ARTICLES_QUERY,
  ARTICLE_QUERY
} from '@/graphql'

export default {
  name: 'dashboard',
  data() {
    return {
      email: '1345678@qq.com',
      password: '123456',
      token: '',
      allUsers: [],
      user: {},
      title: '',
      content: '',
      allArticles: [],
      article: {}
    }
  },
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
            name: 'marry',
            email: '1345678@qq.com',
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
    },
    login() {
      this.$apollo
        .mutate({
          mutation: LOGIN_MUTATION,
          variables: {
            email: this.email,
            password: this.password
          }
        })
        .then(res => {
          console.log(res)
          console.log(this)
          this.token = res.data.login.token
          // 保存用户 token 到 local storage
          localStorage.setItem('jwt-token', res.data.login.token)

          // // 重定向用户到文章列表页
          // this.$router.replace('/admin/posts')
        })
        .catch(err => {
          console.log(err)
        })
    },
    addPost() {
      this.$apollo
        .mutate({
          mutation: ADD_ARTICLE_MUTATION,
          variables: {
            title: this.title,
            content: this.content
          }
          /* update: (store, { data: { addArticle } }) => {
            // 从缓存中读取所有文章数据
            const data = store.readQuery({ query: ALL_POSTS_QUERY })

            // 将新发布文章添加到已有文章列表
            data.allPosts.push(addPost)

            // 回写文章数据到缓存
            store.writeQuery({ query: ALL_POSTS_QUERY, data })
          } */
        })
        .then(res => {
          console.log(res)
          // 重定向到文章列表页
          // this.$router.replace('/admin/posts')
        })
    }
  },
  apollo: {
    allUsers: {
      query: ALL_USERS_QUERY
    },
    user: {
      query: USER_QUERY,
      variables() {
        return {
          id: '1'
        }
      }
    },
    allArticles: {
      query: ALL_ARTICLES_QUERY
    },
    article: {
      query: ARTICLE_QUERY,
      variables() {
        return {
          id: '1'
        }
      }
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
