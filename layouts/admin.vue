<script lang="ts" setup>
const router = useRouter();
</script>
<template>
  <div class="p-4 flex flex-1 flex-col h-full">
    <nuxt-link @click="router.back()" class="cursor-pointer">Back</nuxt-link>
    <div class="mt-4 flex flex-1 flex-col">
      <slot />
    </div>
  </div>
</template>
<style>
html,
body,
#__nuxt {
  @apply flex flex-1 flex-col h-full;
}

.button {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
</style>
