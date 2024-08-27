<!-- BaseInput.vue -->
<template>
  <div class="mb-7 col-12" :class="colClass">
    <label :for="field" class="required form-label">{{ label }}</label>
    <input
      v-if="componentType == 'text'"
      :id="field"
      :name="field"
      v-model="value"
      :type="componentType"
      :placeholder="placeholder"
      @blur="onBlur"
      :disabled="disabled"
      :class="['form-control', { 'is-invalid': errorMessage }]"
    />

    <textarea
      v-else-if="componentType == 'textArea'"
      :id="field"
      :name="field"
      v-model="value"
      :type="componentType"
      :placeholder="placeholder"
      @blur="onBlur"
      :disabled="disabled"
      row="10"
      :class="['form-control', { 'is-invalid': errorMessage }]"
    />

    <v-select
      v-else
      :id="field"
      :name="field"
      v-model="value"
      :placeholder="placeholder"
      @blur="onBlur"
      :disabled="disabled"
      :label="select_label"
      :options="options"
      :clearable="true"
      :class="['form-control', { 'is-invalid': errorMessage }]"
    >
    </v-select>
    <span v-if="errorMessage" class="invalid-feedback">{{ errorMessage }}</span>
  </div>
</template>

<script>
import { useField } from "vee-validate";
// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: {
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
    field: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    colClass: {
      type: String,
      default: "col-lg-3",
    },
    options: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    select_label: {
      type: String,
      default: "name",
    },
  },
  setup(props) {
    const { value, errorMessage, handleBlur } = useField(props.field);

    const onBlur = () => {
      handleBlur();
    };

    return {
      value,
      errorMessage,
      onBlur,
    };
  },
};
</script>

<style scoped>
/* คุณสามารถปรับสไตล์ของ input และ error message ได้ที่นี่ */
</style>
