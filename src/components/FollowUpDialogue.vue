<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="showDialog"
      width="auto"
    >
    <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
            Question
            <v-btn
                size="small"
                icon="fa-solid fa-angle-down"
                variant="text"
                @click="showDialog = false"
            ></v-btn>
        </v-card-title>
        <v-card-text>
            <ul>
                <li v-if="followUp.lowQuestion"> {{ followUp.lowQuestion }} </li>
                <li v-if="followUp.lowAnswer && followUp.highQuestion"> {{ followUp.lowAnswer }} </li>
                <li v-if="followUp.lowAnswer && followUp.highQuestion"> {{ followUp.highQuestion }} </li>
            </ul>
            <v-textarea
                label="Answer to reveal my response"
                variant="underlined"
                auto-grow
                rows="1"
                hide-details="auto"
                max-rows="6"
                v-model="answer"
                @keypress.enter.exact.prevent="sendNewAnswer(); showDialog = false"
            ></v-textarea>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                text="Submit"
                @click="sendNewAnswer(); showDialog = false"
            ></v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
    import type { FollowUp } from '@/model/model';
import { computed, ref } from 'vue';
    const props = defineProps<{ followUp: FollowUp, showDialog: boolean }>();

    const newLowAnswer = ref('');
    const newHighAnswer = ref('');

    const answer = computed({
        get() {
            return props.followUp.highQuestion ? newHighAnswer.value : newLowAnswer.value
        },
        set(value) {
            if (props.followUp.highQuestion) {
                newHighAnswer.value = value
            } else {
                newLowAnswer.value = value
            }
        }
    })

    const emit = defineEmits<{
    (e: 'update:showDialog', value: boolean): void;
    (e: 'updateFollowUp', value: FollowUp): void;
    }>();

    const showDialog = computed({
    get: () => props.showDialog,
    set: (value) => emit('update:showDialog', value)
    });

    function sendNewAnswer() {
        let newFollowUp: FollowUp = props.followUp;
        newFollowUp.lowAnswer = newLowAnswer.value;
        newFollowUp.highAnswer = newHighAnswer.value;
        emit('updateFollowUp', newFollowUp);
        if (newLowAnswer.value && newHighAnswer.value) {
            newLowAnswer.value = '';
            newHighAnswer.value = '';
        }
    }
</script>