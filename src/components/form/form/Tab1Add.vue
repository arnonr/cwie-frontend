<template>
  <tab-content title="ลำดับที่ 1">
    <form @submit.prevent="onSubmit">
      <div class="row" v-if="item.id && isLoading == false">
        <div class="col-12 mb-6">
          <h3>ข้อมูลทั่วไป</h3>
          <span>หมายเหตุ : โปรดระบุข้อมูลให้ครบถ้วน</span>
        </div>

        <div class="col-12 col-lg-3 mb-10">
          <div style="cursor: pointer">
            <img
              v-if="previewPhoto"
              :src="previewPhoto"
              class="mt-5"
              style="width: 200px"
              @click="openFileInput"
            />
            <img
              v-if="previewPhoto == null && item.photo_file_old != null"
              :src="item.photo_file_old"
              alt=""
              class="mt-5"
              style="width: 200px"
              @click="openFileInput"
            />

            <img
              v-if="previewPhoto == null && item.photo_file_old == null"
              src="/media/avatars/blank.png"
              alt=""
              class="mt-5"
              style="width: 200px"
              @click="openFileInput"
            />
          </div>
        </div>
        <div class="col-12 col-lg-9">
          <div class="mb-7 col-12 col-lg-12 mt-lg-10">
            <label for="photo_file" class="required form-label"
              >อัพโหลดรูปภาพนักศึกษา <br />ขนาด 1x1.5 นิ้ว <br />ไฟล์รูปภาพ PNG,
              JPG</label
            >
            <input
              type="file"
              id="formFile"
              name="photo_file"
              accept="image/*"
              @change="onPhotoFileChange"
              ref="photoFile"
              style="display: none"
              :class="['form-control', { 'is-invalid': '' }]"
            />
            <!-- <span v-if="errorMessage" class="invalid-feedback">{{
            errorMessage
          }}</span> -->
          </div>
        </div>

        <CustomField
          v-for="field in fields"
          :key="field.name"
          :label="field.label"
          :field="field.model"
          :component-type="field.type"
          :colClass="field.colClass"
          :disabled="field.disabled"
          :options="field.options"
        />

        <div class="separator separator-dashed mb-7"></div>
        <div class="col-12 mb-6">
          <h3>ที่อยู่</h3>
        </div>

        <CustomField
          v-for="field in fields2"
          :key="field.name"
          :label="field.label"
          :field="field.model"
          :component-type="field.type"
          :colClass="field.colClass"
          :disabled="field.disabled"
          :options="field.options"
          :select_label="field.select_label"
        />

        <div class="separator separator-dashed mb-7"></div>
        <div class="col-12 mb-6">
          <h3>ผู้ที่ติดต่อได้</h3>
        </div>

        <CustomField
          v-for="field in fields3"
          :key="field.name"
          :label="field.label"
          :field="field.model"
          :component-type="field.type"
          :colClass="field.colClass"
          :disabled="field.disabled"
          :options="field.options"
          :select_label="field.select_label"
        />
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
import {
  fetchTeachers,
  fetchAddressAlls,
} from "@/composables/useFetchSelectionData";
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
    const photoFile = ref<any>(null);
    const previewPhoto = ref<any>(null);

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const selectOptions = ref({
      address_alls: <any>[],
      advisors: <any>[],
    });

    const fields = ref([
      {
        name: "student_code",
        label: "รหัสนักศึกษา",
        model: "student_code",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: true,
      },
      {
        name: "prefix",
        label: "คำนำหน้า (นาย, นาง, นางสาว)",
        model: "prefix",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "firstname",
        label: "ชื่อ",
        model: "firstname",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "surname",
        label: "นามสกุล",
        model: "surname",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "faculty_name",
        label: "คณะ",
        model: "faculty_name",
        type: "text",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: true,
      },
      {
        name: "division_name",
        label: "สาขาวิชา",
        model: "division_name",
        type: "text",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: true,
      },
      {
        name: "class_year",
        label: "ชั้นปีที่ (1-8)",
        model: "class_year",
        type: "text",
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
        type: "text",
        placeholder: "",
        colClass: "col-lg-2",
        disabled: false,
      },
    ]);

    const fields2 = ref([
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
        type: "text",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "email",
        label: "อีเมล",
        model: "email",
        type: "text",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "address_all",
        label: "จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์",
        model: "address_all",
        select_label: "label",
        type: "v-select",
        options: computed(() => selectOptions.value.address_alls),
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ]);

    const fields3 = ref([
      {
        name: "contact1_name",
        label: "ชื่อผู้ที่ติดต่อได้ คนที่ 1",
        model: "contact1_name",
        type: "text",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "contact1_relation",
        label: "ความสัมพันธ์",
        model: "contact1_relation",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "contact1_phone",
        label: "เบอรโทรศัพท์",
        model: "contact1_phone",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "contact2_name",
        label: "ชื่อผู้ที่ติดต่อได้ คนที่ 2",
        model: "contact2_name",
        type: "text",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "contact2_relation",
        label: "ความสัมพันธ์",
        model: "contact2_relation",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
      {
        name: "contact2_phone",
        label: "เบอรโทรศัพท์",
        model: "contact2_phone",
        type: "text",
        placeholder: "",
        colClass: "col-lg-3",
        disabled: false,
      },
    ]);

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
      contact1_name: Yup.string()
        .required()
        .label("ชื่อผู้ที่ติดต่อได้ คนที่ 1"),
      contact1_relation: Yup.string().required().label("ความสัมพันธ์"),
      contact1_phone: Yup.string().required().label("เบอร์โทรศัพท์"),
      contact2_name: Yup.string()
        .required()
        .label("ชื่อผู้ที่ติดต่อได้ คนที่ 2"),
      contact2_relation: Yup.string().required().label("ความสัมพันธ์"),
      contact2_phone: Yup.string().required().label("เบอร์โทรศัพท์"),
      photo_file: Yup.mixed().nullable().label("รูปภาพนักศึกษา"),
    });

    // Event
    const openFileInput = () => {
      photoFile.value.click();
    };

    const onPhotoFileChange = (event: any) => {
      props.item.photo_file = event.target.files[0];
      if (props.item.photo_file) {
        previewPhoto.value = URL.createObjectURL(props.item.photo_file);
      } else {
        previewPhoto.value = null;
      }
    };

    const { handleSubmit, setValues } = useForm({
      validationSchema: validationSchema,
      initialValues: props.item,
    });

    const onSubmit = handleSubmit(async (values) => {
      const { photo_file, ...otherValues } = values;
      Object.assign(props.item, otherValues);
      if (photo_file instanceof File) {
        props.item.photo_file = photo_file;
      }
      
      const {
        prefix,
        firstname,
        surname,
        class_year,
        advisor_id,
        gpa,
        address,
        phone,
        email,
        address_all,
        contact1_name,
        contact1_relation,
        contact1_phone,
        contact2_name,
        contact2_relation,
        contact2_phone,
      } = item.value;

      const { province_id, district_id, sub_district_id } = address_all;

      let data_send = {
        prefix,
        firstname,
        surname,
        class_year,
        advisor_id: advisor_id?.id,
        gpa,
        address,
        phone,
        email,
        province_id,
        district_id,
        sub_district_id,
        contact1_name,
        contact1_relation,
        contact1_phone,
        contact2_name,
        contact2_relation,
        contact2_phone,
        photo_file:
          props.item.photo_file.length != 0 ? props.item.photo_file : undefined,
      };

      await ApiService.putFormData(`student-profile/${item.value.id}`, {
        ...data_send,
      })
        .then(({ data, status }) => {
          if (status != 200) {
            throw new Error("ERROR");
          }
          emit("on-next");
        })
        .catch(({ response }) => {
          console.log(response);
        });

      //
    });

    // const resetToInitial = () => {
    //   setValues(props.model);
    // };

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

      selectOptions.value.address_alls = await fetchAddressAlls({});
      item.value.photo_file = [];
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
      fields2,
      fields3,
      item,
      isLoading,
      openFileInput,
      photoFile,
      previewPhoto,
      onPhotoFileChange,
    };
  },
});
</script>

<style scoped></style>
