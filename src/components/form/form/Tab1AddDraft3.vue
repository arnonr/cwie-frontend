<template>
  <tab-content title="ลำดับที่ 1">
    <form @submit.prevent="onSubmit">
      <div class="row" v-if="item.id">
        <div class="col-12 mb-6">
          <h3>ข้อมูลทั่วไป</h3>
          <span>หมายเหตุ : โปรดระบุข้อมูลให้ครบถ้วน</span>
        </div>

        <!-- <CustomField
          v-for="field in fields"
          :key="field.name"
          v-model="item[field.name]"
          :component-type="field.type"
          :error-message="errors[field.name]"
          v-bind="field"
        /> -->

        <!-- <div> -->
        <!-- <component
          :is="'input'"
          name="firstname"
          v-model="item['firstname']"
          label="name"
          :class="['form-control', { 'is-invalid': errorMessage }]"
        /> -->

        <div>
          <label for="email">อีเมล:</label>
          <input
            id="email"
            v-model="email"
            type="input"
            class="form-control"
            :class="['form-control', { 'is-invalid': emailError }]"
          />
          <span v-if="emailError" class="invalid-feedback">{{
            emailError
          }}</span>
        </div>

        <div>
          <label for="firstname">ชื่อ:</label>
          <input
            id="firstname"
            v-model="firstname"
            type="input"
            class="form-control"
            :class="['form-control', { 'is-invalid': firstnameError }]"
          />
          <span v-if="firstnameError" class="invalid-feedback">{{
            firstnameError
          }}</span>
        </div>

        <!-- :options="field.options"
          :placeholder="field.placeholder"
          :disabled="field.disabled" -->

        <!-- <span v-if="errorMessage && meta.touched" class="invalid-feedback">
            {{ errorMessage }}
          </span>
        </div> -->
        <!-- <CustomField
          v-for="field in fields"
          :key="field.name"
          :component-type="field.type"
          :label="field.label"
          :name="field.name"
          v-model="item[field.model]"
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

        <!-- <CustomField
          v-for="field in fields2"
          :key="field.name"
          :component-type="field.type"
          :label="field.label"
          :name="field.name"
          v-model="item[field.model]"
          :options="field.options"
          :placeholder="field.placeholder"
          :col-class="field.colClass"
          :disabled="field.disabled"
          :errors="errors"
        /> -->
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
    </form>
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
  computed,
  watch,
} from "vue";

import ApiService from "@/core/services/ApiService";
// Vee validate
import { useForm, useField } from "vee-validate";
import * as Yup from "yup";
// Import FormWizard
import { TabContent } from "vue3-form-wizard";
// Use Composables
import { fetchTeachers } from "@/composables/useFetchSelectionData";
// Components
import CustomField from "@/Components/field/CustomField.vue";

export default defineComponent({
  name: "student-profile-form-tab1",
  components: {
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
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const isLoading = ref(true);

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
      advisors: <any>[],
    });

    const fields = ref([
      {
        name: "student_code",
        label: "รหัสนักศึกษา",
        model: "student_code",
        type: "input",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: true,
      },
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
      {
        name: "surname",
        label: "นามสกุล",
        model: "surname",
        type: "input",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "faculty_name",
        label: "คณะ",
        model: "faculty_name",
        type: "input",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: true,
      },
      {
        name: "division_name",
        label: "สาขาวิชา",
        model: "division_name",
        type: "input",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: true,
      },
      {
        name: "class_year",
        label: "ชั้นปีที่ (1-8)",
        model: "class_year",
        type: "input",
        placeholder: "",
        colClass: "col-lg-2",
        disabled: false,
      },
      {
        name: "advisor_id",
        label: "อาจารย์ที่ปรึกษา",
        model: "advisor_id",
        type: "v-select",
        options: computed(() => selectOptions.value.advisors),
        placeholder: "",
        colClass: "col-lg-8",
        disabled: false,
      },
      {
        name: "gpa",
        label: "เกรดเฉลี่ยสะสม",
        model: "gpa",
        type: "input",
        placeholder: "",
        colClass: "col-lg-2",
        disabled: false,
      },
    ]);

    const fields2 = [
      {
        name: "address",
        label: "ที่อยู่ปัจจุบัน เช่น บ้านเลขที่ หมู่บ้าน ซอย ถนน",
        model: "address",
        type: "textArea",
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "phone",
        label: "โทรศัพท์มือถือ",
        model: "phone",
        type: "input",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "email",
        label: "อีเมล",
        model: "email",
        type: "input",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "address_all",
        label: "จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์",
        model: "address_all",
        type: "v-select",
        options: selectOptions.value.paper_kinds,
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ];

    const validationSchema = Yup.object().shape({
      //   prefix: Yup.string().required().label("คำนำหน้า"),
      firstname: Yup.string().required().label("ชื่อ"),
      //   surname: Yup.string().required().label("นามสกุล"),
      //   class_year: Yup.number()
      //     .typeError("ตัวเลข 1-8 เท่านั้น")
      //     .max(8, "ตัวเลข 1-8 เท่านั้น")
      //     .required()
      //     .label("ชั้นปี"),
      //   advisor_id: Yup.object().required().label("อาจารย์ที่ปรึกษา"),
      //   address: Yup.string().required().label("ที่อยู่ปัจจุบัน"),
      //   phone: Yup.string()
      //     .matches(/^[0-9]{10}$/, "หมายเลขโทรศัพท์มือถือไม่ถูกต้อง")
      //     .required()
      //     .label("โทรศัพท์มือถือ"),
      email: Yup.string()
        .email("รูปแบบอีเมลไม่ถูกต้อง")
        .required()
        .label("อีเมล"),
      //   gpa: Yup.number()
      //     .typeError("ตัวเลขเท่านั้น")
      //     .required()
      //     .label("เกรดเฉลี่ยสะสม"),
      //   address_all: Yup.object()
      //     .required()
      //     .label("จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์"),
    });

    // Event
    // const onSubmit = async () => {
    //   const {
    //     prefix,
    //     firstname,
    //     surname,
    //     class_year,
    //     advisor_id,
    //     gpa,
    //     address,
    //     phone,
    //     email,
    //     // address_all
    //   } = item.value;

    //   let data_send = {
    //     prefix,
    //     firstname,
    //     surname,
    //     class_year,
    //     advisor_id: advisor_id?.id,
    //     gpa,
    //     address,
    //     phone,
    //     email,
    //     // address_all,
    //   };

    //   console.log(item);

    //   await ApiService.put(`student-profile/${item.value.id}`, { ...data_send })
    //     .then(({ data }) => {
    //       if (data.msg != "success") {
    //         throw new Error("ERROR");
    //       }
    //     })
    //     .catch(({ response }) => {
    //       console.log(response);
    //     });

    //   emit("on-next");
    // };

    // const { handleSubmit, errors, values, meta } = useForm({
    //   validationSchema,
    //   initialValues: props.item,
    // });

    // const onSubmit = handleSubmit((values) => {
    //   console.log("Form submitted", values);
    //   // Here you can call your API to save the data
    //   // After successful submission:
    //   emit("on-next");
    // });

    const { handleSubmit, setValues } = useForm({
      validationSchema: validationSchema,
      initialValues: props.item,
    });

    const { value: email, errorMessage: emailError } = useField("email");
    const { value: firstname, errorMessage: firstnameError } =
      useField("firstname");

    const onSubmit = handleSubmit((values) => {
      console.log("Form Submitted", values);
    });

    // Mounted
    onMounted(async () => {
      isLoading.value = true;
      selectOptions.value.advisors = await fetchTeachers({
        department_id: userData.student_profile.department_id,
        is_active: true,
        selectField: JSON.stringify({
          id: true,
          fullname: true,
        }),
      });

      selectOptions.value.advisors = selectOptions.value.advisors.map(
        (x: any) => {
          return { id: x.id, name: x.fullname };
        }
      );
      isLoading.value = false;

    });

    onBeforeUnmount(() => {});

    // Form submission handler
    const submitForm = handleSubmit((values) => {
      console.log("Form Submitted", values);
    });

    // อัปเดตค่าในฟอร์มเมื่อ model มีการเปลี่ยนแปลง
    watch(
      () => props.item,
      (newValue) => {
        setValues(newValue);
      }
    );

    // Return
    return {
      selectOptions,
      onSubmit,
      fields,
      fields2,
      item,

      email,
      emailError,
      firstname,
      firstnameError,
    };
  },
});
</script>

<style scoped></style>
