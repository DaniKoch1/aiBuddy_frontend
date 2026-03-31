<template>
    <v-row class="answers-row" no-gutters>
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
            <OneRow :text="r.answer" :formatAsQuestion="false"/>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import type { AIResponse } from '@/model/model';
import FormattedOutput from './FormattedOutput.vue';
import OneRow from './ConversationItemCard.vue';

    const props = defineProps<{ responses: AIResponse[] }>()

    const emit = defineEmits<{ (e: 'toggleShowReasoning', reasoning: string): void }>();
</script>