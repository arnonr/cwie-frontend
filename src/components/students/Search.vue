<template>
  <div>
    <div class="accordion" id="accordionSearch">
      <div class="accordion-item">
        <h6
          class="accordion-header accordion-button p-5"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="false"
          aria-controls="collapseOne"
        >
          <i class="fa fa-search pe-2"></i> ค้นหาใบสมัคร
        </h6>
        <div
          id="collapseOne"
          class="accordion-collapse collapse hide"
          data-bs-parent="#accordionSearch"
        >
          <div class="accordion-body">
            <div class="row ps-5 pe-5 ps-md-0 pe-md-0">
              <CustomField
                v-for="field in fields"
                :key="field.name"
                :label="field.label"
                :field="field.model"
                :component-type="field.type"
                :colClass="field.colClass"
                :disabled="field.disabled"
                :options="field.options"
                :select_label="field.select_label"
                :required="false"
                :reloadSelect="field.reloadSelect"
                :placeholder="field.placeholder"
                @reload-select="
                  (searchQuery) =>
                    fetchSelectionData(field.fetchName, searchQuery)
                "
                @reset-select="() => fetchResetSelectionData(field.name)"
              />
            </div>
            <div class="pt-5">
              <button class="btn btn-success" @click="onSearch()">ค้นหา</button>
              <button class="btn btn-danger ms-2" @click="onClear()">
                ล้าง
              </button>
              <!-- <button
                id="kt_search_toggle"
                class="btn btn-primary float-end"
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                data-bs-dismiss="click"
                data-bs-trigger="hover"
              >
                ค้นหาเพิ่มเติม
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Advanced Search -->
    <div
      id="kt_search"
      class="bg-body"
      data-kt-drawer="true"
      data-kt-drawer-name="search"
      data-kt-drawer-activate="true"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'400px', 'md': '600px'}"
      data-kt-drawer-direction="end"
      data-kt-drawer-toggle="#kt_search_toggle"
      data-kt-drawer-close="#kt_search_close"
    >
      <!--begin::Card-->
      <div class="card shadow-none rounded-0 w-100">
        <div class="card-header" id="kt_search_header">
          <h5 class="card-title fw-semibold text-gray-600">ค้นหาเพิ่มเติม</h5>

          <div class="card-toolbar">
            <button
              type="button"
              class="btn btn-sm btn-icon explore-btn-dismiss me-n5"
              id="kt_search_close"
            >
              <KTIcon icon-name="cross" icon-class="fs-2" />
            </button>
          </div>
        </div>
        <!--end::Header-->

        <!--begin::Body-->
        <div class="card-body" id="kt_search_body">
          <!--begin::Content-->
          <div
            id="kt_search_scroll"
            class="hover-scroll-overlay-y ps-5 pe-5 pt-5 ps-md-0 pe-md-0 pt-md-0"
            data-kt-scroll="true"
            data-kt-scroll-height="auto"
            data-kt-scroll-wrappers="#kt_search_body"
            data-kt-scroll-dependencies="#kt_search_header"
            data-kt-scroll-offset="5px"
          >
            <!--end::Support-->
            <!--begin::Link-->

            <h4>ค้นหาจากข้อมูลร้องเรียน</h4>

            <div class="mb-7">
              <button class="btn btn-success fw-bold" @click="onSearch()">
                ค้นหา
              </button>
              <button class="btn btn-danger ms-2 fw-bold" @click="onClear()">
                ล้าง
              </button>
            </div>

            <!--end::Link-->
          </div>
          <!--end::Content-->
        </div>
        <!--end::Body-->
      </div>
      <!--end::Card-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watch, ref, onMounted, computed } from "vue";

import CustomField from "@/components/field/CustomField.vue";
// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Vee validate
import { useForm } from "vee-validate";
import * as Yup from "yup";

// Import Datepicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

import {
  fetchTeachers,
  fetchCompanies,
  fetchSemesters,
  fetchDivisions,
  fetchFaculties,
  fetchFormStatuses,
} from "@/composables/useFetchSelectionData";
// Components

// Import Store

export default defineComponent({
  name: "search-form",
  components: {
    vSelect,
    VueDatePicker,
    CustomField,
  },
  props: {
    search: {
      type: Object,
      required: true,
    },
    state_new: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, { emit }) {
    // Variable
    const { search } = toRefs(props);

    const selectOptions = ref<any>({
      semesters: [],
      divions: [],
      faculties: [],
      companies: [],
      advisors: [],
      visotors: [],
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
        colClass: "col-lg-4",
        disabled: false,
      },

      {
        name: "faculty_id",
        label: "คณะ",
        model: "faculty_id",
        select_label: "name",
        type: "v-select",
        options: computed(() => selectOptions.value.faculties),
        placeholder: "",
        colClass: "col-lg-4",
        disabled: false,
      },
      {
        name: "division_id",
        label: "สาขาวิชา",
        model: "division_id",
        select_label: "name",
        type: "v-select",
        options: computed(() => selectOptions.value.divisions),
        placeholder: "",
        colClass: "col-lg-4",
        disabled: false,
      },
      {
        name: "company_id",
        label: "สถานประกอบการ",
        model: "company_id",
        select_label: "name",
        type: "v-select",
        options: computed(() => selectOptions.value.companies),
        placeholder: "พิมพ์ 3 ตัวอักษร เพื่อค้นหา",
        colClass: "col-lg-4",
        disabled: false,
        reloadSelect: true,
        fetchName: "Companies",
      },

      {
        name: "student_code",
        label: "รหัสนักศึกษา",
        model: "student_code",
        type: "text",
        placeholder: "",
        colClass: "col-lg-4",
        disabled: false,
      },
      {
        name: "search_name",
        label: "ชื่อ-นามสกุล",
        model: "search_name",
        type: "text",
        placeholder: "",
        colClass: "col-lg-4",
        disabled: false,
      },
      {
        name: "advisor_id",
        label: "อาจารย์ที่ปรึกษา",
        model: "advisor_id",
        select_label: "fullname",
        type: "v-select",
        options: computed(() => selectOptions.value.advisors),
        placeholder: "",
        colClass: "col-lg-4",
        disabled: false,
      },
      {
        name: "visitor_id",
        label: "อาจารย์นิเทศ",
        model: "visitor_id",
        select_label: "fullname",
        type: "v-select",
        options: computed(() => selectOptions.value.visitors),
        placeholder: "",
        colClass: "col-lg-4",
        disabled: false,
      },
      {
        name: "form_status_id",
        label: "สถานะฟอร์ม",
        model: "form_status_id",
        select_label: "name",
        type: "v-select",
        options: computed(() => selectOptions.value.form_statuses),
        placeholder: "",
        colClass: "col-lg-4",
        disabled: false,
        reloadSelect: false,
        fetchName: "FormStatuses",
      },
    ]);

    const format = (date: any) => {
      const day = dayjs(date).locale("th").format("DD");
      const month = dayjs(date).locale("th").format("MMM");
      const year = date.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    };

    const validationSchema = Yup.object().shape({
      //   prefix: Yup.string().required().label("คำนำหน้า"),
      student_code: Yup.string().nullable().label("รหัสนักศึกษา"),
      advisor_id: Yup.object().nullable().label("อาจารย์ที่ปรึกษา"),
    });

    const { handleSubmit, setValues, resetForm } = useForm({
      validationSchema: validationSchema,
      initialValues: props.search,
    });

    const onSearch = handleSubmit(async (values) => {
      const { ...otherValues } = values;
      Object.assign(props.search, otherValues);
      emit("search");
    });

    const onClear = () => {
      resetForm(); // รีเซ็ตฟอร์มไปยังค่าเริ่มต้น
      emit("clear");
    };

    const fetching = {
      Semesters: async () => {
        selectOptions.value.semesters = await fetchSemesters({
          is_active: true,
        });

        selectOptions.value.semesters = selectOptions.value.semesters.map(
          (x: any) => {
            x.name = `${x.term}/${x.year}`;
            return x;
          }
        );
      },
      Disivions: async (searchQuery: string) => {
        selectOptions.value.divisions = await fetchDivisions({
          is_active: true,
          name: searchQuery,
          selectField: JSON.stringify({
            id: true,
            name: true,
          }),
        });
      },
      Faculties: async (searchQuery: string) => {
        selectOptions.value.faculties = await fetchFaculties({
          is_active: true,
          name: searchQuery,
          selectField: JSON.stringify({
            id: true,
            name: true,
          }),
        });
      },
      Companies: async (searchQuery: string) => {
        selectOptions.value.companies = await fetchCompanies({
          is_active: true,
          name: searchQuery,
          selectField: JSON.stringify({
            id: true,
            name: true,
          }),
        });
      },

      Advisors: async (searchQuery: string) => {
        selectOptions.value.advisors = await fetchTeachers({
          is_active: true,
          firstname: searchQuery,
          selectField: JSON.stringify({
            id: true,
            fullname: true,
          }),
        });
      },
      Visitors: async (searchQuery: string) => {
        selectOptions.value.visitors = await fetchTeachers({
          is_active: true,
          firstname: searchQuery,
          selectField: JSON.stringify({
            id: true,
            fullname: true,
          }),
        });
      },
      FormStatuses: async (searchQuery: string) => {
        selectOptions.value.form_statuses = await fetchFormStatuses({
          is_active: true,
        });
      },
    };

    const fetchSelectionData = (field_name: any, searchQuery: string) => {
      fetching[field_name](searchQuery);
    };

    const fetchResetSelectionData = (field_name: string) => {};

    onMounted(async () => {
      await fetching.Semesters();
      await fetching.Faculties("");
      await fetching.Advisors("");
      await fetching.Visitors("");
      await fetching.FormStatuses("");
    });

    return {
      selectOptions,
      search,
      onSearch,
      onClear,
      format,
      fields,
      fetchSelectionData,
      fetchResetSelectionData,
    };
  },
});
</script>

<style scoped>
.form-control {
  border-color: #800001;
  border-width: 0.1em;
}
</style>
