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
                @keypress.enter.exact="$emit('send-question')"
            ></v-textarea>
            <v-row>
                <v-col cols="6" class="ma-0 pa-0" >
                    <v-switch 
                        :label=switchLabel
                        density="compact"
                        style="transform: scale(0.9);"
                        class="pt-2" 
                        hide-details="auto"
                        :color="color"
                        v-model="switchValue"
                    >
                    </v-switch>
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
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  switchValue: boolean;
  loading: boolean;
  label: string;
  switchLabel: string;
  color: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:switchValue', value: boolean): void;
  (e: 'send-question'): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const switchValue = computed({
  get: () => props.switchValue,
  set: (value) => emit('update:switchValue', value)
});

</script>