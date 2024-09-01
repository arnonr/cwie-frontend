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
          <!-- :class="['btn-primary': 'd']" -->
          <button
            class="btn btn-outline btn-outline-info btn-sm fs-7"
            @click="onchangeCurrentStatus('total')"
          >
            ทั้งหมด ({{ items_status.total.length }})
          </button>

          <button
            class="btn btn-outline btn-outline-warning btn-sm fs-7 ms-2"
            @click="onchangeCurrentStatus('wating')"
          >
            รออนุมัติเอกสาร ({{ items_status.wating.length }})
          </button>
          <button
            class="btn btn-outline btn-outline-success btn-sm fs-7 ms-2"
            @click="onchangeCurrentStatus('success')"
          >
            อนุมัติเอกสารเสร็จสิ้น ({{ items_status.success.length }})
          </button>
          <!-- buttons -->
        </div>
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
          @close-modal="
            () => {
              fetchItems();
              openDetailFormModal = false;
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
import useToast from "@/composables/useToast";

// Component
import ListComponent from "@/components/students/report/ListAllActive.vue";
import CardListComponent from "@/components/students/report/CardAllActive.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import SearchComponent from "@/components/students/Search.vue";
import useDateData from "@/composables/useDateData";
// Modal
import StudentDetailFormPage from "@/views/form-students/Detail.vue";
import { fetchAddressAlls } from "@/composables/useFetchSelectionData";
// Excel
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

export default defineComponent({
  name: "plan-student",
  components: {
    ListComponent,
    CardListComponent,
    Preloader,
    StudentDetailFormPage,
    SearchComponent,
  },
  setup() {
    // UI Variable
    const isLoading = ref<any>(false);
    const sortKey = ref<any>("");
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

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const items = reactive<any>([]); // form items
    const item = reactive<any>({}); // form item
    const items_export = reactive<any[]>([]);
    const items_status = ref<any>({
      total: [],
      wating: [],
      success: [],
    }); // form item
    const search = reactive<any>({
      semester_id: null,
      faculty_id: null,
      division_id: null,
      company_id: null,
      student_code: "",
      search_name: "",
    });

    const selectOptions = ref({
      address_alls: <any>[],
    });

    const fetchAddress = async () => {
      selectOptions.value.address_alls = await fetchAddressAlls({});
    };
    fetchAddress();

    // Fetch Data
    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        semester_id: search.semester_id?.id,
        faculty_id: search.faculty_id?.id,
        division_id: search.division_id?.id,
        company_id: search.company_id?.id,
        advisor_id: search.advisor_id?.id,
        visitor_id: search.visitor_id?.id,
        orderBy: "id",
        order: "desc",
        is_active: true,
        form_status_id: "12,13,14,15,16,17,18",
      };

      const { data } = await ApiService.query("form", {
        params: params,
      });

      items.length = 0;
      Object.assign(items, data.data);
      paginationData.totalPage = data.totalPage;
      paginationData.totalItems = data.totalData;
      paginationData.currentPage = data.currentPage;

      items_status.value.total = [];
      items_status.value.wating = [];
      items_status.value.success = [];

      items.forEach((x: any) => {
        items_status.value.total.push(x);
        if (x.form_status_id == 15) {
          items_status.value.wating.push(x);
        } else {
          items_status.value.success.push(x);
        }
      });

      isLoading.value = false;
    };

    // Modal action

    const onFormDetailModal = (it: any) => {
      Object.assign(item, it);
      openDetailFormModal.value = true;
    };

    const onClear = () => {};

    const onchangeCurrentStatus = (cas: string) => {
      current_active_status.value = cas;
      items.length = 0;
      Object.assign(items, [...items_status.value[cas]]);
    };

    const fetchExportItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        semester_id: search.semester_id?.id,
        faculty_id: search.faculty_id?.id,
        division_id: search.division_id?.id,
        company_id: search.company_id?.id,
        advisor_id: search.advisor_id?.id,
        visitor_id: search.visitor_id?.id,
        orderBy: "id",
        order: "desc",
        is_active: true,
        form_status_id: "12,13,14,15,16,17,18",
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
          x.show_student_code = x.student_detail.student_code;
          x.show_fullname =
            x.student_detail.firstname + " " + x.student_detail.surname;
          x.show_class_year = x.student_detail.class_year;
          x.show_company = x.company_detail.name;
          x.show_company_province = convertAddress(
            x.company_detail.sub_district_id
          );
          x.show_status = x.form_status_detail.name;
          return x;
        })
      );

      console.log(items_export);
      isLoading.value = false;
    };

    const exportExcel = async () => {
      fetchExportItems();
    };

    const onExport = async () => {
      exportExcel().then(() => {
        setTimeout(async () => {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet(
            "รายการใบสมัครโครงการสหกิจศึกษา",
            {
              pageSetup: { orientation: "landscape" },
              headerFooter: {
                firstHeader: "Hello Exceljs",
                firstFooter: "Hello World",
              },
            }
          );
          //
          worksheet.columns = [
            {
              header: "วันที่ส่งใบสมัคร",
              key: "show_send_at",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "ปีการศึกษา",
              key: "show_semester",
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
              header: "ชื่อ-นามสกุล",
              key: "show_fullname",
              width: 50,
              outlineLevel: 1,
            },
            {
              header: "ชั้นปีที่",
              key: "show_class_year",
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
              header: "จังหวัด",
              key: "show_company_province",
              width: 25,
              outlineLevel: 1,
            },
            {
              header: "สถานะ",
              key: "show_status",
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

          worksheet.insertRow(1, "รายการใบสมัคร");
          worksheet.mergeCells("A1:K1");
          worksheet.getCell("A1").value = "รายการใบสมัคร";
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
          link.download = "รายการใบสมัคร.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 1000);
      });
    };

    const convertAddress = (sub_district_id: any) => {
      let ad = selectOptions.value.address_alls.find((x: any) => {
        return x.sub_district_id == sub_district_id;
      });
      return ad?.province;
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
      items,
      item,
      items_status,
      search,
      paginationData,
      sortKey,
      sortOrder,
      sortedItems,
      isLoading,
      openDetailFormModal,
      //   Event
      onFormDetailModal,
      onchangeCurrentStatus,
      fetchItems,
      onClear,
      onExport,
    };
  },
});
</script>
