import { createMemoryHistory, createRouter } from 'vue-router'

import Chat from '../components/Chat.vue'
import CodeReviews from '../components/CodeReviews.vue'

const routes = [
  { path: '/', component: Chat },
  { path: '/codereviews', component: CodeReviews },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})