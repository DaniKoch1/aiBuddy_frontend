<template>
    <v-container class="d-flex flex-column" style="height: 100vh">
        <div class="pb-4 d-flex justify-space-between">
            <Greeting :greeting="greeting" :icon="greetingIcon"/> 
            <FollowUpDialogue :followUp="currentFollowUp" v-model:showDialog="showFollowUpDialog" @updateFollowUp="submitFollowUpAnswer"/>
            <AboutDialogue v-model:showDialog="showAboutDialog" />
            <CustomRouter v-if="codeReviewsEnabled" :url="routerUrl" :icon="routerIcon" :text="routerText"/>
            <v-btn variant="outlined" color="indigo" @click="showAboutDialog = true">About</v-btn>
        </div>
        <div ref="scrollArea" :class="chatHistory?.length ? 'flex-grow-1 overflow-y-auto' : ''">
            <div class="content mx-auto">
                <div v-for="item in chatHistory" :key="item.question">
                    <OneRow 
                        :text="item.question" 
                        :formatAsQuestion="true"
                    />
                    <OneRow 
                        v-if="item.followUp && item.followUp.lowQuestion"
                        :text="item.followUp.lowQuestion" 
                        :formatAsQuestion="false" 
                    />
                    <OneRow 
                        v-if="item.followUp && item.followUp.lowAnswer"
                        :text="item.followUp.lowAnswer" 
                        :formatAsQuestion="true" >
                        <!-- <template v-if="!item.followUp.lowAnswer" #customisation>
                            <EditButton @showDialog="showDialog = $event" />
                        </template> -->
                    </OneRow>
                    <v-row 
                        v-if="item.followUp && item.followUp.lowQuestion && !item.followUp.lowAnswer"
                        justify="end" 
                        no-gutters >
                        <v-col>
                            <div class="mb-2 d-flex float-right">
                                <v-btn @click="showFollowUpDialog = true" color="indigo" variant="tonal">
                                    Answer
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                    <OneRow 
                        v-if="item.followUp && item.followUp.highQuestion"
                        :text="item.followUp.highQuestion" 
                        :formatAsQuestion="false" 
                    />
                    <OneRow 
                        v-if="item.followUp && item.followUp.highAnswer"
                        :text="item.followUp.highAnswer" 
                        :formatAsQuestion="true" >
                        <!-- <template v-if="!item.followUp.highAnswer" #customisation>
                            <EditButton @showDialog="showDialog = $event" />
                        </template> -->
                    </OneRow>
                    <v-row 
                        v-if="item.followUp && item.followUp.highQuestion && !item.followUp.highAnswer"
                        justify="end" 
                        no-gutters >
                        <v-col>
                            <div class="mb-2 d-flex float-right">
                                <v-btn @click="showFollowUpDialog = true" color="indigo" variant="tonal">
                                    Answer
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                    <OneRow 
                        v-if="item.followUp && item.followUp.feedback"
                        :text="item.followUp.feedback" 
                        :formatAsQuestion="false" 
                    />
                    <AnswersRows 
                        v-if="item.followUp && item.followUp.feedback"
                        :responses="item.responses"
                        @toggleShowReasoning="toggleShowReasoning"
                    />
                    <!-- <OneRow 
                        v-else-if="item.responses"
                        text="Answer these 2 questions to reveal my response." 
                        :formatAsQuestion="false"
                    /> -->
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
import { ref, watch, nextTick, onMounted, computed, type ComputedRef } from 'vue'
import { type Conversation, type FollowUp } from "../model/model"
import CustomRouter from './CustomRouter.vue';
import QuestionInput from './QuestionInput.vue';
import AnswersRows from './AnswersRows.vue';
import OneRow from './OneRow.vue';
import FollowUpDialogue from './FollowUpDialogue.vue';
import AboutDialogue from './AboutDialogue.vue';

let question = ref("");
let generateCode = ref(false);
let showFollowUpDialog = ref(false);
let showAboutDialog = ref(false);
const chatHistory = ref<[Conversation]>();
const scrollArea = ref<HTMLElement | null>(null);

const codeReviewsEnabled = false;
const greeting : string = "Hi, I'm your artificial coding buddy!";
const greetingIcon : string = "fa-solid fa-user-astronaut";
const routerIcon = "fa-solid fa-ranking-star";
const routerUrl : string = "/codereviews";
const routerText : string = "Reviews";
const color : string = "#6b7ad5";

const currentFollowUp: ComputedRef<FollowUp> = computed(() => {
    if (chatHistory.value && chatHistory.value.length > 0)
        return chatHistory.value[chatHistory.value.length-1]?.followUp ?? {};

    return {};
});

const isThinking: ComputedRef<boolean> = computed(() => {
     if (chatHistory.value && chatHistory.value.length > 0) {
        const currentConv = chatHistory.value[chatHistory.value.length-1];
        if (!currentConv)
            return false;
        return currentConv.question != '' && (currentConv.responses.length == 0 || !currentConv.followUp?.feedback);
     }

    return false;
});


watch(() => chatHistory.value?.length, async () => {
  await nextTick()

  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  }
}, { deep: true })

onMounted(async () => {
    const response = await fetch("/chatHistory", {
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

    const qResponse = await fetch("/ask", {
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

        submitFollowUpAnswer({});

        const aResponse = await fetch("/respond", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({generateCode: generateCode.value})
        })

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
    
    question.value = '';
}

async function submitFollowUpAnswer(followUp: FollowUp) {
    const response = await fetch("/converseSocratically", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({followUp: followUp})
    })

    if (response.status === 200)
    {
        const message = await response.json();
        chatHistory.value = message.chatHistory;
        console.log(chatHistory.value);
    }
}

async function toggleShowReasoning(reasoning: string) {
    const response = await fetch("/toggleShowChatReasoning", {
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