<template>
    <v-tooltip text="Edit">
        <template #activator="{ props }">
            <v-btn
                v-bind="props" 
                icon="fa-solid fa-pen" 
                size="x-small" 
                color="indigo" 
                variant="text"
                @click="sendShowDialog">
            </v-btn>
        </template>
    </v-tooltip>
</template>

<script setup lang="ts">
const emit = defineEmits(['showDialog'])

    function sendShowDialog() {
        emit('showDialog', true)
    }
</script>