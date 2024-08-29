<template>
  <tab-content title="ลำดับที่ 1">
    <VForm
      class="form w-100"
      id="kt_modal_form"
      @submit="onSubmit"
      :validation-schema="validationSchema"
      v-slot="{ errors }"
    >
      <div class="row">
        <div class="col-12 mb-6">
          <h3>ข้อมูลทั่วไป</h3>
          <span>หมายเหตุ : โปรดระบุข้อมูลให้ครบถ้วน</span>
        </div>

        <!-- <input type="text" class="form-control" v-model="item.prefix" /> -->

        <div class="mb-7 col-12 col-lg-12" v-for="f in fields" :key="f.name">
          <label :for="f.name" class="required form-label">
            {{ f.label }}
          </label>

          <!-- <Field :name="f.name" v-slot="{ field, meta }">
            <input
              type="text"
              class="form-control"
              :class="errors[f.name] ? 'is-invalid' : ''"
              :placeholder="f.placeholder || ''"
              v-bind="field"
              v-model="item[f.model]"
            />
          </Field> -->

          <!-- type="text" -->
          <Field
            type="text"
            :name="f.name"
            v-model="item[f.name]"
            :placeholder="f.placeholder"
            class="form-control"
            :class="errors[f.name] ? 'is-invalid' : ''"
          />
          <ErrorMessage class="invalid-feedback" :name="f.name" />
        </div>

        <!-- <Field
          name="advisor_id"
          class="form-control"
          :class="errors.advisor_id ? 'is-invalid' : ''"
          as="v-select"
          v-model="item['advisor_id']"
        >
          <option value="">Select a Country...</option>
          <option
            v-for="(item, i) in selectOptions.paper_kinds"
            :key="`countries-select-option-${i}`"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </Field>
        <ErrorMessage class="invalid-feedback" :name="'advisor_id'" />  -->

        <!-- <Field
          name="select"
          as="v-select"
          :options="options"
          v-slot="{ field }"
          v-bind="field"
        /> -->

        <Field name="surname" v-slot="{ field }" v-model="item.surname">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            :class="errors['surname'] ? 'is-invalid' : ''"
          />
        </Field>
        <ErrorMessage class="invalid-feedback" :name="'surname'" />

        <Field name="advisor_id" v-slot="{ field }" v-model="item.advisor_id">
          <v-select
            :options="selectOptions.paper_kinds"
            v-bind="field"
            label="name"
            :reduce="(advisor) => advisor.id"
            class="form-control"
            :class="errors['advisor_id'] ? 'is-invalid' : ''"
            placeholder="Select a Country..."
          />
        </Field>
        <ErrorMessage class="invalid-feedback" :name="'advisor_id'" />

        <!-- <div class="mb-7 col-12" :class="f.colClass" v-for="f in fields">
          <label :for="f.name" class="required form-label">{{ f.label }}</label>
          <Field :name="f.name" v-slot="{ field, meta }"> -->
        <!--    <component
              :is="f.type"
              label="name"
              v-model="item[f.model]"
              :class="['form-control', { 'is-invalid': errors[f.name] }]"
              :options="f.options"
              :placeholder="f.placeholder"
              :disabled="f.disabled"
            /> -->
        <!-- :class="['form-control', { 'is-invalid': errors[field.name] }]" -->
        <!-- <input
              type="text"
              :class="errors[f.name] ? 'is-invalid' : ''"
              :placeholder="`ชื่อโครงการ ภาษาไทย`"
              :aria-label="`ชื่อโครงการ ภาษาไทย`"
              v-bind="field"
              v-model="item[f.model]"
            />
          </Field>
          <ErrorMessage :class="['invalid-feedback']" :name="field.name" />
        </div> -->

        <!-- <CustomField
          v-for="field in fields"
          :key="field.name"
          :label="field.label"
          :name="field.name"
          :model="item[field.model]"
          :component-type="field.type"
          :options="field.options"
          :placeholder="field.placeholder"
          :col-class="field.colClass"
          :disabled="field.disabled"
          :errors="errors"
        /> -->
        <div class="separator separator-dashed mb-7"></div>
        <div class="col-12 mb-6">
          <h3>ที่อยู่</h3>
        </div>
      </div>

      <div class="row">
        <div class="d-flex justify-content-end w-100">
          <button
            ref="submitButtonRef"
            type="submit"
            id="kt_modal_new_address_submit"
            class="btn btn-primary"
          >
            <span class="indicator-label"> ถัดไป </span>
            <span class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </VForm>
  </tab-content>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  toRefs,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Vee validate
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import * as Yup from "yup";
// Import Datepicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// Import FormWizard
import { TabContent } from "vue3-form-wizard";

// Use Composables
import useMasterData from "@/composables/useMasterData";
import useFroalaConfigData from "@/composables/useFroalaConfigData";

// Components
import CustomField from "@/Components/field/CustomField.vue";

export default defineComponent({
  name: "student-profile-form-tab1",
  components: {
    Field,
    VForm,
    ErrorMessage,
    vSelect,
    VueDatePicker,
    TabContent,
    CustomField,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    // Variable
    const { item } = toRefs(props);

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const selectOptions = ref({
      paper_kinds: <any>[
        { name: "ประเภท 1", id: 1 },
        { name: "ประเภท 2", id: 2 },
        { name: "ประเภท 3", id: 3 },
      ],
      province_alls: <any>[
        { name: "ประเภท 1", id: 1 },
        { name: "ประเภท 2", id: 2 },
        { name: "ประเภท 3", id: 3 },
      ],
    });

    const fields = [
      //   {
      //     name: "student_code",
      //     label: "รหัสนักศึกษา",
      //     model: "student_code",
      //     type: "input",
      //     placeholder: "",
      //     colClass: "col-lg-3",
      //     disabled: true,
      //   },
      {
        name: "prefix",
        label: "คำนำหน้า (นาย, นาง, นางสาว)",
        model: "prefix",
        type: "input",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "firstname",
        label: "ชื่อ",
        model: "firstname",
        type: "input",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      //   {
      //     name: "surname",
      //     label: "นามสกุล",
      //     model: "surname",
      //     type: "input",
      //     placeholder: "",
      //     colClass: "col-lg-3",
      //     disabled: false,
      //   },
      //   {
      //     name: "faculty_name",
      //     label: "คณะ",
      //     model: "faculty_name",
      //     type: "input",
      //     placeholder: "",
      //     colClass: "col-lg-6",
      //     disabled: true,
      //   },
      //   {
      //     name: "division_name",
      //     label: "สาขาวิชา",
      //     model: "division_name",
      //     type: "input",
      //     placeholder: "",
      //     colClass: "col-lg-6",
      //     disabled: true,
      //   },
      //   {
      //     name: "class_year",
      //     label: "ชั้นปีที่ (1-8)",
      //     model: "class_year",
      //     type: "input",
      //     placeholder: "",
      //     colClass: "col-lg-2",
      //     disabled: false,
      //   },
      //   {
      //     name: "advisor_id",
      //     label: "อาจารย์ที่ปรึกษา",
      //     model: "advisor_id",
      //     type: "v-select",
      //     options: selectOptions.value.paper_kinds,
      //     placeholder: "",
      //     colClass: "col-lg-8",
      //     disabled: false,
      //   },
      //   {
      //     name: "gpa",
      //     label: "เกรดเฉลี่ยสะสม",
      //     model: "gpa",
      //     type: "input",
      //     placeholder: "",
      //     colClass: "col-lg-2",
      //     disabled: false,
      //   },
    ];

    // const fields2 = [
    //   {
    //     name: "address",
    //     label: "ที่อยู่ปัจจุบัน เช่น บ้านเลขที่ หมู่บ้าน ซอย ถนน",
    //     model: "address",
    //     type: "textArea",
    //     placeholder: "",
    //     colClass: "col-lg-12",
    //     disabled: false,
    //   },
    //   {
    //     name: "phone",
    //     label: "โทรศัพท์มือถือ",
    //     model: "phone",
    //     type: "input",
    //     placeholder: "",
    //     colClass: "col-lg-6",
    //     disabled: false,
    //   },
    //   {
    //     name: "email",
    //     label: "อีเมล",
    //     model: "email",
    //     type: "input",
    //     placeholder: "",
    //     colClass: "col-lg-6",
    //     disabled: false,
    //   },
    //   {
    //     name: "address_all",
    //     label: "จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์",
    //     model: "address_all",
    //     type: "v-select",
    //     options: selectOptions.value.paper_kinds,
    //     placeholder: "",
    //     colClass: "col-lg-12",
    //     disabled: false,
    //   },
    // ];

    const errors_default = {
      prefix: { error: 0, text: "" },
      firstname: { error: 0, text: "" },
      surname: { error: 0, text: "" },
      class_year: { error: 0, text: "" },
      advisor_id: { error: 0, text: "" },
      gpa: { error: 0, text: "" },
      address: { error: 0, text: "" },
      phone: { error: 0, text: "" },
      email: { error: 0, text: "" },
      address_all: { error: 0, text: "" },
    };
    const errors = reactive<any>({
      ...errors_default,
    });

    const validationSchema = Yup.object().shape({
      prefix: Yup.string().required().label("คำนำหน้า"),
      firstname: Yup.string().required().label("ชื่อ"),
      surname: Yup.string().required().label("นามสกุล"),
      class_year: Yup.number()
        .typeError("ตัวเลข 1-8 เท่านั้น")
        .max(8, "ตัวเลข 1-8 เท่านั้น")
        .required()
        .label("ชั้นปี"),
      advisor_id: Yup.object().required().label("อาจารย์ที่ปรึกษา"),
      address: Yup.string().required().label("ที่อยู่ปัจจุบัน"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "หมายเลขโทรศัพท์มือถือไม่ถูกต้อง")
        .required()
        .label("โทรศัพท์มือถือ"),
      email: Yup.string()
        .email("รูปแบบอีเมลไม่ถูกต้อง")
        .required()
        .label("อีเมล"),
      gpa: Yup.number()
        .typeError("ตัวเลขเท่านั้น")
        .required()
        .label("เกรดเฉลี่ยสะสม"),
      address_all: Yup.object()
        .required()
        .label("จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์"),
    });

    // Event
    const onSubmit = async () => {
      //   nextTab emit ไปที่ parent
      emit("on-next");
    };

    // Mounted
    onMounted(async () => {
      //   selectOptions.value.paper_kinds = await useMasterData().fetchPaperKinds({
      //     is_active: true,
      //   });
    });

    onBeforeUnmount(() => {});

    // Return
    return {
      selectOptions,
      validationSchema,
      onSubmit,
      fields,
      //   fields2,
      item,
    };
  },
});
</script>

<style scoped></style>
