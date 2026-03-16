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
                                @click="toggleShowReasoning(item)"
                            ></v-btn>
                        </v-card-actions>
                        <v-expand-transition>
                            <div v-show="item.showReasoning">
                                <v-divider></v-divider>
                                <FormattedOutput :text="item.text"/>
                            </div>
                        </v-expand-transition>
                    </v-card>
                    <v-card
                        v-else
                        class = "mb-2"
                        color="indigo"
                        :variant="item.inputType == InputType.Question ? 'tonal' : 'outlined'"
                        :class="item.inputType == InputType.Question ? 'question' : 'answer'"
                    >
                        <FormattedOutput :text="item.text"/>
                    </v-card>
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
                    hide-details="auto"
                    max-rows="6"
                    :append-inner-icon="isThinking ? 'fas fa-lightbulb fa-fade' : 'fas fa-arrow-up'"
                    :disabled="isThinking"
                    v-model="question"
                    @click:append-inner="sendMessage"
                    @keypress.enter.exact="sendMessage"
                ></v-textarea>
                <p class="text-right font-weight-light text-medium-emphasis" style="font-size: small">
                    Press enter to send.
                </p>
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import Greeting from './Greeting.vue'
import FormattedOutput from './FormattedOutput.vue';
import { ref, watch, nextTick, onMounted } from 'vue'
import { type HistoryItem, InputType } from "../model/model"

let question = ref("");
const history = ref<[HistoryItem]>();
let isThinking = ref(false);
const AIEnabled = true;
const generateCode = true;
const scrollArea = ref<HTMLElement | null>(null);

watch(() => history.value?.length, async () => {
  await nextTick()

  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  }
}, { deep: true })

onMounted(async () => {
    console.log(`the component is now mounted.`)
    const response = await fetch("http://localhost:5000/history", {
        method: "GET",
        headers: {
        "Content-Type": "application/json"
        },
    })
    if (response.status === 200)
    {
        const message = await response.json();
        console.log(message);
        history.value = message.history;
    }
})

async function sendMessage() {
    console.log("You asked:", question.value);
    if (!question.value) return;

    isThinking.value = true;

    const qResponse = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(question.value)
    })

    if (qResponse.status === 200)
    {
        const message = await qResponse.json();
        history.value = message.history;

        let aResponse;
        if (AIEnabled) {
            aResponse = await fetch("http://localhost:5000/respond", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({generateCode: generateCode})
            })
        } else {
            await new Promise(f => setTimeout(f, 1500));
            aResponse = await fetch("http://localhost:5000/noAI", {
                method: "GET",
                headers: {
                "Content-Type": "application/json"
                }
            })
        }

        if (aResponse.status === 200) {
            const message = await aResponse.json();
            console.log(message);
            history.value = message.history;
        } else {
            alert('The LLM reported an error. Error code: ' + aResponse.status + ' ' + aResponse.statusText + '. Please contact dkoch24@student.aau.dk and report the error.');
        }
    } else {
        alert('The backend reported an error. Error code: ' + qResponse.status + ' ' + qResponse.statusText + '. Please contact dkoch24@student.aau.dk and report the error.');
    }

    
    isThinking.value = false;
    question.value = '';
}

async function toggleShowReasoning(item : HistoryItem) {
    let response;

    response = await fetch("http://localhost:5000/toggleShowReasoning", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(item.text)
    })

    if (response.status === 200)
    {
        const message = await response.json();
        history.value = message.history;
    }
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