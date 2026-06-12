<template>
  <GenericDialogue v-model:showDialog="showDialog" title="About" width="auto">
    This prototype helps you to learn coding by answering your questions, while engaging you in critical evaluation. <br/>
    <b>Recommended flow:</b> ask about a concept in <i>Understand mode</i> -> ask for an implementation of it in <i>Code mode</i> ->
    use the code in your project and ask for a review of a function or a small class in <i>Code Review mode.</i>
    <br/><br/>
    Main features:
    <ul>
      <li><b>Three modes of questions:</b>
        <ol>
          <li><b>{{ ChatMode.Understand }}</b> explains a concept verbally to you, without any code.</li>
          <li><b>{{ ChatMode.Code }}</b> outputs three different code examples to help you to familiarize yourself with different implementations
            and to evaluate them. The quality of the code varies, so be sure to either choose the correct one or to correct the one you chose!</li>
          <li><b>{{ ChatMode.CodeReview }}</b> help you to reflect on your code by asking you questions about a part of it.
            After answering the questions you will receive feedback highlighting both strengths of your code and areas for improvement.</li>
        </ol>
      </li>
      <li><b>Thinking process</b> allows you to understand how the AI reached its answer. Reading it can help you understand the background or check for potential mistakes.</li>
      <li><b>Follow up questions</b> guide you to think independently about the answer, which is essential for engaging deeply with the topic.</li>
    </ul>
    <br/>
    <i>Attention, if you refresh the page, you will lose your conversation!</i>
  </GenericDialogue>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChatMode } from '@/model/model';
import GenericDialogue from './GenericDialogue.vue';

const props = defineProps<{ showDialog: boolean }>()

const emit = defineEmits<{
  (e: 'update:showDialog', value: boolean): void
}>()

const showDialog = computed({
  get: () => props.showDialog,
  set: (value) => emit('update:showDialog', value)
})
</script>
