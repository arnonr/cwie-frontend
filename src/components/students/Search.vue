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
          <i class="fa fa-search pe-2"></i> ค้นหาเรื่องร้องเรียน
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
                :required="false"
              />

              <!-- <div>
                <label for="">ปีการศึกษา : </label>
                <v-select
                  :id="'slt-search-'+"
                  name="slt-search-"
                  label="name"
                  placeholder="ทั้งหมด"
                  :options="selectOptions.semesters"
                  v-model="search.semester_id"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div> -->

              <!--    <div>
                <label for="">หมวดหมู่เรื่อง : </label>
                <v-select
                  id="slt-search-complain-type-id-2"
                  name="slt-search-complain-type-id-2"
                  label="name_th"
                  placeholder="ทั้งหมด"
                  :options="selectOptions.complaint_types"
                  v-model="search.complaint_type_id"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div>
              <div class="col-12 col-md-4 my-2">
                <label for="">ปีที่ร้องเรียน</label>
                <v-select
                  id="slt-search-year"
                  name="slt-search-year"
                  label="name"
                  placeholder="ปีที่ร้องเรียน"
                  :options="selectOptions.years"
                  v-model="search.year"
                  :reduce="(year: any) => year.value"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div>

              <div class="col-12 col-md-8 my-2">
                <label for="">เรื่องร้องเรียน</label>
                <input
                  type="text"
                  id="txt-search-complain-title"
                  name="txt-search-complain-title"
                  class="form-control"
                  v-model="search.complaint_title"
                />
              </div>
              <div class="col-12 col-md-4 my-2">
                <label for="">เลขคำร้องเรียน (Jcom No)</label>
                <input
                  type="text"
                  id="txt-search-complain-code"
                  name="txt-search-complain-code"
                  class="form-control"
                  v-model="search.jcoms_no"
                />
              </div>
              <div class="col-12 col-md-4 my-2">
                <label for="">ชื่อผู้ร้อง</label>
                <input
                  type="text"
                  id="txt-search-complain-fullname"
                  name="txt-search-complain-fullname"
                  class="form-control"
                  v-model="search.complainant_fullname"
                />
              </div>

              <div class="col-12 col-md-4 my-2">
                <label for="">ชื่อผู้ถูกร้อง</label>
                <input
                  type="text"
                  id="txt-search-accused-fullname"
                  name="txt-search-accused-fullname"
                  class="form-control"
                  v-model="search.accused_fullname"
                />
              </div>

              <div class="col-12 col-md-4 my-2">
                <label for="">บช./ภ.</label>
                <v-select
                  id="slt-search-bureau-id"
                  name="slt-search-bureau-id"
                  label="name_th_abbr"
                  placeholder="บช./ภ."
                  :options="selectOptions.bureaus"
                  v-model="search.bureau_id"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div>
              <div class="col-12 col-md-4 my-2">
                <label for="">บก./ภ.จว.</label>
                <v-select
                  id="slt-search-division-id"
                  name="slt-search-division-id"
                  label="name_th_abbr"
                  placeholder="บก./ภ.จว."
                  :options="selectOptions.divisions"
                  v-model="search.division_id"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div>

              <div class="col-12 col-md-4 my-2">
                <label for="">หน่วยงาน(สถานีตำรวจ)</label>
                <v-select
                  id="slt-search-agency-id"
                  name="slt-search-agency-id"
                  label="name_th_abbr"
                  placeholder="หน่วยงาน(สถานีตำรวจ)"
                  :options="selectOptions.agencies"
                  v-model="search.agency_id"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div>

              <div class="col-6 col-md-6 my-2">
                <label for="">สถานะเรื่องร้องเรียน</label>
                <v-select
                  id="slt-search-proceed-state-2"
                  name="slt-search-procees-state-2"
                  label="name_th"
                  placeholder="สถานะเรื่องร้องเรียน"
                  :options="selectOptions.states"
                  v-model="search.state_id"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div>
              <div class="col-6 col-md-6 my-2">
                <label for="">สถานะกองตรวจดำเนินการ</label>
                <v-select
                  id="slt-search-proceed-state-2"
                  name="slt-search-procees-state-2"
                  label="name_th"
                  placeholder="สถานะกองตรวจดำเนินการ"
                  :options="selectOptions.inspector_states"
                  v-model="search.inspector_state_id"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div>-->
            </div>
            <div class="pt-5">
              <button class="btn btn-success" @click="onSearch()">ค้นหา</button>
              <button class="btn btn-danger ms-2" @click="onClear()">
                ล้าง
              </button>
              <button
                id="kt_search_toggle"
                class="btn btn-primary float-end"
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                data-bs-dismiss="click"
                data-bs-trigger="hover"
              >
                ค้นหาเพิ่มเติม
              </button>
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

import CustomField from "@/Components/field/CustomField.vue";
// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// Import Datepicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

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
      years: [],
      complain_statuses: [
        { name: "รอตรวจสอบ/รับเรื่อง", value: 1 },
        { name: "อยู่ระหว่างดำเนินการ", value: 2 },
        { name: "รอรายงานผล", value: 3 },
        { name: "เสร็จสิ้น", value: 4 },
      ],
      is_anonymouses: [
        { name: "ระบุตัวตน", value: 1 },
        { name: "ไม่ระบุตัวตน", value: 2 },
      ],
      dayornight: [
        {
          name: "กลางวัน",
          value: 1,
        },
        { name: "กลางคืน", value: 2 },
      ],
      organizations: [],
      states: [],
      perPage: [
        { title: "20", value: 20 },
        { title: "40", value: 40 },
        { title: "60", value: 60 },
      ],
      inspectors: [],
      bureaus: [],
      divisions: [],
      agency: [],
      provinces: [],
      districts: [],
      subdistricts: [],
      complaint_types: [],
      topic_categories: [],
      topic_types: [],
      prefix_names: [],
    });

    const fields = ref([
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
        name: "student_fullname",
        label: "ชื่อ-นามสกุล",
        model: "student_fullname",
        type: "text",
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
    ]);

    const format = (date: any) => {
      const day = dayjs(date).locale("th").format("DD");
      const month = dayjs(date).locale("th").format("MMM");
      const year = date.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    };

    // const calYear = () => {
    //   let year = new Date().getFullYear();
    //   for (let i = 0; i <= 10; i++) {
    //     selectOptions.value.years.push({
    //       name: year - i + 543,
    //       value: Number(year - i),
    //     });
    //   }
    //   selectOptions.value.years.push({
    //     name: "ทั้งหมด",
    //     value: null,
    //   });
    // };
    // calYear();

    const onSearch = () => {
      emit("search");
    };

    const onClear = () => {
      emit("clear");
    };

    // //

    // onMounted(async () => {
    //   selectOptions.value.prefix_names =
    //     await searchComplaintStore.fetchPrefixName({
    //       is_active: 1,
    //       perPage: 500,
    //     });

    //   let states = await searchComplaintStore.fetchState({
    //     perPage: 500,
    //   });

    //   if (props.state_new == true) {
    //     selectOptions.value.states = states.filter((x: any) => {
    //       return x.id == 1 || x.id == 18;
    //     });
    //   } else {
    //     selectOptions.value.states = states.filter((x: any) => {
    //       return (
    //         x.id != 1 &&
    //         x.id != 18 &&
    //         x.id != 4 &&
    //         x.id != 5 &&
    //         x.id != 6 &&
    //         x.id != 7 &&
    //         x.id != 8 &&
    //         x.id != 9 &&
    //         x.id != 13 &&
    //         x.id != 14 &&
    //         x.id != 21 &&
    //         x.id != 25 &&
    //         x.id != 26 &&
    //         x.id != 27 &&
    //         x.id != 32
    //       );
    //     });
    //   }

    //   selectOptions.value.inspectors =
    //     await searchComplaintStore.fetchInspector({
    //       perPage: 100000,
    //       orderBy: "name_th",
    //       order: "asc",
    //     });

    //   selectOptions.value.bureaus = await searchComplaintStore.fetchBureau({
    //     perPage: 100000,
    //     orderBy: "name_th",
    //     order: "asc",
    //   });

    //   selectOptions.value.provinces = await searchComplaintStore.fetchProvince({
    //     perPage: 100000,
    //     orderBy: "name_th",
    //     order: "asc",
    //   });

    //   selectOptions.value.complaint_types =
    //     await searchComplaintStore.fetchComplaintType({
    //       perPage: 100000,
    //     });

    //   selectOptions.value.complaint_channels =
    //     await searchComplaintStore.fetchComplaintChannel({
    //       perPage: 100000,
    //     });
    // });

    // // Watch
    // const defaultParams = { perPage: 100000, orderBy: "name_th", order: "asc" };
    // watch(
    //   () => search.value.inspector_id,
    //   async () => {
    //     search.value.bureau_id = null;
    //     search.value.division_id = null;
    //     search.value.agency_id = null;

    //     selectOptions.value.bureaus = await searchComplaintStore.fetchBureau({
    //       ...defaultParams,
    //       inspector_id: search.value.inspector_id?.id,
    //     });
    //   }
    // );

    // watch(
    //   () => search.value.bureau_id,
    //   async () => {
    //     search.value.division_id = null;
    //     search.value.agency_id = null;
    //     selectOptions.value.divisions = [];

    //     if (search.value.bureau_id) {
    //       selectOptions.value.divisions =
    //         await searchComplaintStore.fetchDivision({
    //           ...defaultParams,
    //           bureau_id: search.value.bureau_id?.id,
    //         });
    //     }
    //   }
    // );

    // watch(
    //   () => search.value.division_id,
    //   async () => {
    //     search.value.agency_id = null;
    //     selectOptions.value.agencies = [];

    //     if (search.value.division_id) {
    //       selectOptions.value.agencies = await searchComplaintStore.fetchAgency(
    //         {
    //           ...defaultParams,
    //           division_id: search.value.division_id?.id,
    //         }
    //       );
    //     }
    //   }
    // );

    // watch(
    //   () => search.value.province_id,
    //   async () => {
    //     search.value.district_id = null;
    //     search.value.sub_district_id = null;
    //     selectOptions.value.districts = [];

    //     if (search.value.province_id) {
    //       selectOptions.value.districts =
    //         await searchComplaintStore.fetchDistrict({
    //           ...defaultParams,
    //           province_id: search.value.province_id?.id,
    //         });
    //     }
    //   }
    // );

    // watch(
    //   () => search.value.district_id,
    //   async () => {
    //     search.value.sub_district_id = null;
    //     selectOptions.value.subdistricts = [];

    //     if (search.value.district_id) {
    //       selectOptions.value.subdistricts =
    //         await searchComplaintStore.fetchSubdistrict({
    //           ...defaultParams,
    //           district_id: search.value.district_id?.id,
    //         });
    //     }
    //   }
    // );

    // watch(
    //   () => search.value.complaint_type_id,
    //   async () => {
    //     search.value.topic_category_id = null;
    //     search.value.topic_type_id = null;
    //     selectOptions.value.topic_categories = [];

    //     if (search.value.complaint_type_id) {
    //       selectOptions.value.topic_categories =
    //         await searchComplaintStore.fetchTopicCategory({
    //           ...defaultParams,
    //           complaint_type_id: search.value.complaint_type_id?.id,
    //         });
    //     }
    //   }
    // );

    // watch(
    //   () => search.value.topic_category_id,
    //   async () => {
    //     search.value.topic_type_id = null;

    //     selectOptions.value.topic_types = [];

    //     if (search.value.topic_category_id) {
    //       selectOptions.value.topic_types =
    //         await searchComplaintStore.fetchTopicType({
    //           ...defaultParams,
    //           topic_category_id: search.value.topic_category_id?.id,
    //         });
    //     }
    //   }
    // );

    return {
      selectOptions,
      search,
      onSearch,
      onClear,
      format,
      fields,
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
