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
          <h3 class="modal-title">แบบฟอร์มจับคู่อาจารย์นิเทศ</h3>
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
                  <label for="import_file" class="required form-label"
                    >อัพโหลด Excel
                  </label>
                  <input
                    type="file"
                    id="formFile"
                    name="import_file"
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
                  >**ตรวจสอบข้อมูลให้ถูกต้องก่อนกดปุ่ม Import**
                </span>
              </div>
              <div class="col-12 text-center">
                <button
                  ref="submitButtonRef"
                  type="submit"
                  id="kt_modal_new_address_submit"
                  class="btn btn-success"
                >
                  <span class="indicator-label"> Import </span>
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
import { fetchSemesters } from "@/composables/useFetchSelectionData";
// Components
import CustomField from "@/components/field/CustomField.vue";
import useToast from "@/composables/useToast";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "import-visitor",
  components: {
    CustomField,
  },
  setup(props, { emit }) {
    // UI
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    // Variable
    const isLoading = ref(true);
    const file = ref<any>(null);
    const previewFile = ref<any>(null);
    const importResult = ref<any>([]);

    const import_item = ref<any>({
      semester_id: "",
    });

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const selectOptions = ref({
      semesters: <any>[],
    });

    const fields = ref([
      {
        name: "semester_id",
        label: "ปีการศึกษา",
        model: "semester_id",
        select_label: "name",
        type: "v-select",
        options: computed(() => selectOptions.value.semesters),
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ]);

    const validationSchema = Yup.object().shape({
      semester_id: Yup.object().required().label("ปีการศึกษา"),
      import_file: Yup.mixed().nullable().label("ไฟล์ Import"),
    });

    // Event

    const onFileChange = (event: any) => {
      import_item.value.import_file = event.target.files[0];
      console.log(import_item.value.import_file);
    };

    const { handleSubmit, setValues, values } = useForm({
      validationSchema: validationSchema,
      initialValues: import_item.value,
    });

    const readFileAsync = (file: any) => {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
          let data: any = reader.result;
          data = new Uint8Array(data);

          let workbook = XLSX.read(data, { type: "array" });
          let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          let result = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
          resolve(result);
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
      });
    };

    const onSubmit = handleSubmit(async (values) => {
      const { import_file, ...otherValues } = values;

      Object.assign(import_item.value, otherValues);
      if (import_file instanceof File) {
        import_item.value.import_file = import_file;
      }

      if (import_item.value.import_file.length == 0) {
        useToast("ไฟล์ Excel จำเป็นต้องอัพโหลด", "error");
        return;
      }

      const { semester_id } = import_item.value;

      //

      let importFile = null;
      importFile = import_item.value.import_file;
      let result: any = await readFileAsync(importFile);
      result.shift();

      let data: any = [];
      result.forEach((el: any) => {
        if (el.length != 0) {
          let s_firstname = "";
          let s_surname = "";

          if (el[12] != "" && el[12] != null) {
            let arr_prefix = el[12].split(".");
            let fullname = arr_prefix[arr_prefix.length - 1];
            let arr_name = fullname.split(" ");

            s_firstname = arr_name[0];
            for (let i = 0; i < arr_name.length; i++) {
              if (i != 0) {
                s_surname = s_surname + arr_name[i] + " ";
              }
            }

            s_surname = s_surname.trim();
          }
          data.push({
            level: el[0],
            student_code: el[1].replace("'", ""),
            student_fullname: el[2],
            visitor_fullname: el[12],
            first_name: s_firstname,
            last_name: s_surname,
          });
        }
      });

      let data_send = {
        semester_id: semester_id?.id,
        students: [...data],
      };


      await ApiService.post(`form/map-teacher-student`, {
        ...data_send,
      })
        .then(({ status, data }) => {
          if (status != 200) {
            throw new Error("ERROR");
          }

          data = data.map((e: any) => {
            let check = data.data.find((x) => {
              return x.student_code == e.student_code;
            });
            if (check) {
              e["status"] = check.status;
              e["message"] = check.message;
            }

            return e;
          });

          console.log(data);

          importResult.value = [...data];
        })
        .catch(({ response }) => {
          console.log(response);
        });
      useToast("นำเข้าเสร็จสิ้น", "success");
    //   onClose({ reload: true });

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

      selectOptions.value.semesters = await fetchSemesters({});
      selectOptions.value.semesters = selectOptions.value.semesters.map(
        (x: any) => {
          x.name = `${x.term}/${x.year}`;
          return x;
        }
      );

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
      isLoading,
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
