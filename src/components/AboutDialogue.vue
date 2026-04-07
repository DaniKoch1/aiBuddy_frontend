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
            This prototype is an educational GenAI application supporting learning to code. It aims to foster critical thinking, while still providing ready to use information. <br/>
            Main features:
            <ul>
                <li>Thinking process providing transparency over how the AI reached its answer.</li>
                <li>Follow up questions encouraging users to ideate alongside with the AI.</li>
                <li>Multiple code responses of varying quality encouraging evaluation of the AI generated code.</li>
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