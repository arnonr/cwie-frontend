<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="main-modal"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">แบบฟอร์มแผนการปฏิบัติงาน</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading">
          <form @submit.prevent="onSubmit">
            <div class="row">
              <template v-for="field in fields" :key="field.name">
                <CustomField
                  :label="field.label"
                  :select_label="field.select_label"
                  :field="field.model"
                  :component-type="field.type"
                  :colClass="field.colClass"
                  :disabled="field.disabled"
                  :options="field.options"
                />
              </template>
            </div>

            <div class="row">
              <div class="col-12 col-lg-12">
                <div class="mb-7">
                  <label for="plan_document_file" class="required form-label"
                    >อัพโหลดแผนการปฏิบัติงาน PDF</label
                  >
                  <input
                    type="file"
                    id="formFile"
                    name="plan_document_file"
                    @change="onFileChange"
                    ref="file"
                    :class="['form-control', { 'is-invalid': '' }]"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 text-center mb-5 mt-5">
                <span class="text-danger"
                  >**ตรวจสอบข้อมูลให้ถูกต้องก่อนกดปุ่มส่งข้อมูล**
                </span>
              </div>
              <div class="col-12 text-center">
                <button
                  ref="submitButtonRef"
                  type="submit"
                  id="kt_modal_new_address_submit"
                  class="btn btn-success"
                >
                  <span class="indicator-label"> ส่งข้อมูล </span>
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
        </div>
      </div>
    </div>
  </div>
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
// Import Modal Bootstrap
import { Modal } from "bootstrap";
// Vee validate
import { useForm } from "vee-validate";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
// Use Composables
import { fetchAddressAlls } from "@/composables/useFetchSelectionData";
// Components
import CustomField from "@/components/field/CustomField.vue";
import useToast from "@/composables/useToast";

export default defineComponent({
  name: "add-form",
  components: {
    CustomField,
  },
  props: {
    student_profile: {
      type: Object,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    // UI
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    // Variable
    const { student_profile, item } = toRefs(props);
    const isLoading = ref(true);
    const file = ref<any>(null);
    const previewFile = ref<any>(null);

    const plan_item = ref<any>({
      workplace_address: "",
      workplace_address_all: null,
      plan_document_file: [],
      workplace_googlemap_url: "",
    });

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const selectOptions = ref({
      address_alls: <any>[],
    });

    const fields = ref([
      {
        name: "workplace_address",
        label: "สถานที่ปฏิบัติงาน",
        model: "workplace_address",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "workplace_address_all",
        label: "จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์",
        model: "workplace_address_all",
        select_label: "label",
        type: "v-select",
        options: computed(() => selectOptions.value.address_alls),
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: " workplace_googlemap_url",
        label: "ลิงค์ Google Map",
        model: "workplace_googlemap_url",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ]);

    const validationSchema = Yup.object().shape({
      workplace_address: Yup.string().required().label("สถานที่ปฏิบัติงาน"),
      workplace_address_all: Yup.object()
        .required()
        .label("จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์"),
      workplace_googlemap_url: Yup.string().required().label("Google Map Url"),
      plan_document_file: Yup.mixed().nullable().label("ไฟล์แผนการปฏิบัติงาน"),
    });

    // Event
    const openFileInput = () => {
      file.value.click();
    };

    const onFileChange = (event: any) => {
      plan_item.value.plan_document_file = event.target.files[0];
      console.log(plan_item.value.plan_document_file);
    };

    const { handleSubmit, setValues, values } = useForm({
      validationSchema: validationSchema,
      initialValues: plan_item.value,
    });

    const onSubmit = handleSubmit(async (values) => {
      const { plan_document_file, ...otherValues } = values;

      Object.assign(plan_item.value, otherValues);
      if (plan_document_file instanceof File) {
        plan_item.value.plan_document_file = plan_document_file;
      }

      if (plan_item.value.plan_document_file.length == 0) {
        useToast("แผนการปฏิบัติงาน จำเป็นต้องอัพโหลด", "error");
        return;
      }

      const {
        workplace_adddress,
        workplace_address_all,
        workplace_googlemap_url,
      } = plan_item.value;

      const { province_id, district_id, sub_district_id } =
        workplace_address_all;

      let data_send = {
        workplace_address: workplace_adddress,
        workplace_province_id: province_id,
        workplace_district_id: district_id,
        workplace_sub_district_id: sub_district_id,
        workplace_googlemap_url: workplace_googlemap_url,
        plan_document_file:
          plan_item.value.plan_document_file.length != 0
            ? plan_item.value.plan_document_file
            : undefined,
        plan_send_at: dayjs().format("YYYY-MM-DD"),
        form_status_id: 12,
      };

      Swal.fire({
        title: "ยืนยันการส่งแผนการปฏิบัติงาน",
        text: "เมื่อส่งแผนการปฏิบัติงาแล้วจะไม่สามารถแก้ไขข้อมูลได้",
        icon: "warning",
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        heightAuto: false,
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-info",
        },
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          await ApiService.postFormData(`form/${props.item.id}`, {
            ...data_send,
          })
            .then(({ status }) => {
              if (status != 200) {
                throw new Error("ERROR");
              }
            })
            .catch(({ response }) => {
              console.log(response);
            });

          await ApiService.post(`student-profile/${student_profile.value.id}`, {
            status_id: data_send.form_status_id,
          })
            .then(({ status }) => {
              if (status != 200) {
                throw new Error("ERROR");
              }
            })
            .catch(({ response }) => {
              console.log(response);
            });

          useToast("ส่งข้อมูลเสร็จสิ้น", "success");
          onClose({ reload: true });
        } else {
        }
      });

      //
    });

    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );

      isLoading.value = true;

      selectOptions.value.address_alls = await fetchAddressAlls({});
      isLoading.value = false;

      isLoading.value = false;
    });

    onBeforeUnmount(() => {});

    // Return
    return {
      selectOptions,
      mainModalRef,
      onSubmit,
      fields,
      item,
      isLoading,
      openFileInput,
      file,
      previewFile,
      onFileChange,
      onClose,
      values,
    };
  },
});
</script>

<style scoped></style>
