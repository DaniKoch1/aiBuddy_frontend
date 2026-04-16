<template>
    <v-card
        class = "mb-2"
        :class="formatAsQuestion ? 'question' : 'answer'"
        color="indigo"
        :variant="formatAsQuestion ? 'tonal' : 'outlined'"
        density="compact"
    >
        <div v-if="$slots.customisation" class="customisation">
            <slot name="customisation" />
        </div>

        <FormattedOutput v-if="text" :text="text"/>
    </v-card>
</template>

<script setup lang="ts">
import FormattedOutput from './FormattedOutput.vue';
    
    const props = defineProps<{ text: string, formatAsQuestion: boolean, type?: string}>()
</script>