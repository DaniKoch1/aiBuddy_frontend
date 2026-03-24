<template>
    <v-container class="d-flex flex-column" style="height: 100vh">
        <div class="pb-4 d-flex justify-space-between">
            <Greeting :greeting="greeting" :icon="greetingIcon"/>
            <CustomRouter :url="routerUrl" :icon="routerIcon" :text="routerText"/>
        </div>
        <div ref="scrollArea" :class=" reviewHistory?.length ? 'flex-grow-1 overflow-y-auto' : ''">
            <div class="content mx-auto">
                <div v-for="item in reviewHistory" :key="item.question">
                    <QuestionRow :question="item.question"/>
                    <AnswersRows 
                        :responses="item.responses"
                        @toggleShowReasoning="toggleShowReasoning"
                    />
                </div>
            </div>
        </div>
        <div :class="reviewHistory?.length ? 'pt-4' : 'my-auto'">
            <QuestionInput
                v-model="question"
                v-model:switchValue="codeReview"
                :loading="isThinking"
                :centered="reviewHistory?.length === undefined || reviewHistory?.length < 1"
                @send-question="sendMessage"
                label="Enter your code"
                switchLabel="Code Review"
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
let codeReview = ref(false);
const reviewHistory = ref<[Conversation]>();
const scrollArea = ref<HTMLElement | null>(null);

const greeting : string = "Code Reviews";
const greetingIcon : string = "fa-solid fa-ranking-star";
const routerIcon : string = "fa-solid fa-user-astronaut";
const routerUrl : string = "/";
const routerText : string = "Chat";
const color : string = "#6b7ad5";

watch(() => reviewHistory.value?.length, async () => {
  await nextTick()

  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  }
}, { deep: true })

onMounted(async () => {
    console.log(`the review component is now mounted.`)
    const response = await fetch("http://localhost:5000/reviewHistory", {
        method: "GET",
        headers: {
        "Content-Type": "application/json"
        },
    })
    if (response.status === 200)
    {
        const message = await response.json();
        console.log(message);
        reviewHistory.value = message.reviewHistory;
    }
})

async function sendMessage() {
    console.log("You asked:", question.value);
    if (!question.value) return;

    isThinking.value = true;

    const qResponse = await fetch("http://localhost:5000/askCodeReview", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(question.value)
    })

    if (qResponse.status === 200)
    {
        const message = await qResponse.json();
        reviewHistory.value = message.reviewHistory;

        let aResponse;
        // if (AIEnabled) {
            aResponse = await fetch("http://localhost:5000/codeReview", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({code: question.value})
            })
        // }

        if (aResponse.status === 200) {
            const message = await aResponse.json();
            console.log(message);
            reviewHistory.value = message.reviewHistory;
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

    response = await fetch("http://localhost:5000/toggleShowReviewReasoning", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({reasoning})
    })

    if (response.status === 200)
    {
        const message = await response.json();
        reviewHistory.value = message.reviewHistory;
    }
}

</script>

<style src="../style/style.css"/>