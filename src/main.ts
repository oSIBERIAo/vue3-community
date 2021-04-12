import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './element-variables.scss'

import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import '@kangc/v-md-editor/lib/plugins/tip/tip.css'

import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'

VueMarkdownEditor.use(vuepressTheme)
VMdPreview.use(vuepressTheme)

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(VueMarkdownEditor)
  .use(VMdPreview)
  .mount('#app')
