// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueQrcode from '@xkeshi/vue-qrcode'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
import VCharts from 'v-charts'
import axios from 'axios'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import SimpleLineIcons from 'vue-simple-line'

Vue.component(VueQrcode.name, VueQrcode)
Vue.use(BootstrapVue)
Vue.use(datePicker)
Vue.use(VCharts)
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.withCredentials = true
const store = new Vuex.Store({
  state: {
    status: false,
    user: {
      user_id: '',
      username: '',
      phone_number: '',
      avatar: 'default/customers/avatars/2100_lab.jpg',
      reward_coin: '',
      is_vip: '',
      is_banned: '',
      date_joined: '',
      updated_at: ''
    },
    address: 'http://localhost:8000/media/',
    menu: 0,
    colors: [
      '#204269',
      '#204269',
      '#204269',
      '#204269',
      '#204269',
      '#204269',
      '#204269'
    ]
  },
  mutations: {
    status (state, status = true) {
      state.status = status
      sessionStorage.setItem('status', status ? 'true' : 'false')
    },
    user (state, user) {
      state.user = user
    },
    username (state, username) {
      state.user.username = username
    },
    phone (state, number) {
      state.user.phone = number
      sessionStorage.setItem('phone', number)
    },
    money (state, money) {
      state.money = money
      sessionStorage.setItem('money', money)
    },
    date_joined (state, time) {
      state.user.date_joined = time
    },
    avatar (state, avatar) {
      state.user.avatar = avatar
    },
    logout (state) {
      state.status = false
      sessionStorage.setItem('status', 'false')
    },
    menu (state, menu) {
      state.menu = menu
      sessionStorage.setItem('menu', menu)
    },
    colors (state, id) {
      for (let i = 0; i < 7; i++) {
        state.colors[i] = '#204269'
      }
      state.colors[id] = '#5b9bd1'
      sessionStorage.setItem('colors', id)
    }
  }
})

const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    zh: require('./lang/zh/zh'),
    en: require('./lang/en/en')
  }
})

Vue.component('simple-line-icons', SimpleLineIcons)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  i18n,
  components: { App, SimpleLineIcons },
  template: '<App/>'
}).$mount('#app')
