<template>
        <div class="content mx-auto">
            <v-textarea
                :label="label"
                variant="outlined"
                auto-grow
                rows="1"
                hide-details="auto"
                max-rows="6"
                :append-inner-icon="loading ? 'fa-solid fa-spinner fa-spin-pulse' : 'fas fa-arrow-up'"
                :disabled="loading"
                v-model="modelValue"
                @click:append-inner="$emit('send-question')"
                @keypress.enter.exact.prevent="$emit('send-question')"
            ></v-textarea>
            <v-row>
                <v-col cols="6" class="ma-0 pa-0" >
                    <v-select
                        v-model="activeMode"
                        :items="modes"
                        style="transform: scale(0.9); width: 200px"
                        variant="underlined"
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" title="">
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="6">
                    <p class="text-right font-weight-light text-medium-emphasis" style="font-size: small">
                        Press enter to send.
                    </p>
                </v-col>
            </v-row>
        </div>
</template>

<script setup lang="ts">
import { ChatMode } from '@/model/model';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  activeMode: ChatMode;
  loading: boolean;
  label: string;
  color: string;
}>();

const modes : string[] = [ChatMode.Understand, ChatMode.Code, ChatMode.CodeReview];

const label = computed(() => {
    switch (activeMode.value) {
        case ChatMode.Understand:
            return "Ask away";
        case ChatMode.Code:
            return "Describe your implementation requirements";
        case ChatMode.CodeReview:
            return "Paste your code here";
    }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:activeMode', value: ChatMode): void;
  (e: 'send-question'): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const activeMode = computed({
  get: () => props.activeMode,
  set: (value) => emit('update:activeMode', value)
});

</script>