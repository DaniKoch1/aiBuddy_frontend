<template>
  <v-card-text class="prose max-w-none" v-html="formattedText"></v-card-text>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useTheme } from 'vuetify'
import MarkdownIt from "markdown-it"
import DOMPurify from "dompurify"
import hljs from 'highlight.js';
import hljsLight from 'highlight.js/styles/github.css?url'
import hljsDark  from 'highlight.js/styles/github-dark.css?url'

const theme = useTheme()

watchEffect(() => {
  const isDark = theme.global.current.value.dark
  const id = 'hljs-theme'
  let link = document.getElementById(id) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  link.href = isDark ? hljsDark : hljsLight
})

const md = new MarkdownIt({
  highlight(code, lang) {
    const highlighted = (lang && hljs.getLanguage(lang))
      ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
      : hljs.highlightAuto(code).value
    return `<pre><code class="hljs">${highlighted}</code></pre>`
  }
})

const props = defineProps<{ text: string }>()

const formattedText = computed(() =>
  DOMPurify.sanitize(md.render(props.text), { ADD_ATTR: ['class'] })
)
</script>

<style>
ul, ol {
  padding-left: 1rem !important;
}

.answer pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>