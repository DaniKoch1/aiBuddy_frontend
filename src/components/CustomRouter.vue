<template>
    <RouterLink :to="url">
        <v-btn 
            :prepend-icon="icon" 
            stacked 
            variant="text"
            density="comfortable"
            size="small"
        >
            {{ text }}
        </v-btn>
    </RouterLink>
</template>

<script setup lang="ts">
    const props = defineProps<{ url: string, icon: string, text: string }>()
</script>