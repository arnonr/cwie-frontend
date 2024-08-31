<!-- BaseInput.vue -->
<template>
  <div class="mb-7 col-12" :class="colClass">
    <label :for="field" class="form-label" :class="{ required: required }">{{
      label
    }}</label>
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
      v-model="typedValue"
      :type="componentType"
      :placeholder="placeholder"
      @blur="onBlur"
      :disabled="disabled"
      row="10"
      :class="['form-control', { 'is-invalid': errorMessage }]"
    />

    <!-- <textarea
      :id="field"
      :name="field"
      v-model="typedValue"
      :type="componentType"
      :placeholder="placeholder"
      @blur="onBlur"
      :disabled="disabled"
      row="10"
      :class="['form-control', { 'is-invalid': errorMessage }]"
    /> -->

    <VueDatePicker
      v-else-if="componentType == 'datepicker'"
      v-model="typedValue"
      :enable-time-picker="false"
      :placeholder="placeholder"
      :locale="'th'"
      auto-apply
      :class="['form-control', { 'is-invalid': errorMessage }]"
      :format="format"
    >
      <template #year-overlay-value="{ text }">
        {{ parseInt(text) + 543 }}
      </template>

      <template #year="{ value }">
        {{ value + 543 }}
      </template>
    </VueDatePicker>

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

<script lang="ts">
import { useField } from "vee-validate";
// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// Import Datepicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

export default {
  components: {
    vSelect,
    VueDatePicker,
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
    required: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { value, errorMessage, handleBlur } = useField(props.field);

    const format = (date: any) => {
      const day = dayjs(date).locale("th").format("DD");
      const month = dayjs(date).locale("th").format("MMM");
      const year = date.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    };

    const typedValue = value as unknown as
      | string
      | number
      | string[]
      | null
      | undefined;

    const onBlur = () => {
      handleBlur();
    };

    return {
      value,
      errorMessage,
      onBlur,
      typedValue,
      format,
    };
  },
};
</script>

<style scoped>
/* คุณสามารถปรับสไตล์ของ input และ error message ได้ที่นี่ */
</style>
