import { createApp } from 'vue'
import '../../assets/style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { postMessage } from './services/post-message.service'
import { myInjectionKey } from './constants/const'
;(() => {
  try {
    const app = createApp(App)

    app.provide(myInjectionKey, new postMessage())

    app.use(router)
    app.use(createPinia())
    app.use(ElementPlus)

    app.mount('#app')
  } catch (e) {
    console.log('browser vue init failed', e)
  }
})()
