<template>
    <v-row justify="end">
        <v-col cols="8">
            <v-card
                class = "mb-2 question"
                color="indigo"
                variant="tonal"
            >
                <FormattedOutput :text="question"/>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import FormattedOutput from './FormattedOutput.vue';
    
    const props = defineProps<{ question: string }>()
</script>