<script lang="ts" setup>
definePageMeta({ middleware: "auth" });

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data, error, pending, execute, refresh } = await useFetch(
  "/api/admin/structs",
  { headers }
);
const blueprints = data.value?.body;

function splitStruct(struct: string) {
  return {
    name: struct.split(":").pop()?.split(".")[0],
  };
}
</script>
<template>
  <h1>Admin</h1>
  <ul>
    <li v-for="struct in blueprints">
      <nuxt-link :to="splitStruct(struct).name">
        {{ splitStruct(struct).name }}
      </nuxt-link>
    </li>
  </ul>
  <pre>
    {{ blueprints }}
  </pre>
</template>
