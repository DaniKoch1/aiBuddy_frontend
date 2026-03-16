<template>
  <v-card-text class="prose max-w-none" v-html="formattedText"></v-card-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from "markdown-it"
import DOMPurify from "dompurify"

const md = new MarkdownIt()

const props = defineProps<{ text: string }>()

const formattedText = computed(() =>
  DOMPurify.sanitize(md.render(props.text))
)
</script>

<style>
ul, ol {
  padding-left: 1rem !important;
}
</style>