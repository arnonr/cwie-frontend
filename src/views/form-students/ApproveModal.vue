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
          <h3 class="modal-title">พิจารณาอนุมัติ</h3>
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
            </div>

            <div class="text-center mt-6">
              <button
                @click="onClose({ reload: false })"
                type="button"
                class="btn btn-danger mt-6"
              >
                ยกเลิก
              </button>
              <button
                ref="submitButtonRef"
                type="submit"
                id="kt_modal_new_address_submit"
                class="btn btn-success mt-6 ms-2"
              >
                <span class="indicator-label"> บันทึก </span>
                <span class="indicator-progress">
                  Please wait...
                  <span
                    class="spinner-border spinner-border-sm align-middle"
                  ></span>
                </span>
              </button>
            </div>
          </form>
        </div>
        <Preloader :isLoading="isLoading" :position="'absolute'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";
import ApiService from "@/core/services/ApiService";
import { Modal } from "bootstrap";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { useForm } from "vee-validate";
import * as Yup from "yup";
import useToast from "@/composables/useToast";
import Preloader from "@/components/preloader/Preloader.vue";
import CustomField from "@/components/field/CustomField.vue";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

export default defineComponent({
  name: "approve-modal",
  props: {
    item: {
      type: Object,
      required: true,
    },
    reject_status_id: {
      type: Number,
      required: true,
    },
    approve_at: {
      type: String,
      required: true,
    },
  },
  components: {
    Preloader,
    CustomField,
  },

  setup(props, { emit }) {
    const isLoading = ref<any>(true);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    const selectOptions = ref({
      approve_statuses: <any>[
        { id: 1, name: "อนุมัติ" },
        { id: 2, name: "ส่งกลับให้แก้ไข" },
      ],
    });
    if (props.item.form_status_id == 17) {
      selectOptions.value.approve_statuses =
        selectOptions.value.approve_statuses.filter(
          (status: any) => status.id !== 2
        );
    }

    const approve_item = ref<any>({
      approve_status_id: { id: 1, name: "อนุมัติ" },
      comment: "",
    });
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    // เอาค่า
    const form_status_id = ref(props.item.form_status_id);

    const fields = ref([
      {
        name: "approve_status_id",
        label: "เลือกอนุมัติ",
        model: "approve_status_id",
        type: "v-select",
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
        options: computed(() => selectOptions.value.approve_statuses),
      },
      {
        name: "comment",
        label: "หมายเหตุ",
        model: "comment",
        type: "textArea",
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
        options: [],
      },
    ]);

    const validationSchema = Yup.object().shape({
      approve_status_id: Yup.object().required().label("สถานะ"),
      comment: Yup.string().nullable().label("หมายเหตุ"),
    });

    const { handleSubmit, setValues } = useForm({
      validationSchema: validationSchema,
      initialValues: approve_item.value,
    });

    const onSubmit = handleSubmit(async (values) => {
      approve_item.value = { ...values };
      console.log("Form Submitted:", values);

      let _at = {};
      if (approve_item.value.approve_status_id.id === 1) {
        if (form_status_id.value == 2) {
          form_status_id.value = 4;
        } else if (form_status_id.value == 8) {
          if (props.item.response_result == 1) {
            form_status_id.value = 10;
          } else {
            form_status_id.value = 97;
          }
        } else if (form_status_id.value == 12) {
          form_status_id.value = 14;
        } else if (form_status_id.value == 15) {
          form_status_id.value = 17;
        } else if (form_status_id.value == 17) {
          form_status_id.value = 18;
        } else {
          form_status_id.value = form_status_id.value + 1;
        }

        _at[props.approve_at] = dayjs().format("YYYY-MM-DD");
      } else {
        if (form_status_id.value == 8) {
          form_status_id.value = 9;
        } else if (form_status_id.value == 12) {
          form_status_id.value = 13;
        } else if (form_status_id.value == 15) {
          form_status_id.value = 16;
        } else {
          form_status_id.value = 3;
        }

        await ApiService.post(`reject-log`, {
          comment: approve_item.value.comment,
          form_id: props.item.id,
          user_id: userData.id,
          reject_status_id: props.reject_status_id,
        });
      }

      if (form_status_id.value == 97) {
        await ApiService.delete("form/cancel/" + props.item.id);

        await ApiService.post(`student-profile/${props.item.student_id}`, {
          status_id: 1,
        })
          .then(({ status }) => {
            if (status != 200) {
              throw new Error("ERROR");
            }
          })
          .catch(({ response }) => {
            console.log(response);
          });
      } else {
        await ApiService.post(`form/${props.item.id}`, {
          form_status_id: form_status_id.value,
          reject_status_id:
            approve_item.value.approve_status_id.id != 1
              ? props.reject_status_id
              : undefined,
          ..._at,
        });

        await ApiService.post(`student-profile/${props.item.student_id}`, {
          status_id: form_status_id.value,
        });
      }

      useToast("บันทึกข้อมูลเสร็จสิ้น");
      onClose({ reload: true });
    });

    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      emit("close-modal");
    };

    onMounted(() => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );

      isLoading.value = false;
    });

    onUnmounted(() => {
      if (mainModalRef.value) {
        mainModalRef.value.removeEventListener("hidden.bs.modal", onClose);
      }
      mainModalObj.value.hide();
      emit("close-modal");
    });

    return {
      isLoading,
      mainModalRef,
      onClose,
      onSubmit,
      selectOptions,
      fields,
    };
  },
});
</script>

<style scoped>
.separator.separator-dotted {
  border-bottom-color: #ccc;
}
th {
  vertical-align: middle;
}
</style>
