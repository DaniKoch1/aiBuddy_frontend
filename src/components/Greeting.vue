<template>
    <h1><i :class="icon"  style="color: #6b7ad5"/> {{ greeting }} </h1>
</template>

<script setup lang="ts">
    const props = defineProps<{ greeting: string, icon: string }>()
</script>