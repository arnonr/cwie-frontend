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
          <h3 class="modal-title">แบบฟอร์มออกหนังสือ</h3>

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
                  :required="field.required"
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
  reactive,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from "vue";
import ApiService from "@/core/services/ApiService";
import { Modal } from "bootstrap";
import useToast from "@/composables/useToast";
import { useForm } from "vee-validate";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";

import CustomField from "@/components/field/CustomField.vue";

export default defineComponent({
  name: "add-book",
  components: {
    CustomField,
  },
  props: {
    book_type: {
      type: String,
      required: true,
    },
    ids: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isLoading = ref<any>(false);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);
    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;
    const document_number = ref("เลขที่หนังสือ อว 7101(8)/สส");

    // Variable
    const item = reactive<any>({
      book_no: "จะได้รับเลขที่หนังสือเมื่อกดบันทึก",
      book_date: null,
      book_max_response_date: null,
    });

    const fields = ref([
      {
        name: "book_number",
        label: "เลขที่หนังสือ อว 7101(8)/สส.",
        model: "book_no",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: true,
        required: false,
      },
      {
        name: "book_date",
        label: "วันที่หนังสือ",
        model: "book_date",
        type: "datepicker",
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ]);

    if (props.book_type == "request_book") {
      fields.value.push({
        name: "book_res_date",
        label: "วันที่ต้องตอบรับ",
        model: "book_max_response_date",
        type: "datepicker",
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      });
      fields.value[0].label = "เลขที่หนังสือ อว 7101(8)/สอ.";
      document_number.value = "เลขที่หนังสือ อว 7101(8)/สอ.";
    }

    const validationSchema = Yup.object().shape({
      book_no: Yup.string().required().label("เลขที่หนังสือ"),
      book_date: Yup.string().required().label("วันที่หนังสือ"),
      book_max_response_date: Yup.string()
        .nullable()
        .label("วันที่ต้องตอบกลับ"),
    });

    // UI Event
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
    });

    onUnmounted(() => {
      if (mainModalRef.value) {
        mainModalRef.value.addEventListener("hidden.bs.modal", () =>
          onClose({ reload: false })
        );
      }
      mainModalObj.value.hide();
      emit("close-modal");
    });

    const { handleSubmit, setValues, values } = useForm({
      validationSchema: validationSchema,
      initialValues: item,
    });

    const onSubmit = handleSubmit(async (values: any) => {
      Object.assign(item, { ...values });
      const { book_date, book_max_response_date } = item;

      let data_send = {};

      let api = "";
      if (props.book_type == "request_book") {
        api = "form/add-request-book/";
        data_send = {
          request_book_date: dayjs(book_date).format("YYYY-MM-DD"),
          max_response_date: dayjs(book_max_response_date).format("YYYY-MM-DD"),
          id: props.ids,
        };
      }

      if (props.book_type == "send_book") {
        api = "form/add-send-book/";
        data_send = {
          send_book_date: dayjs(book_date).format("YYYY-MM-DD"),
          id: props.ids,
        };
      }

      await ApiService.postFormData(api, {
        ...data_send,
      })
        .then(({ status, data }) => {
          if (status != 200) {
            throw new Error("ERROR");
          }
          Swal.fire({
            title: "บันทึกข้อมูลเสร็จสิ้น",
            text: "เลขที่หนังสือ " + document_number.value + data.number,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "ปิด",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-primary",
            },
          }).then((res: any) => {
            onClose({ reload: true });
          });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    });

    return {
      // errors
      mainModalRef,
      isLoading,
      onClose,
      onSubmit,
      fields,
    };
  },
});
</script>
