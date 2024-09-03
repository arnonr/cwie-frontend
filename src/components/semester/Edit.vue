<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="semester-modal"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">แบบฟอร์มแแก้ไขข้อมูล</h3>
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
  name: "edit-semester-form",
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
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const isLoading = ref(true);

    const item = ref<any>({
      term: "",
      year: "",
      is_active: null,
    });

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const selectOptions = ref({
      address_alls: <any>[],
    });

    const fields = ref([
      {
        name: "term",
        label: "เทอม",
        model: "term",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "year",
        label: "ปีการศึกษา",
        model: "year",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "is_active",
        label: "สถานะ",
        model: "is_active",

        select_label: "name",
        type: "v-select",
        options: [
          { id: true, name: "True" },
          { id: false, name: "False" },
        ],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ]);

    const validationSchema = Yup.object().shape({
      term: Yup.string().required().label("เทอม"),
      year: Yup.string().required().label("ปี"),
      is_active: Yup.object().required().label("สถานะ"),
    });

    // fetch
    const fetchItem = async () => {
      const { data } = await ApiService.query(`semester/${props.id}`, {});

      const { term, year, is_active } = data.data;

      item.value = {
        ...data.data,
        is_active:
          is_active == true
            ? { id: true, name: "True" }
            : { id: false, name: "False" },
      };

      setValues(item.value);
    };

    // Event

    const { handleSubmit, setValues } = useForm({
      validationSchema: validationSchema,
      initialValues: item.value,
    });

    const onSubmit = handleSubmit(async (values) => {
      const { ...otherValues } = values;

      Object.assign(item.value, otherValues);

      const { term, year, is_active } = item.value;

      let data_send = {
        term,
        year,
        is_active: is_active?.id,
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
          await ApiService.put(`semester/${props.id}`, {
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

          useToast("แก้ไขข้อมูลเสร็จสิ้น", "success");
          onClose({ reload: true });
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

      selectOptions.value.address_alls = await fetchAddressAlls({});
      fetchItem();
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
