<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="showDialog"
      width="auto"
    >
    <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
            About
            <v-btn
                size="small"
                icon="fa-solid fa-xmark"
                variant="text"
                @click="showDialog = false"
            ></v-btn>
        </v-card-title>
        <v-card-text>
            This prototype aims to help you to learn coding by answering your questions, while engaging you in critical evaluation of them. <br/>
            It does so by:
            <ul>
                <li>Thinking process - it allows you to understand how the AI reached its answer. Make sure to read it if you are curious about the background of the answer or 
                    suspect a mistake in it.</li>
                <li>Follow up questions - they help you to think independently about the answer by asking you guiding questions. 
                    This is crucial for your engagement with the topic.</li>
                <li>Multiple code responses - they help you to familiarize yourself with different code and to evaluate it.
                    The code has varying quality, so be sure to either choose the correct one or to correct the one you chose!</li>
                <li>Code reviews – tbd.</li>
            </ul>
        </v-card-text>
    </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

    const props = defineProps<{ showDialog: boolean }>();

    const emit = defineEmits<{
    (e: 'update:showDialog', value: boolean): void;
    }>();

    const showDialog = computed({
    get: () => props.showDialog,
    set: (value) => emit('update:showDialog', value)
    });

</script>