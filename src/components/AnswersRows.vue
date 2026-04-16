<template>
    <v-row class="answers-row" no-gutters>
        <OneRow v-if="mode == ChatMode.Code" 
            text="" 
            :formatAsQuestion="false"
        >
            <template #customisation>
                <v-card-text class="text-subtitle-1">
                    Following are 3 responses of varying quality - one is correct, one has syntax errors, and one does not follow clean code principles. <br>
                    <b>Try to determine which one is correct and click the button in its upper-right corner to select it.</b>
                </v-card-text>
            </template>
        </OneRow>
        <v-col v-for="r in responses" :key="r.answer">
            <OneRow text="" :formatAsQuestion="false">
                <template #customisation>
                    <v-card-actions class="pa-0">
                        <v-card-text>
                            Show thinking process.
                        </v-card-text>

                        <v-btn
                            class="mr-2"
                            size="x-small"
                            :icon="r.showReasoning
                            ? 'fas fa-chevron-up fa-xs'
                            : 'fas fa-chevron-down fa-xs'"
                            @click="$emit('toggleShowReasoning', r.reasoning)"
                        />
                    </v-card-actions>

                    <v-expand-transition>
                    <div v-show="r.showReasoning">
                        <v-divider />
                        <FormattedOutput :text="r.reasoning" />
                    </div>
                    </v-expand-transition>
                </template>
            </OneRow>
            <OneRow :text="r.answer" :formatAsQuestion="false">
                <template #customisation>
                    <v-card-actions class="mx-auto pb-0">
                        <v-card-text class="text-subtitle-1 font-weight-bold pb-0">Answer:</v-card-text>
                        
                        <SelectCodeButton v-if="mode == ChatMode.Code" :response="r"/>
                    </v-card-actions>
                </template>
            </OneRow>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import type { AIResponse } from '@/model/model';
import { ChatMode } from '@/model/model';
import FormattedOutput from './FormattedOutput.vue';
import OneRow from './ConversationItemCard.vue';
import SelectCodeButton from './SelectCodeButton.vue';

    const props = defineProps<{ responses: AIResponse[], mode: ChatMode }>()

    const emit = defineEmits<{ (e: 'toggleShowReasoning', reasoning: string): void }>();
</script>