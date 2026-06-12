<template>
    <h1><i :class="icon"/> {{ greeting }} </h1>
</template>

<script setup lang="ts">
    const props = defineProps<{ greeting: string, icon: string }>()
</script>