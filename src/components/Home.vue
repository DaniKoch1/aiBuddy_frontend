<template>
    <v-container class="d-flex flex-column" style="height: 100vh">
        <div class="pb-4">
            <Greeting v-if="history?.length"/>
        </div>
        <div ref="scrollArea" :class=" history?.length ? 'flex-grow-1 overflow-y-auto' : ''">
            <div class="content mx-auto">
                <div v-for="item in history" :key="item.text">
                    <v-card
                        v-if="item.inputType == InputType.Reasoning"
                        class = "mb-2 answer"
                        color="indigo"
                        variant="outlined"
                    >
                        <v-card-actions class="pa-0">
                            <v-card-text> Show thinking process. </v-card-text>
                            <v-btn
                                class="mr-2"
                                size="x-small"
                                :icon="item.showReasoning ? 'fas fa-chevron-up fa-xs' : 'fas fa-chevron-down fa-xs'"
                                @click="item.showReasoning = !item.showReasoning"
                            ></v-btn>
                        </v-card-actions>
                        <v-expand-transition>
                            <div v-show="item.showReasoning">
                                <v-divider></v-divider>
                                <v-card-text> {{ item.text }} </v-card-text>
                            </div>
                        </v-expand-transition>
                    </v-card>
                    <v-card
                        v-else
                        class = "mb-2"
                        color="indigo"
                        :variant="item.inputType == InputType.Question ? 'tonal' : 'outlined'"
                        :class="item.inputType == InputType.Question ? 'question' : 'answer'"
                        :text = item.text
                    ></v-card>
                </div>
            </div>
        </div>
        <div :class=" history?.length ? 'pt-4' : 'my-auto'">
            <div class="content mx-auto">
                <Greeting v-if="!history?.length"/>
                <v-textarea
                    label="Ask away"
                    variant="outlined"
                    auto-grow
                    rows="1"
                    max-rows="6"
                    :append-inner-icon="isThinking ? 'fas fa-lightbulb fa-fade' : 'fas fa-arrow-up'"
                    :disabled="isThinking"
                    v-model="question"
                    @click:append-inner="sendMessage"
                ></v-textarea>
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import Greeting from './Greeting.vue'

enum InputType {
    Question = 0,
    Answer,
    Reasoning
}
type HistoryItem = {text: string, inputType: InputType, showReasoning: Boolean}

let question = ref("");
let history = ref<[HistoryItem]>();
let isThinking = ref(false);
const AIEnabled = true;
const scrollArea = ref<HTMLElement | null>(null);

watch(history, async () => {
  await nextTick()

  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  }
}, { deep: true })

async function sendMessage() {
    console.log("You asked:", question.value);
    if (!question.value) return;

    isThinking.value = true;

    const qInput: HistoryItem = {text: question.value, inputType: InputType.Question, showReasoning: false};
    if (!history.value) {
        history.value = [qInput];
    } else {
        history.value.push(qInput);
    }

    let response, answer, reasoning;
    if (AIEnabled) {
        response = await fetch("http://localhost:5000/talk", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(question.value)
        })
    } else {
        
        await new Promise(f => setTimeout(f, 1500));
        response = await fetch("http://localhost:5000/answer", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(question.value)
        })
    }
    if (response.status === 200)
    {
        const message = await response.json();
        console.log(message);
        answer = message.answer;
        reasoning = message.reasoning;
    }

    const rInput: HistoryItem = {text: reasoning, inputType: InputType.Reasoning, showReasoning: false};
    history.value.push(rInput);
    const aInput: HistoryItem = {text: answer, inputType: InputType.Answer, showReasoning: false};
    history.value.push(aInput);

    isThinking.value = false;
    question.value = '';
}

</script>

<style>
html { 
    overflow-y: hidden 
}

.question {
    text-align: right;
}

.answer {
    text-align: left;
}

.content {
  max-width: 800px;
}

</style>