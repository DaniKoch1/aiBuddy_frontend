<template>
    <v-row class="answers-row" no-gutters>
        <OneRow v-if="mode == ChatMode.Code"
            text=""
            :formatAsQuestion="false"
            :mode="mode"
        >
            <template #customisation>
                <v-card-text class="text-subtitle-1">
                    Following are 3 responses of varying quality - one is correct, one has syntax errors, and one does not follow clean code principles. <br>
                    <b>Try to determine which one is correct and click the button in its upper-right corner to select it.</b>
                </v-card-text>
            </template>
        </OneRow>

        <v-col v-for="(r, i) in responses" :key="r.answer">
            <OneRow :text="r.answer" :formatAsQuestion="false" :mode="mode">
                <template #customisation>
                    <v-card-actions class="pb-0">
                        <v-tooltip text="Click to view the reasoning of the model." location="top">
                            <template #activator="{ props: tooltipProps }">
                                <v-btn
                                    v-bind="tooltipProps"
                                    size="small"
                                    class="pa-0"
                                    icon="fa-solid fa-circle-info"
                                    variant="text"
                                    @click="reasoningOpen[i] = true"
                                />
                            </template>
                        </v-tooltip>
                        <v-card-text class="text-subtitle-1 font-weight-bold pl-0 py-auto">Answer:</v-card-text>
                        <SelectCodeButton v-if="mode == ChatMode.Code" :response="r"/>
                    </v-card-actions>
                </template>
            </OneRow>

            <GenericDialogue
                v-model:showDialog="reasoningOpen[i]!"
                title="Thinking process"
                width="800"
            >
                <FormattedOutput :text="r.reasoning" />
            </GenericDialogue>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { AIResponse } from '@/model/model';
import { ChatMode } from '@/model/model';
import FormattedOutput from './FormattedOutput.vue';
import OneRow from './ConversationItemCard.vue';
import SelectCodeButton from './SelectCodeButton.vue';
import GenericDialogue from './GenericDialogue.vue';

const props = defineProps<{ responses: AIResponse[], mode: ChatMode }>()

const reasoningOpen = reactive<boolean[]>([])

watch(() => props.responses, (newResponses) => {
    newResponses.forEach((_, i) => {
        if (reasoningOpen[i] === undefined) reasoningOpen[i] = false
    })
}, { immediate: true })
</script>
