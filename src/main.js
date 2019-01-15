import Vue from 'vue'
import App from './App.vue'

// 全局样式
import '@/assets/css/base.scss'
import '@/assets/css/global.scss'
import '@/assets/css/iconfont.scss'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
