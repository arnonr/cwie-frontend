<template>
    <div class="mb-7 col-12" :class="colClass">
      <label :for="name" class="required form-label">{{ label }}</label>
      <Field :name="name" v-slot="{ field }" v-model="internalValue">
        <component
          :is="componentType"
          v-bind="field"
          label="name"
          :class="['form-control', { 'is-invalid': errors[name] }]"
          :options="options"
          :placeholder="placeholder"
          :disabled="disabled"
        />
        
      </Field>
      <ErrorMessage :class="['invalid-feedback']" :name="name" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, onMounted, computed } from "vue";
import { ErrorMessage, Field } from "vee-validate";
// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default defineComponent({
  components: {
    Field,
    ErrorMessage,
    vSelect,
  },
  props: {
    componentType: {
      type: String,
      default: "input",
    },
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: [String, Number, Boolean, Array, Object],
    options: {
      type: Array as unknown as () => any[],
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "",
    },
    colClass: {
      type: String,
      default: "col-lg-3",
    },
    errors: {
      type: Object as unknown as () => Record<string, string>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const internalValue = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });
    

    return {
      internalValue,
    };
  },
});
</script>
