import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { setContext } from 'apollo-link-context'

const httpLink = new HttpLink({
  uri: 'http://admin.shengxiagn.com/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwt-token')

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

// Create apollo client
const apolloClient = new ApolloClient({
  // link: httpLink,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(ElementUI, { locale })
// Install plugin
Vue.use(VueApollo)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  // 下面的写法会有bug
  // Uncaught TypeError: Cannot read property 'defaultClient' of null
  // apolloProvider,
  provide: apolloProvider.provide(),
  store,
  template: '<App/>',
  components: { App }
})
