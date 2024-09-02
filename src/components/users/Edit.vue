<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="company-modal"
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
                  ปิด
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
import {
  fetchGroups,
  fetchUserStatuses,
} from "@/composables/useFetchSelectionData";
// Components
import CustomField from "@/components/field/CustomField.vue";
import useToast from "@/composables/useToast";

export default defineComponent({
  name: "edit-user-form",
  components: {
    CustomField,
  },
  props: {
    id: String,
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
        name: "name",
        label: "ชื่อ",
        model: "name",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: true,
      },
      {
        name: "username",
        label: "ICIT Account",
        model: "username",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: true,
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
        name: "group_id",
        label: "สิทธิ",
        model: "group_id",
        select_label: "name",
        type: "v-select",
        options: computed(() => selectOptions.value.groups),
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "status_id",
        label: "สถานะ",
        model: "status_id",
        select_label: "name",
        type: "v-select",
        options: computed(() => selectOptions.value.user_statuses),
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ]);

    const validationSchema = Yup.object().shape({
      phone: Yup.string().nullable().label("เบอร์โทรศัพท์"),
      email: Yup.string().nullable().label("เมล"),
      group_id: Yup.object().required().label("สิทธิ"),
      status_id: Yup.object().required().label("สถานะ"),
    });

    // fetch
    const fetchUser = async () => {
      const { data } = await ApiService.query(`user/${props.id}`, {});

      const { phone, email, group_id, status_id, group_detail, status_detail } =
        data.data;

      item.value = {
        ...data.data,
        group_id: {
          id: group_id,
          name: group_detail.name,
        },
        status_id: {
          id: status_id,
          name: status_detail.name,
        },
        phone: phone,
        email: email,
      };

      setValues(item.value);
    };
    fetchUser();

    // Event

    const { handleSubmit, setValues } = useForm({
      validationSchema: validationSchema,
      initialValues: item.value,
    });

    const onSubmit = handleSubmit(async (values) => {
      item.value = { ...values };

      const { phone, email, group_id, status_id, id } = item.value;

      let data_send = {
        phone,
        email,
        group_id: group_id?.id,
        status_id: status_id?.id,
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
          await ApiService.put(`user/${props.id}`, {
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
