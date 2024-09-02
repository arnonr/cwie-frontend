<template>
  <tab-content title="ลำดับที่ 3">
    <form @submit.prevent="onSubmit">
      <div class="row" v-if="item.id && isLoading == false">
        <div class="col-12 mb-6">
          <h3>ข้อมูลเอกสาร</h3>
          <span>หมายเหตุ : โปรดระบุข้อมูลให้ครบถ้วน</span>
        </div>
        <div
          class="mb-7 col-12 col-lg-12"
          v-for="(d, idx) in documents"
          :key="d.document_type_id"
        >
          <label for="" class="required form-label">{{
            d.document_name
          }}</label>
          <div class="row">
            <div class="col-10 col-lg-10">
              <input
                type="file"
                @change="handleFileChange($event, idx)"
                :class="['form-control', { 'is-invalid': d.errors }]"
              />
            </div>
            <div class="col-2 col-lg-2">
              <a
                v-if="d.document_file_old"
                :href="d.document_file_old"
                target="_blank"
                class="btn btn-info ms-2"
              >
                <i class="fa fa-download"></i>
              </a>
            </div>
          </div>
          <span v-if="d.errors" class="text-danger">{{ d.errors }}</span>
        </div>

        <div class="row">
          <div class="d-flex justify-content-between w-100 mt-10">
            <button type="button" class="btn btn-info" @click="onPrevious()">
              <span class="indicator-label"> ย้อนกลับ </span>
              <span class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
            <button
              ref="submitButtonRef"
              type="submit"
              id="kt_modal_new_address_submit"
              class="btn btn-success"
            >
              <span class="indicator-label"> บันทึก </span>
              <span class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
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
  reactive,
} from "vue";

import ApiService from "@/core/services/ApiService";
import useToast from "@/composables/useToast";
// Vee validate
import { useForm } from "vee-validate";
import * as Yup from "yup";
// Import FormWizard
import { TabContent } from "vue3-form-wizard";
// Components
import CustomField from "@/components/field/CustomField.vue";

export default defineComponent({
  name: "student-profile-form-tab2",
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
    const isLoading = ref(true);
    const selectOptions = ref({
      document_types: [],
    });
    const documents = ref<any>([]);

    const validationSchema = Yup.object().shape({
      //   document_1: Yup.mixed().required().label("ใบเกรด"),
      //   document_2: Yup.mixed().required().label("Resume"),
    });

    // fetch
    const fetchDocumentTypes = async () => {
      try {
        const { data } = await ApiService.query("document-type/", {
          params: {
            is_active: true,
          },
        });
        selectOptions.value.document_types = data.data;
        documents.value = selectOptions.value.document_types.map((d: any) => {
          return reactive({
            id: null,
            document_file: null,
            document_file_old: ref(null),
            document_type_id: d.id,
            document_name: d.name,
            student_id: item.value.id,
            errors: "",
          });
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDocumentTypes();

    const fetchDocuments = async () => {
      try {
        const { data } = await ApiService.query("document/", {
          params: {
            student_id: item.value.id,
            is_active: true,
          },
        });

        documents.value = documents.value.map((d: any) => {
          let index = data.data.find((e: any) => {
            return d.document_type_id == e.document_type_id;
          });
          if (index) {
            d.id = index.id;
            d.document_file_old = index.document_file;
            d.document_file = [];
          }

          return d;
        });

      } catch (error) {
        console.log(error);
      }
    };

    // Event
    const onSubmit = async () => {
      let check = true;
      documents.value.forEach((el: any) => {
        if (el.document_file == null && el.document_file_old == null) {
          el.errors = el.document_name + " is a required field";
          check = false;
        }
      });

      if (!check) {
        return;
      }
      try {
        for (let index = 0; index < documents.value.length; index++) {
          let data_send = {
            document_name: documents.value[index].document_name,
            document_file:
              documents.value[index].document_file.length != 0
                ? documents.value[index].document_file
                : undefined,
            student_id: documents.value[index].student_id,
            document_type_id: documents.value[index].document_type_id,
          };

          if (documents.value[index].document_file.length != 0) {
            let url =
              documents.value[index].id != null
                ? `document/${documents.value[index].id}`
                : "document";
            await ApiService.putFormData(url, {
              ...data_send,
            })
              .then(({ data, status }) => {
                if (status != 200) {
                  throw new Error("ERROR");
                }
              })
              .catch(({ response }) => {
                console.log(response);
              });
          }
        }

        emit("on-finish");
      } catch (error) {
        console.log(error);
      }
    };

    const onPrevious = () => {
      emit("on-previous");
    };

    const handleFileChange = (event: any, idx: any) => {
      const file = event.target.files[0];
      if (file) {
        documents.value[idx].errors = "";
        documents.value[idx].document_file = file;
      }
    };

    // Mounted
    onMounted(async () => {
      isLoading.value = true;
      await fetchDocuments();

      isLoading.value = false;
    });

    onBeforeUnmount(() => {});

    // Return
    return {
      onSubmit,
      item,
      isLoading,
      onPrevious,
      documents,
      handleFileChange,
    };
  },
});
</script>

<style scoped></style>
