<template>
  <!--begin::Wrapper-->
  <div class="container mt-5">
    <!--  -->
    <SearchComponent
      :search="search"
      @search="
        () => {
          paginationData.currentPage = 1;
          fetchItems();
        }
      "
      @clear="onClear"
    />

    <div class="card shadow-sm my-5">
      <div class="card-header bg-white">
        <h4 class="card-title">ใบสมัครโครงการ CWIE</h4>
        <div class="card-toolbar">
          <button
            class="btn btn-outline btn-outline-info btn-sm fs-7"
            @click="onchangeCurrentStatus('total')"
          >
            ทั้งหมด
          </button>

          <button
            class="btn btn-outline btn-outline-warning btn-sm fs-7 ms-2"
            @click="onchangeCurrentStatus('wating')"
          >
            รอจับคู่ ({{ items_wating_count }})
          </button>
          <button
            class="btn btn-outline btn-outline-success btn-sm fs-7 ms-2"
            @click="onchangeCurrentStatus('success')"
          >
            จับคู่แล้ว
          </button>
          <!-- buttons -->
        </div>
      </div>

      <div class="card-body" style="padding-bottom: 0px">
        <a
          class="btn btn-outline btn-outline-primary btn-sm fs-7 me-2"
          type="button"
          target="_blank"
          :href="template"
        >
          <i class="fa fa-file fs-4"></i>
          <span class="d-none d-lg-inline-block ms-2">ดาวน์โหลด Template</span>
        </a>

        <button
          class="btn btn-outline btn-outline-success btn-sm fs-7"
          type="button"
          @click="onImportModal"
        >
          <i class="fa fa-file fs-4"></i>
          <span class="d-none d-lg-inline-block ms-2">นำเข้าข้อมูล</span>
        </button>
      </div>

      <div
        class="card-body table-responsive d-none d-lg-block"
        style="min-height: 300px"
      >
        <Preloader :isLoading="isLoading" :position="'absolute'" />
        <ListComponent
          :items="items"
          :paginationData="paginationData"
          :sortKey="sortKey"
          :sortOrder="sortOrder"
          @update:currentPage="paginationData.currentPage = $event"
          @update:perPage="paginationData.perPage = $event"
          @sort="(key: any) => {
              sortedItems(key)}"
          @detail="(it: any) => {onFormDetailModal(it) }"
        />
      </div>
      <div class="card-body d-lg-none">
        <CardListComponent
          :items="items"
          :paginationData="paginationData"
          :sortKey="sortKey"
          :sortOrder="sortOrder"
          @update:currentPage="paginationData.currentPage = $event"
          @update:perPage="paginationData.perPage = $event"
          @sort="(key: any) => {
              sortedItems(key)}"
          @detail="(it: any) => {onFormDetailModal(it) }"
        />
      </div>
      <div class="card-footer">
        <div class="dropdown mt-5 float-right">
          <button
            class="btn btn-outline btn-outline-success btn-sm fs-7"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fa fa-download fs-4"></i>
            <span class="d-none d-lg-inline-block ms-2">ส่งออกข้อมูล</span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" @click="onExport()">Excel</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div>
      <!-- Detail Form Modal -->
      <div id="detail-form-modal">
        <StudentDetailFormPage
          v-if="openDetailFormModal == true"
          :id="item.id"
          parantPage="staff"
          @close-modal="
            () => {
              fetchItems();
              openDetailFormModal = false;
            }
          "
        />
      </div>

      <!-- Import Modal -->
      <div id="import-modal">
        <ImportVisitorComponent
          v-if="openImportVisitorModal == true"
          @close-modal="
            () => {
              fetchCountWatingItems();
              fetchItems();
              openImportVisitorModal = false;
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import ApiService from "@/core/services/ApiService";
// Component
import ListComponent from "@/components/students/visitor/ListAllActive.vue";
import CardListComponent from "@/components/students/visitor/CardAllActive.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import SearchComponent from "@/components/students/Search.vue";
import useDateData from "@/composables/useDateData";
import ImportVisitorComponent from "@/components/students/visitor/Import.vue";
// Modal
import StudentDetailFormPage from "@/views/form-students/Detail.vue";
import { fetchAddressAlls } from "@/composables/useFetchSelectionData";
// Excel
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

export default defineComponent({
  name: "map-teacher",
  components: {
    ListComponent,
    CardListComponent,
    Preloader,
    StudentDetailFormPage,
    SearchComponent,
    ImportVisitorComponent,
  },
  setup() {
    // UI Variable
    const template = "/media/document/template_import_visitor.xlsx";
    const isLoading = ref<any>(false);
    const sortKey = ref<any>("id");
    const sortOrder = ref<any>(-1);
    const current_active_status = ref<any>("total");
    const paginationData = reactive<any>({
      perPage: 20,
      currentPage: 1,
      totalPage: 1,
      totalItems: 0,
    });
    const sortedItems = (key: any) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value * -1;
      } else {
        sortKey.value = key;
      }

      if (!sortKey.value) return items;

      fetchItems();
    };

    // Modal Variable
    const openDetailFormModal = ref(false);
    const openImportVisitorModal = ref(false);

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const items = reactive<any>([]); // form items
    const item = reactive<any>({}); // form item
    const items_export = reactive<any[]>([]);
    const items_wating_count = ref(0);
    const search = reactive<any>({
      semester_id: null,
      faculty_id: null,
      division_id: null,
      company_id: null,
      student_code: "",
      search_name: "",
      form_status_id: "10,11,12,13,14,15,16,17,18",
    });

    const selectOptions = ref({
      address_alls: <any>[],
    });

    const fetchAddress = async () => {
      selectOptions.value.address_alls = await fetchAddressAlls({});
    };
    fetchAddress();

    const checkStaffPermission = () => {
      let check = {};
      if (userData.group_id == 3) {
        check = { faculty_id: userData.staff_profile.faculty_id };
      } else if (userData.group_id == 4) {
        check = {
          faculty_id: userData.staff_profile.faculty_id,
          department_id: userData.staff_profile.department_id,
        };
      } else if (userData.group_id == 5) {
        check = {
          faculty_id: userData.staff_profile.faculty_id,
          department_id: userData.staff_profile.department_id,
          division_id: userData.staff_profile.division_id,
        };
      } else {
      }

      return check;
    };

    // Fetch Data
    const fetchCountWatingItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        is_active: true,
        ...checkStaffPermission(),
        form_status_id: "10,11,12,13,14,15,16,17,18",
        visitor_id: "null",
      };

      const { data } = await ApiService.query("form/count-all", {
        params: params,
      });

      items_wating_count.value = data.count;
      isLoading.value = false;
    };
    fetchCountWatingItems();

    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        semester_id: search.semester_id?.id,
        faculty_id: search.faculty_id?.id,
        division_id: search.division_id?.id,
        company_id: search.company_id?.id,
        advisor_id: search.advisor_id?.id,
        // visitor_id: search.visitor_id?.id,
        is_active: true,
        ...checkStaffPermission(),
        ...paginationData,
        orderBy: sortKey.value,
        order: sortOrder.value == 1 ? "asc" : "desc",
      };

      const { data } = await ApiService.query("form", {
        params: params,
      });

      items.length = 0;
      Object.assign(items, data.data);
      paginationData.totalPage = data.totalPage;
      paginationData.totalItems = data.totalData;
      paginationData.currentPage = data.currentPage;

      isLoading.value = false;
    };

    // Modal action

    const onFormDetailModal = (it: any) => {
      Object.assign(item, it);
      openDetailFormModal.value = true;
    };

    const onClear = () => {};

    const onchangeCurrentStatus = async (cas: string) => {
      current_active_status.value = cas;
      if (cas == "wating") {
        search.form_status_id = "10,11,12,13,14,15,16,17,18";
        search.visitor_id = "null";
      } else if (cas == "success") {
        search.form_status_id = "10,11,12,13,14,15,16,17,18";
        search.visitor_id = "not_null";
      } else {
        search.form_status_id = "10,11,12,13,14,15,16,17,18";
        search.visitor_id = undefined;
      }
      await fetchItems();
    };

    const fetchExportItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        faculty_id: search.faculty_id?.id,
        division_id: search.division_id?.id,
        company_id: search.company_id?.id,
        advisor_id: search.advisor_id?.id,
        semester_id: search.semester_id?.id,
        // visitor_id: search.visitor_id?.id,
        is_active: true,
        ...checkStaffPermission(),
        orderBy: sortKey.value,
        order: sortOrder.value == 1 ? "asc" : "desc",
      };

      const { data } = await ApiService.query("form", {
        params: params,
      });

      items_export.length = 0;

      Object.assign(
        items_export,
        data.data.map((x: any) => {
          x.show_send_at = useDateData().convertDate(x.send_at);
          x.show_semester =
            x.semester_detail.term + "/" + x.semester_detail.year;
          x.show_term = x.semester_detail.term;
          x.show_year = x.semester_detail.year;
          x.show_student_code = x.student_detail.student_code;
          x.show_fullname =
            x.student_detail.firstname + " " + x.student_detail.surname;
          x.show_firstname = x.student_detail.firstname;
          x.show_surname = x.student_detail.surname;
          x.show_class_year = x.student_detail.class_year;
          x.show_company = x.company_detail.name;
          x.show_company_province = convertAddress(x.response_province_id);
          x.show_start_date = useDateData().convertDate(x.start_date);
          x.show_end_date = useDateData().convertDate(x.end_date);
          x.show_visitor = x.visitor_detail
            ? x.visitor_detail.prefix +
              x.visitor_detail.firstname +
              " " +
              x.visitor_detail.surname
            : "";
          x.show_status = x.form_status_detail.name;
          return x;
        })
      );

      isLoading.value = false;
    };

    const exportExcel = async () => {
      fetchExportItems();
    };

    const onExport = async () => {
      exportExcel().then(() => {
        setTimeout(async () => {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("รายการจับคู่อาจารย์นิเทศ", {
            pageSetup: { orientation: "landscape" },
            headerFooter: {
              firstHeader: "Hello Exceljs",
              firstFooter: "Hello World",
            },
          });
          //
          worksheet.columns = [
            {
              header: "ลำดับ",
              key: "show_send_at",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "รหัสนักศึกษา",
              key: "show_student_code",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "ชื่อ",
              key: "show_firstname",
              width: 50,
              outlineLevel: 1,
            },
            {
              header: "นามสกุล",
              key: "show_surname",
              width: 50,
              outlineLevel: 1,
            },
            {
              header: "วันที่ส่งใบสมัคร",
              key: "show_send_at",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "เทอม",
              key: "show_term",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "ปีการศึกษา",
              key: "show_year",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "สถานประกอบการ",
              key: "show_company",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "จังหวัดที่ไปปฏิบัติงาน",
              key: "show_company_province",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "วันที่เริ่มปฏิบัติงาน",
              key: "show_start_date",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "วันปฏิบัติงานเสร็จสิ้น",
              key: "show_end_date",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "สถานะ",
              key: "show_status",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "อาจารย์นิเทศ",
              key: "show_visitor",
              width: 25,
              outlineLevel: 1,
            },
          ];

          // worksheet.properties.defaultRowHeight = 20;

          worksheet.addRows(items_export);

          worksheet.eachRow((row: any) => {
            // row.height = 45;
            row.eachCell(function (cell: any) {
              cell.alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
              };
            });
          });

          const row = worksheet.getRow(1);
          row.height = 20;

          worksheet.insertRow(1, "รายการจับคู่อาจารย์นิเทศ");
          worksheet.mergeCells("A1:K1");
          worksheet.getCell("A1").value = "รายการจับคู่อาจารย์นิเทศ";
          worksheet.getCell("A1").alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          const font = { name: "Arial", size: 18, bold: true };
          worksheet.getCell("A1").font = font;

          const font1 = { name: "Arial", size: 18, bold: true };
          worksheet.getCell("A1").font = font1;

          // Images
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type: "application/octet-stream",
          });
          const href = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = href;
          link.download = "รายการจับคู่อาจารย์นิเทศ.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 1000);
      });
    };

    const convertAddress = (province_id: any) => {
      if (province_id == null) return "";
      let ad = selectOptions.value.address_alls.find((x: any) => {
        return x.province_id == province_id;
      });
      return ad?.province;
    };

    const convertAddress2 = (sub_district_id: any) => {
      if (sub_district_id == null) return "";
      let ad = selectOptions.value.address_alls.find((x: any) => {
        return x.sub_district_id == sub_district_id;
      });
      return ad?.province;
    };

    const onImportModal = () => {
      openImportVisitorModal.value = true;
    };

    // Mounted
    onMounted(() => {
      fetchItems();
    });

    // Watch
    watch(
      () => [paginationData.currentPage, paginationData.perPage],
      () => {
        fetchItems();
      }
    );

    return {
      // Variable
      template,
      items,
      item,
      items_wating_count,
      search,
      paginationData,
      sortKey,
      sortOrder,
      sortedItems,
      isLoading,
      openDetailFormModal,
      openImportVisitorModal,
      //   Event
      onFormDetailModal,
      onchangeCurrentStatus,
      fetchItems,
      fetchCountWatingItems,
      onClear,
      onExport,
      onImportModal,
    };
  },
});
</script>
