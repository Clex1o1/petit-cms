<script lang="ts" setup>
const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const allExistingcomponents = useFetch("/api/admin/relations", { headers }).data
  .value?.body;
</script>
<template>
  {{ allExistingcomponents }}
  <!-- <FormKit type="select" :options=""  /> -->
</template>
