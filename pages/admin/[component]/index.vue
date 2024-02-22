<script lang="ts" setup>
import draggable from "vuedraggable";
import { until } from "@vueuse/core";
import { ValueOf } from "next/dist/shared/lib/constants";
import { vOnClickOutside } from "@vueuse/components";
definePageMeta({ middleware: "auth", layout: "admin" });
const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const router = useRouter();
const route = useRoute();

const componentId = ref(route.params.component);
const schema = ref<Array<Field | CMSComponent>>([]);
const component = reactive({
  name: "",
});

if (componentId.value && componentId.value !== "new") {
  const { data, error, pending, execute, refresh } = await useFetch(
    "/api/admin/component/" + componentId.value,
    { headers }
  );

  schema.value = data.value?.body?.schema ?? [];
  component.name = data.value?.body?.name ?? "";
}

type Field = {
  $formkit?: ValueOf<typeof fields>;
  name?: string;
  label?: string;
  placeholder?: string;
  validation?: string;
  options?: string[] | string;
};

enum Fields {
  "text",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "date",
}

interface CMSComponent {
  $cmp: string;
  name: string;
  label: string;
  solo: boolean;
  schema: Schema[];
}

interface Schema {
  $formkit?: string;
  $el?: string;
  $cmp?: string;
  name: string;
  label?: string;
  placeholder?: string;
  validation?: string;
  options?: string[];
}

// allowed components (fields)
const fields = new Set([
  "text",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "date",
]);

// schema for each field you want to add to a component
const fieldSchema = computed(() => [
  {
    $formkit: "text",
    name: "name",
    label: "Name",
    validation: "required",
  },
  {
    $formkit: "text",
    name: "label",
    label: "Label",
    validation: "required",
  },
  {
    $formkit: "text",
    name: "placeholder",
    label: "Placeholder",
    validation: "required",
  },
  {
    $formkit: "text",
    name: "validation",
    label: "Validation",
    validation: "required",
  },
  {
    $formkit: "textarea",
    name: "options",
    label: "Options",
    validation: "required",
    if: "localState.fieldData && isOptionField(localState.fieldData)",
  },
]);

const localState = reactive<{
  ui: {
    drag: boolean;
    addField: boolean;
    selectValues: boolean;
    selectComponent: boolean;
  };
  field: ValueOf<typeof fields> | null;
  fieldData: Field | null;
}>({
  ui: {
    drag: false,
    addField: false,
    selectValues: false,
    selectComponent: false,
  },

  field: null,
  fieldData: null,
});

const components = await useFetch("/api/admin/components", {
  headers,
}).then((res) =>
  res.data.value?.body.filter((c) => {
    if (getName(c)?.name === component.name) return false;
    return true;
  })
);

async function resolveComponents(schema: Array<Schema | CMSComponent>) {
  if (!schema) return [];
  return schema.map(async (field) => {
    if (field.$cmp) {
      const { data: cmp } = await useFetch(
        "/api/admin/component/" + field.$cmp,
        {
          headers,
        }
      );
      console.log(cmp);
      if (cmp.value?.body) {
        console.log(cmp);
        return {
          ...cmp.value.body,
          schema: await Promise.all(
            await resolveComponents(cmp.value.body.schema)
          ),
        };
      }
    }
    return field;
  });
}

const resolvedSchema = ref<Array<Schema | CMSComponent>>();

watch(
  schema,
  async (schema) => {
    resolvedSchema.value = await Promise.all(await resolveComponents(schema));
  },
  { immediate: true }
);

async function addComponent(field: ValueOf<typeof fields> | CMSComponent) {
  // if adding a existing component
  if (typeof field === "object") {
    localState.ui.selectComponent = true;
    //  wait until user has seleeced a component from list
    await until(localState).toMatch(
      (state) => state.ui.selectComponent === false
    );
    schema.value.push({
      $cmp: field.name,
      ...localState.fieldData,
    });
    return;
  }
  localState.field = field;

  localState.ui.selectValues = true;
  //  wait until user has seleeced a component from list
  await until(localState).toMatch((state) => state.ui.selectValues === false);

  localState.ui.addField = false;
  localState.field = null;

  if (!localState.fieldData) return;
  // split textarea inputs by line ar otions for select, checkbox and radio
  if (
    !Array.isArray(localState.fieldData?.options) &&
    localState.fieldData?.options
  )
    localState.fieldData.options = localState.fieldData?.options?.split("\n");

  schema.value.push({
    $formkit: field,
    ...localState.fieldData,
  });

  localState.fieldData = null;
}

async function editField(field: Field, index: number) {
  let options: string = "";
  if (isOptionField(field) && Array.isArray(field.options)) {
    options = field.options?.join("\n");
  }
  localState.field = field.$formkit ?? null;
  localState.fieldData = {
    ...field,
    options,
  };
  localState.ui.selectValues = true;
  //  wait until user finished editing
  await until(localState).toMatch((state) => state.ui.selectValues === false);
  if (!localState.fieldData) return;
  if (
    !Array.isArray(localState.fieldData?.options) &&
    localState.fieldData?.options
  )
    localState.fieldData.options = localState.fieldData?.options?.split("\n");
  schema.value[index] = {
    ...schema.value[index],
    ...localState.fieldData,
  };
  localState.field = null;
  localState.fieldData = null;
}

function isOptionField(field: Field) {
  return (
    field.$formkit === "select" ||
    field.$formkit === "checkbox" ||
    field.$formkit === "radio"
  );
}

async function save() {
  const res = await fetch("/api/admin/component/add", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: component.name,
      schema: schema.value,
    }),
  });
  if (res.ok) {
    router.push("/admin");
  }
}
</script>
<template>
  <main class="flex flex-1 flex-col">
    <div class="flex">
      <h1 class="text-xl font-bold">Create new component</h1>
      <button class="button ml-auto" @click="save">save</button>
    </div>
    <div class="bg-slate-100 rounded mt-4 p-4">
      <FormKit
        type="text"
        v-model="component.name"
        label="Component Name"
        validation="required|matches:/^(\w+\-?\_?)*\w+$/"
      />
    </div>
    <div class="grid grid-cols-2 flex-1 gap-8 mt-4">
      <div class="bg-slate-100 rounded grid p-4">
        <draggable v-model="schema" group="components" item-key="id">
          <template #item="{ element, index }">
            <div
              class="flex justify-between items-center cursor-pointer px-4 py-2 rounded hover:bg-slate-200"
            >
              <span>{{ element.name }}</span>
              <FormKit
                v-if="element.$formkit"
                :type="element.$formkit"
                :options="element.options"
              />
              <span v-else>Component {{ element.label }}</span>

              <div class="space-x-2">
                <button class="button" @click="schema.splice(index, 1)">
                  remove
                </button>
                <button
                  v-if="element.$formkit"
                  class="button"
                  @click="editField(element, index)"
                >
                  edit
                </button>
              </div>
            </div>
          </template>
        </draggable>
        <div class="flex justify-center self-end relative">
          <div
            v-show="localState.ui.addField"
            v-on-click-outside="() => (localState.ui.addField = false)"
            class="context-menu absolute bottom-12 bg-slate-300 rounded p-2"
          >
            <ul class="grid gap-1">
              <li
                v-for="field in fields"
                @click="addComponent(field)"
                class="cursor-pointer px-2 py-1 rounded hover:bg-slate-100"
              >
                {{ field }}
              </li>
              <template v-for="field in components">
                <li
                  v-if="getName(field)"
                  @click="addComponent(getName(field))"
                  class="cursor-pointer px-2 py-1 rounded hover:bg-slate-100"
                >
                  {{ getName(field)?.name }}
                </li>
              </template>
            </ul>
          </div>
          <button
            class="button"
            @click="localState.ui.addField = !localState.ui.addField"
          >
            add field +
          </button>
        </div>
      </div>
      <aside class="p-4">
        <!-- <FormKitSchema :schema="resolvedSchema" /> -->
      </aside>
    </div>
    <teleport to="body">
      <!-- Field Modal -->
      <div
        v-if="localState.ui.selectValues"
        class="modal fixed inset-0 grid place-content-center z-10 bg-black bg-opacity-50"
      >
        <div
          class="bg-slate-100 p-4 rounded"
          v-on-click-outside="() => (localState.ui.selectValues = false)"
        >
          <form-kit
            v-if="localState.field"
            type="form"
            submit-label="Save"
            @submit="
              (event: Field) => {
                localState.ui.selectValues = false;
                localState.fieldData = event;
              }
            "
            :actions="false"
            :value="localState.fieldData"
          >
            <h1>Configure field</h1>
            <FormKitSchema :schema="fieldSchema" />
            <button class="button mt-4">Save</button>
          </form-kit>
        </div>
      </div>
      <div
        v-else-if="localState.ui.selectComponent"
        class="modal fixed inset-0 grid place-content-center z-10 bg-black bg-opacity-50"
      >
        <div
          class="bg-slate-100 p-4 rounded"
          v-on-click-outside="() => (localState.ui.selectComponent = false)"
        >
          <form-kit
            type="form"
            submit-label="Save"
            @submit="
              (event: Field) => {
                localState.ui.selectComponent = false;
                localState.fieldData = event;
              }
            "
            :actions="false"
          >
            <h1>Configure field</h1>
            <FormKitSchema
              :schema="[
                {
                  $formkit: 'text',
                  name: 'name',
                  label: 'Name',
                  validation: 'required',
                },
                {
                  $formkit: 'text',
                  name: 'label',
                  label: 'Label',
                  validation: 'required',
                },
                {
                  $formkit: 'checkbox',
                  name: 'solo',
                  label: 'Solo',
                  validation: 'required',
                  value: false,
                },
              ]"
            />
            <button class="button mt-4">Save</button>
          </form-kit>
        </div>
      </div>
    </teleport>
  </main>
</template>
