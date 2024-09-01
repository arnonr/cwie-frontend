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
                />
              </template>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import { Modal } from "bootstrap";
import useToast from "@/composables/useToast";
import { useForm } from "vee-validate";
import * as Yup from "yup";

import CustomField from "@/Components/field/CustomField.vue";

export default defineComponent({
  name: "add-book",
  components: {
    CustomField,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isLoading = ref<any>(false);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    // Variable
    const item = reactive<any>({
      book_no: "อว 7101(8)/",
      book_date: null,
    });

    const fields = ref([
      {
        name: "book_no",
        label: "เลขที่หนังสือ",
        model: "book_no",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
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

    const validationSchema = Yup.object().shape({
      book_no: Yup.string().required().label("เลขที่หนังสือ"),
      book_date: Yup.string().required().label("วันที่หนังสือ"),
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
      initialValues: item.value,
    });

    const onSubmit = handleSubmit(async (values: any) => {
      const { namecard_file, ...otherValues } = values;
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
