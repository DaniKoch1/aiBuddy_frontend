<template>
  <div class="text-center pa-4">
    <v-dialog v-model="showDialog" :width="width">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          {{ title }}
          <v-btn
            size="small"
            icon="fa-solid fa-xmark"
            variant="text"
            @click="showDialog = false"
          />
        </v-card-title>
        <v-card-text>
          <slot />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  showDialog: boolean
  title: string
  width?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:showDialog', value: boolean): void
}>()

const showDialog = computed({
  get: () => props.showDialog,
  set: (value) => emit('update:showDialog', value)
})
</script>
