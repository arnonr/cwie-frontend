<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="teacher-modal"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">แบบฟอร์มแก้ไขข้อมูล</h3>
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
                  <span class="indicator-label"> บันทึกข้อมูล </span>
                  <span class="indicator-progress">
                    Please wait...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>

                <button
                  @click="onClose({ reload: false })"
                  type="button"
                  class="btn btn-danger ms-2"
                >
                  ยกเลิก
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
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";

import ApiService from "@/core/services/ApiService";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
// Vee validate
import { useForm } from "vee-validate";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
// Use Composables
import {
  fetchGroups,
  fetchUserStatuses,
} from "@/composables/useFetchSelectionData";
// Components
import CustomField from "@/components/field/CustomField.vue";
import useToast from "@/composables/useToast";

export default defineComponent({
  name: "edit-teacher-profile-form",
  components: {
    CustomField,
  },
  props: {
    id: Number,
  },
  setup(props, { emit }) {
    // UI
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    // Variable
    const isLoading = ref(true);

    const item = ref<any>({
      id: null,
      name: "",
      username: "",
      phone: "",
      email: "",
      group_id: null,
      status_id: null,
    });

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const selectOptions = ref({
      groups: <any>[],
      user_statuses: <any>[],
    });

    const fields = ref([
      {
        name: "prefix",
        label: "คำนำหน้า",
        model: "prefix",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "firstname",
        label: "ชื่อ",
        model: "firstname",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "surname",
        label: "นามสกุล",
        model: "surname",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "phone",
        label: "เบอร์โทรศัพท์",
        model: "phone",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "email",
        label: "Email",
        model: "email",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "user_id",
        label: "จับคู่อาจารย์ & ผู้ใช้งาน",
        model: "user_id",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "faculty_name",
        label: "คณะ",
        model: "faculty_name",
        select_label: "name",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: true,
      },
      {
        name: "department_name",
        label: "ภาควิชา",
        model: "department_name",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: true,
      },
    ]);

    const validationSchema = Yup.object().shape({
      prefix: Yup.string().nullable().label("คำนำหน้า"),
      firstname: Yup.string().nullable().label("ชื่อ"),
      surname: Yup.string().nullable().label("นามสกุล"),
      phone: Yup.string().nullable().label("เบอร์โทรศัพท์"),
      email: Yup.string().nullable().label("เมล"),
      user_id: Yup.number().nullable().label("ผู้ใช้งาน"),
    });

    // fetch
    const fetchTecherProfile = async () => {
      const { data } = await ApiService.query(
        `teacher-profile/${props.id}`,
        {}
      );

      const {
        prefix,
        firstname,
        surname,
        phone,
        email,
        faculty_detail,
        department_detail,
      } = data.data;

      item.value = {
        ...data.data,
        faculty_name: faculty_detail.name,
        department_name: department_detail.name,
      };

      setValues(item.value);
    };
    fetchTecherProfile();

    // Event

    const { handleSubmit, setValues } = useForm({
      validationSchema: validationSchema,
      initialValues: item.value,
    });

    const onSubmit = handleSubmit(async (values) => {
      item.value = { ...values };

      const { phone, email, prefix, firstname, surname, user_id } = item.value;

      let data_send = {
        phone,
        email,
        prefix,
        firstname,
        surname,
        user_id,
      };

      Swal.fire({
        title: "ยืนยันการแก้ไข",
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
          await ApiService.post(`teacher-profile/${props.id}`, {
            ...data_send,
          })
            .then(({ status }) => {
              if (status != 200) {
                throw new Error("ERROR");
              }
              useToast("แก้ไขข้อมูลเสร็จสิ้น", "success");
              onClose({ reload: true });
            })
            .catch(({ response }) => {
              console.log(response);
            });
        } else {
        }
      });

      //
    });

    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();

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

      selectOptions.value.user_statuses = await fetchUserStatuses({});
      selectOptions.value.groups = await fetchGroups({});

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
      onClose,
    };
  },
});
</script>

<style scoped></style>
