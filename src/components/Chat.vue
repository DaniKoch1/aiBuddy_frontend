<template>
    <v-container class="d-flex flex-column" style="height: 100vh">
        <div class="pb-4 d-flex justify-space-between">
            <Greeting :greeting="greeting" :icon="greetingIcon"/>
            <CustomRouter :url="routerUrl" :icon="routerIcon" :text="routerText"/>
        </div>
        <div ref="scrollArea" :class="chatHistory?.length ? 'flex-grow-1 overflow-y-auto' : ''">
            <div class="content mx-auto">
                <div v-for="item in chatHistory" :key="item.question">
                    <QuestionRow :question="item.question"/>
                    <AnswersRows 
                        :responses="item.responses"
                        @toggleShowReasoning="toggleShowReasoning"
                    />
                </div>
            </div>
        </div>
        <div :class="chatHistory?.length ? 'pt-4' : 'my-auto'">
            <QuestionInput
                v-model="question"
                v-model:switchValue="generateCode"
                :loading="isThinking"
                :centered="chatHistory?.length === undefined || chatHistory?.length < 1"
                @send-question="sendMessage"
                label="Ask away"
                switchLabel="Generate Code"
                :color="color"
            />
        </div>
    </v-container>
</template>

<script setup lang="ts">
import Greeting from './Greeting.vue'
import { ref, watch, nextTick, onMounted } from 'vue'
import { type Conversation } from "../model/model"
import CustomRouter from './CustomRouter.vue';
import QuestionRow from './QuestionRow.vue';
import QuestionInput from './QuestionInput.vue';
import AnswersRows from './AnswersRows.vue';

let question = ref("");
let isThinking = ref(false);
let generateCode = ref(false);
const chatHistory = ref<[Conversation]>();
const AIEnabled = true;
const scrollArea = ref<HTMLElement | null>(null);

const greeting : string = "Hi, I'm your artificial coding buddy!";
const greetingIcon : string = "fa-solid fa-user-astronaut";
const routerIcon = "fa-solid fa-ranking-star";
const routerUrl : string = "/codereviews";
const routerText : string = "Reviews";
const color : string = "#6b7ad5";

watch(() => chatHistory.value?.length, async () => {
  await nextTick()

  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  }
}, { deep: true })

onMounted(async () => {
    console.log(`the component is now mounted.`)
    const response = await fetch("http://localhost:5000/chatHistory", {
        method: "GET",
        headers: {
        "Content-Type": "application/json"
        },
    })
    if (response.status === 200)
    {
        const message = await response.json();
        console.log(message);
        chatHistory.value = message.chatHistory;
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
        chatHistory.value = message.chatHistory;

        let aResponse;
        if (AIEnabled) {
            aResponse = await fetch("http://localhost:5000/respond", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({generateCode: generateCode.value})
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
            chatHistory.value = message.chatHistory;
        } else {
            alert('The LLM reported an error. Error code: ' + aResponse.status + ' ' + aResponse.statusText + '. Please contact dkoch24@student.aau.dk and report the error.');
        }
    } else {
        alert('The backend reported an error. Error code: ' + qResponse.status + ' ' + qResponse.statusText + '. Please contact dkoch24@student.aau.dk and report the error.');
    }

    
    isThinking.value = false;
    question.value = '';
}

async function toggleShowReasoning(reasoning: string) {
    let response;

    response = await fetch("http://localhost:5000/toggleShowChatReasoning", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({reasoning})
    })

    if (response.status === 200)
    {
        const message = await response.json();
        chatHistory.value = message.chatHistory;
    }
}

</script>

<style src="../style/style.css"/>