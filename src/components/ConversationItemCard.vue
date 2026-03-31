<template>
    <v-card
        class = "mb-2"
        :class="formatAsQuestion ? 'question' : 'answer'"
        color="indigo"
        :variant="formatAsQuestion ? 'tonal' : 'outlined'"
    >
        <FormattedOutput v-if="text" :text="text"/>

        <div v-if="$slots.customisation" class="customisation">
            <slot name="customisation" />
        </div>
    </v-card>
</template>

<script setup lang="ts">
import FormattedOutput from './FormattedOutput.vue';
    
    const props = defineProps<{ text: string, formatAsQuestion: boolean, type?: string}>()
</script>