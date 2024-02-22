<script lang="ts" setup>
definePageMeta({ middleware: "auth", layout: "admin" });

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data, error, pending, execute, refresh } = await useFetch(
  "/api/admin/components",
  { headers }
);
const components = data.value?.body;
</script>
<template>
  <div>
    <h1 class="text-4xl font-bold">Admin</h1>
    <h2 class="mt-8 text-xl font-bold">Components</h2>
    <ul class="list-inside list-disc mt-4">
      <li v-for="component in components">
        <nuxt-link
          v-if="component"
          :to="{
            name: 'admin-component',
            params: { component: getName(component)?.name },
          }"
          class="underline"
        >
          {{ getName(component)?.name }}
        </nuxt-link>
      </li>
    </ul>
    <nuxt-link
      :to="{ name: 'admin-component', params: { component: 'new' } }"
      class="mt-8 inline-block button"
      >New Component</nuxt-link
    >
    <nuxt-link
      :to="{ name: 'admin-content', params: { content: 'new' } }"
      class="mt-8 inline-block button"
      >New Content</nuxt-link
    >
  </div>
</template>
