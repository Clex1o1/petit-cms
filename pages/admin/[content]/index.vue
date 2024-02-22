<script lang="ts" setup>
import draggable from "vuedraggable";
import { until } from "@vueuse/core";
import { ValueOf } from "next/dist/shared/lib/constants";
import { vOnClickOutside } from "@vueuse/components";
definePageMeta({ middleware: "auth", layout: "admin" });
const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const router = useRouter();
const route = useRoute();
</script>
<template></template>
