<template>
    <v-row :justify="formatAsQuestion ? 'end' : 'start'" no-gutters>
        <v-col cols="8">
            <ConversationItemCard
                :text="text"
                :formatAsQuestion="formatAsQuestion"
                :type="type"
                :mode="mode"
                :isFollowUp="isFollowUp"
            >
                <template #customisation>
                    <slot name="customisation" />
                </template>
            </ConversationItemCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ChatMode } from '@/model/model';
import ConversationItemCard from './ConversationItemCard.vue';

const props = defineProps<{
    text: string
    formatAsQuestion: boolean
    type?: string
    mode?: ChatMode
    isFollowUp?: boolean
}>()
</script>
