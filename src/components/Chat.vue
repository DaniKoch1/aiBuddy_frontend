<template>
    <v-container class="d-flex flex-column" style="height: 100vh">
        <div class="pb-4 d-flex justify-space-between">
            <Greeting :greeting="greeting" :icon="greetingIcon"/> 
            <FollowUpDialogue :followUp="currentFollowUp" v-model:showDialog="showFollowUpDialog" @updateFollowUp="submitFollowUpAnswer"/>
            <AboutDialogue v-model:showDialog="showAboutDialog" />
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
                    </OneRow>
                    <v-row 
                        v-if="item.followUp && item.followUp.lowQuestion && !item.followUp.lowAnswer"
                        justify="end" 
                        no-gutters >
                        <v-col>
                            <div class="mb-2 d-flex float-right">
                                <v-btn @click="showFollowUpDialog = true" color="indigo" variant="tonal">
                                    Click to answer
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
                    </OneRow>
                    <v-row 
                        v-if="item.followUp && item.followUp.highQuestion && !item.followUp.highAnswer"
                        justify="end" 
                        no-gutters >
                        <v-col>
                            <div class="mb-2 d-flex float-right">
                                <v-btn @click="showFollowUpDialog = true" color="indigo" variant="tonal">
                                    Click to answer
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
                        v-if="item.followUp && item.followUp.feedback && item.responses.length > 0"
                        :responses="item.responses"
                        :mode="item.mode"
                        @toggleShowReasoning="callToggleShowReasoning"
                    />
                </div>
            </div>
        </div>
        <div :class="chatHistory?.length ? 'pt-4' : 'my-auto'">
            <QuestionInput
                v-model="question"
                v-model:activeMode="activeMode"
                :loading="isThinking"
                :disabled="!answerSelected"
                :centered="chatHistory?.length === undefined || chatHistory?.length < 1"
                @send-question="sendMessage"
                label="Ask away"
                :color="color"
            />
        </div>
    </v-container>
</template>

<script setup lang="ts">
import Greeting from './Greeting.vue'
import { ref, watch, nextTick, computed, type ComputedRef, onMounted } from 'vue'
import { ChatMode, type Conversation, type FollowUp } from "../model/model"
import QuestionInput from './QuestionInput.vue';
import AnswersRows from './AnswersRows.vue';
import OneRow from './OneRow.vue';
import FollowUpDialogue from './FollowUpDialogue.vue';
import AboutDialogue from './AboutDialogue.vue';
import { addChatToHistory, addFollowUp, getChatContext, getChatHistory, getCurrentFollowUp, toggleShowReasoning } from '@/model/chatManager';
import { codeAnswersStore } from '@/store/store';

let question = ref("");
let activeMode = ref(ChatMode.Understand);
let showFollowUpDialog = ref(false);
let showAboutDialog = ref(false);
const answerSelected = ref(true);
const scrollArea = ref<HTMLElement | null>(null);
const store = codeAnswersStore();

const greeting : string = "Hi, I'm your artificial coding buddy!";
const greetingIcon : string = "fa-solid fa-user-astronaut";
const color : string = "#6b7ad5";

const isThinking: ComputedRef<boolean> = computed(() => {
     if (chatHistory.value && chatHistory.value.length > 0) {
        const currentConv = chatHistory.value[chatHistory.value.length-1];
        if (!currentConv)
            return false;
        return currentConv.question != '' && (currentConv.responses.length == 0 || !currentConv.followUp?.feedback);
     }

    return false;
});

const chatHistory: ComputedRef<Conversation[]> = computed(() => {
    return getChatHistory();
})

const currentFollowUp: ComputedRef<FollowUp> = computed(() => {
    return getCurrentFollowUp();
});

watch(() => chatHistory.value?.length, async () => {
  await nextTick()

  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  }
}, { deep: true });

watch(() => store.answerSelected, (newVal) => {
    answerSelected.value = newVal;
});

onMounted(() => {
    showAboutDialog.value = true;
});

async function sendMessage() {
    console.log("You asked:", question.value);
    if (!question.value) return;

    const qInput: Conversation = {mode: activeMode.value, question: question.value, responses: []};
    addChatToHistory(qInput);

    submitFollowUpAnswer({});

    let aResponse;
    switch (activeMode.value) {
        case ChatMode.Understand:
            aResponse = await fetch("http://localhost:5000/askUnderstand", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({chatContext: getChatContext()})
            });
            break;
        case ChatMode.Code:
            aResponse = await fetch("http://localhost:5000/askCode", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({chatContext: getChatContext()})
            });
            break;
        case ChatMode.CodeReview:
            aResponse = await fetch("http://localhost:5000/requestReview", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({code: question.value})
            });
            break;
    }

    if (aResponse.status === 200) {
        const message = await aResponse.json();
        const currentConv : Conversation = getChatHistory().pop()!;
        currentConv!.responses = message.responses;
        addChatToHistory(currentConv);
        if (currentConv.mode == ChatMode.Code)
            store.setAnswerSelected(false);
    } else {
        alert('The LLM reported an error. Error code: ' + aResponse.status + ' ' + aResponse.statusText + '. Please contact dkoch24@student.aau.dk and report the error.');
    }
    
    question.value = '';
}

async function submitFollowUpAnswer(followUp: FollowUp) {
    let response;
    const currentConversation: Conversation = getChatHistory()[getChatHistory().length-1]!;

    switch (currentConversation.mode) {
        case ChatMode.CodeReview:
            response = await fetch("http://localhost:5000/converseCodeReview", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({followUp: followUp, code: currentConversation.question})
            });
            break;
        default:
            response = await fetch("http://localhost:5000/converseSocratically", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({followUp: followUp, chatContext: getChatContext()})
            });
            break;
    }

    if (response.status === 200)
    {
        const message = await response.json();
        const newFollowUp = message.followUp;
        addFollowUp(newFollowUp);

        if (!getChatHistory()![getChatHistory()!.length -1]?.followUp!.highAnswer) {
            showFollowUpDialog.value = true;
        }
    }
}

async function callToggleShowReasoning(reasoning: string) {
    toggleShowReasoning(reasoning);
}

</script>

<style src="../style/style.css"/>