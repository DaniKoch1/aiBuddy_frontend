<template>
    <v-container class="d-flex flex-column" style="height: 100vh">
        <div class="pb-4 d-flex justify-space-between">
            <h1><i class="fa-solid fa-ranking-star"  style="color: #6b7ad5"/> Code Reviews </h1>
            <v-btn 
                prepend-icon="fa-solid fa-user-astronaut" 
                stacked 
                variant="text"
                density="comfortable"
                size="small"
            >
            <RouterLink to="/">
                Chat
            </RouterLink>
            </v-btn>
        </div>
        <v-card
            class = "mb-2 question"
            color="indigo"
            variant="tonal"
        >
            <FormattedOutput :text="code"/>
        </v-card>
        <v-textarea
            label="Enter your code"
            variant="outlined"
            auto-grow
            rows="1"
            hide-details="auto"
            append-inner-icon="fas fa-arrow-up"
            v-model="code"
        ></v-textarea>
        <p class="text-right font-weight-light text-medium-emphasis" style="font-size: small">
            Press enter to send.
        </p>
    </v-container>
</template>

<script setup lang="ts">
import FormattedOutput from './FormattedOutput.vue';
import { ref } from 'vue'

let code = ref("");


</script>