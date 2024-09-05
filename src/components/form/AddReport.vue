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
          <h3 class="modal-title">แบบฟอร์มรายงานผลการปฏิบัติงาน</h3>
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
              <div class="col-12 col-lg-12">
                <div class="mb-7">
                  <label for="ppt_report_file" class="required form-label"
                    >อัพโหลดไฟล์นำเสนอ</label
                  >
                  <input
                    type="file"
                    id="formFile"
                    name="ppt_report_file"
                    @change="onFileChange"
                    ref="file"
                    :class="['form-control', { 'is-invalid': '' }]"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 col-lg-12">
                <div class="mb-7">
                  <label for="poster_report_file" class="required form-label"
                    >อัพโหลดไฟล์ Poster</label
                  >
                  <input
                    type="file"
                    id="formFile"
                    name="poster_report_file"
                    @change="onFileChange2"
                    ref="file2"
                    :class="['form-control', { 'is-invalid': '' }]"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 col-lg-12">
                <div class="mb-7">
                  <label for="report_file" class="required form-label"
                    >อัพโหลดไฟล์รายงาน PDF</label
                  >
                  <input
                    type="file"
                    id="formFile"
                    name="report_file"
                    @change="onFileChange3"
                    ref="file3"
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
    const file2 = ref<any>(null);
    const file3 = ref<any>(null);
    const previewFile = ref<any>(null);
    const success_data = ref<any>(null);

    const report_item = ref<any>({
      id: "",
      ppt_report_file: [],
      poster_report_file: [],
      report_file: [],
    });

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const selectOptions = ref({
      address_alls: <any>[],
    });

    const fields = ref([
      {
        name: "id",
        label: "id",
        model: "id",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ]);

    const validationSchema = Yup.object().shape({
      id: Yup.string().nullable().label("สถานที่ปฏิบัติงาน"),
      ppt_report_file: Yup.mixed().nullable().label("ไฟล์นำเสนอ"),
      poster_report_file: Yup.mixed().nullable().label("ไฟล์โปสเตอร์"),
      report_file: Yup.mixed().nullable().label("ไฟล์รายงาน"),
    });

    // Event

    const onFileChange = (event: any) => {
      report_item.value.ppt_report_file = event.target.files[0];
      console.log(report_item.value.ppt_report_file);
    };
    const onFileChange2 = (event: any) => {
      report_item.value.poster_report_file = event.target.files[0];
      console.log(report_item.value.poster_report_file);
    };
    const onFileChange3 = (event: any) => {
      report_item.value.report_file = event.target.files[0];
      console.log(report_item.value.report_file);
    };

    const { handleSubmit, setValues, values } = useForm({
      validationSchema: validationSchema,
      initialValues: report_item.value,
    });

    const onSubmit = handleSubmit(async (values) => {
      const {
        ppt_report_file,
        poster_report_file,
        report_file,
        ...otherValues
      } = values;

      Object.assign(report_item.value, otherValues);

      if (ppt_report_file instanceof File) {
        report_item.value.ppt_report_file = ppt_report_file;
      }
      if (poster_report_file instanceof File) {
        report_item.value.poster_report_file = poster_report_file;
      }
      if (report_file instanceof File) {
        report_item.value.report_file = report_file;
      }

      if (report_item.value.ppt_report_file.length == 0) {
        useToast("ไฟล์นำเสนอ จำเป็นต้องอัพโหลด", "error");
        return;
      }
      if (report_item.value.poster_report_file.length == 0) {
        useToast("ไฟล์ Poster จำเป็นต้องอัพโหลด", "error");
        return;
      }
      if (report_item.value.report_file.length == 0) {
        useToast("ไฟล์รายงาน จำเป็นต้องอัพโหลด", "error");
        return;
      }

      const { id } = report_item.value;

      let data_send = {
        ppt_report_file:
          report_item.value.ppt_report_file.length != 0
            ? report_item.value.ppt_report_file
            : undefined,
        poster_report_file:
          report_item.value.poster_report_file.length != 0
            ? report_item.value.poster_report_file
            : undefined,
        report_file:
          report_item.value.report_file.length != 0
            ? report_item.value.report_file
            : undefined,
        report_send_at: dayjs().format("YYYY-MM-DD"),
        form_status_id: 15,
      };

      Swal.fire({
        title: "ยืนยันการส่งรายงานผลการปฏิบัติงาน",
        text: "เมื่อส่งรายงานผลการปฏิบัติงานแล้วจะไม่สามารถแก้ไขข้อมูลได้",
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
            .then(({ status, data }) => {
              if (status != 200) {
                throw new Error("ERROR");
              }

              success_data.value = data;
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

          if (success_data.value.visitor_id) {
            await ApiService.query(
              `teacher-profile/${success_data.value.visitor_id}`,
              {
                ...data_send,
              }
            )
              .then(async ({ status, data }) => {
                if (status != 200) {
                  throw new Error("ERROR");
                }

                if (data.email) {
                  await ApiService.query(`helper/send-email/`, {
                    mailto: data.email,
                    subject: "แจ้งส่งรายงานผลการฏิบัติงาน",
                    body:
                      "นศ รหัส " +
                      student_profile.value.student_code +
                      " ส่งรายงานผลการฏิบัติงาน",
                  });
                }
              })
              .catch(({ response }) => {
                console.log(response);
              });
          }

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
      file,
      file2,
      file3,
      previewFile,
      onFileChange,
      onFileChange2,
      onFileChange3,
      onClose,
      values,
    };
  },
});
</script>

<style scoped></style>
