/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import { router } from './router/router'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Styles
import 'unfonts.css'

const app = createApp(App).use(router).use(createPinia())

registerPlugins(app)

app.mount('#app')
