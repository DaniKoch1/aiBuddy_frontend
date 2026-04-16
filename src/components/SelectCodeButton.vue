<template>
    <v-tooltip :text="toolTipText">
        <template #activator="{ props }">
            <v-btn 
                v-bind="props" 
                :icon="icon"
                size="x-small"
                variant="outlined"
                class="pb-0"
                :color="color"
                @click="validate"
            ></v-btn>
        </template>
    </v-tooltip>
</template>

<script setup lang="ts">
import type { AIResponse } from '@/model/model';
import { codeAnswersStore } from '@/store/store';
import { ref } from 'vue';

    const props = defineProps<{
        response: AIResponse;
    }>();

    const icon = ref("");
    const toolTipText = ref("Set as Correct");
    const color = ref("");
    const store = codeAnswersStore();

    function validate() {
        if (props.response.isCorrect) {
            icon.value = "fa-solid fa-check";
            toolTipText.value = "You're right, this is the correct response!";
            color.value = "green";
            store.setAnswerSelected(true);

        } else {
            icon.value = "fa-solid fa-xmark";
            toolTipText.value = "This is not correct. Try again.";
            color.value = "red";
        }
    };
</script>