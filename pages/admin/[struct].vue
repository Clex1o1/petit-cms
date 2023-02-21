<script lang="ts" setup>
definePageMeta({ middleware: "auth" });

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const struct = useRoute().params.struct;
const { data, error, pending, execute, refresh } = await useFetch(
  "/api/admin/structs/" + struct,
  { headers }
);
</script>
<template>
  <h1>Structs</h1>
  <FormKitSchema :schema="data.body" />
</template>
