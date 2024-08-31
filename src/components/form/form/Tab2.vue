<template>
  <tab-content title="ลำดับที่ 2">
    <form @submit.prevent="onSubmit">
      <div class="row" v-if="item.id && isLoading == false">
        <div class="col-12 mb-6">
          <h3>ข้อมูลสุขภาพ</h3>
          <span>หมายเหตุ : โปรดระบุข้อมูลให้ครบถ้วน</span>
        </div>

        <CustomField
          v-for="field in fields"
          :key="field.name"
          :label="field.label"
          :field="field.model"
          :component-type="field.type"
          :colClass="field.colClass"
          :disabled="field.disabled"
        />

        <div class="row">
          <div class="d-flex justify-content-between w-100">
            <button type="button" class="btn btn-info" @click="onPrevious()">
              <span class="indicator-label"> ย้อนกลับ </span>
              <span class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
            <button
              ref="submitButtonRef"
              type="submit"
              id="kt_modal_new_address_submit"
              class="btn btn-success"
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
      </div>
    </form>
  </tab-content>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  toRefs,
  onBeforeUnmount,
  getCurrentInstance,
  computed,
  watch,
} from "vue";

import ApiService from "@/core/services/ApiService";
// Vee validate
import { useForm } from "vee-validate";
import * as Yup from "yup";
// Import FormWizard
import { TabContent } from "vue3-form-wizard";
// Use Composables
// Components
import CustomField from "@/Components/field/CustomField.vue";

export default defineComponent({
  name: "student-profile-form-tab2",
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
      address_alls: <any>[],
      advisors: <any>[],
    });

    const fields = ref([
      {
        name: "blood_group",
        label: "กลุ่มเลือด",
        model: "blood_group",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "height",
        label: "ส่วนสูง (ซม.)",
        model: "height",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "weight",
        label: "น้ำหนัก (กก.)",
        model: "weight",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "emergency_phone",
        label: "เบอร์โทรศัพท์ฉุกเฉิน",
        model: "emergency_phone",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "congenital_disease",
        label: "โรคประจำตัว (กรณีไม่มีข้อมูลให้ทำการใช้เครื่องหมาย '-')",
        model: "congenital_disease",
        type: "textArea",
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "drug_allergy",
        label: "ประวัติการแพ้ยา (กรณีไม่มีข้อมูลให้ทำการใช้เครื่องหมาย '-')",
        model: "drug_allergy",
        type: "textArea",
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ]);

    const validationSchema = Yup.object().shape({
      blood_group: Yup.string().required().label("กลุ่มเลือด"),
      height: Yup.number()
        .typeError("ตัวเลขเท่านั้น")
        .required()
        .label("ส่วนสูง"),
      weight: Yup.number()
        .typeError("ตัวเลขเท่านั้น")
        .required()
        .label("น้ำหนัก"),
      emergency_phone: Yup.string()
        .matches(/^[0-9]{10}$/, "เบอร์โทรศัพท์ฉุกเฉิน")
        .required()
        .label("โทรศัพท์มือถือ"),
      congenital_disease: Yup.string().required().label("โรคประจำตัว"),
      drug_allergy: Yup.string().required().label("ประวัติการแพ้ยา"),
    });

    // Event
    const { handleSubmit, setValues } = useForm({
      validationSchema: validationSchema,
      initialValues: props.item,
    });

    const onSubmit = handleSubmit(async (values) => {
      console.log("Form Submitted", values);
      Object.assign(props.item, values);
      const {
        blood_group,
        height,
        weight,
        emergency_phone,
        congenital_disease,
        drug_allergy,
      } = item.value;

      let data_send = {
        blood_group,
        height,
        weight,
        emergency_phone,
        congenital_disease,
        drug_allergy,
      };

      await ApiService.post(`student-profile/${item.value.id}`, {
        ...data_send,
      })
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }

          emit("on-next");
        })
        .catch(({ response }) => {
          console.log(response);
        });

      //
    });

    const onPrevious = () => {
      emit("on-previous");
    };

    // const resetToInitial = () => {
    //   setValues(props.model);
    // };

    // Mounted
    onMounted(async () => {
      isLoading.value = true;

      isLoading.value = false;
    });

    onBeforeUnmount(() => {});

    // watch(
    //   () => props.item,
    //   (newValue) => {
    //     setValues(newValue);
    //   }
    // );

    // Return
    return {
      selectOptions,
      onSubmit,
      fields,
      item,
      isLoading,
      onPrevious,
    };
  },
});
</script>

<style scoped></style>
