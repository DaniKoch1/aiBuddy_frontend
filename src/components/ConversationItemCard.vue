<template>
    <v-card
        class="mb-2"
        :class="formatAsQuestion ? 'question' : 'answer'"
        :color="cardColor"
        :variant="cardVariant"
        density="compact"
    >
        <div v-if="$slots.customisation" class="customisation">
            <slot name="customisation" />
        </div>

        <FormattedOutput v-if="text" :text="text"/>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChatMode } from '@/model/model';
import FormattedOutput from './FormattedOutput.vue';

const props = defineProps<{
    text: string
    formatAsQuestion: boolean
    type?: string
    mode?: ChatMode
    isFollowUp?: boolean
}>()

function modeToColorKey(mode: ChatMode): string {
    switch (mode) {
        case ChatMode.Understand:  return 'understand'
        case ChatMode.Code:        return 'generate-code'
        case ChatMode.CodeReview:  return 'code-review'
    }
}

const cardColor = computed(() =>
    props.mode ? modeToColorKey(props.mode) : 'generate-code'
)

const cardVariant = computed(() =>
    props.isFollowUp ? 'outlined' : 'tonal'
)
</script>

<style scoped>
:deep(.v-card-text) {
  color: rgba(var(--v-theme-on-background), 0.87);
}
</style>
