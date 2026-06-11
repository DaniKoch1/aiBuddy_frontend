<template>
  <v-card-text class="prose max-w-none" v-html="formattedText"></v-card-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from "markdown-it"
import DOMPurify from "dompurify"
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

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