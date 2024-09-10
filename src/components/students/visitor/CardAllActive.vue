<template>
  <div>
    <div class="row g-3">
      <div
        v-for="(it, idx) in items"
        :key="idx"
        class="col-12 col-md-12 col-lg-4 p-5"
      >
        <div
          class="card h-100 border border-dotted"
          :style="`border-color: ${it.form_status_detail.color} !important;`"
        >
          <div class="card-body p-5">
            <h6 class="card-title">
              {{
                it.student_detail.prefix +
                " " +
                it.student_detail.firstname +
                " " +
                it.student_detail.surname
              }}
            </h6>
            <h6 class="card-subtitle mb-4 text-muted">
              {{ it.student_detail.student_code }}
            </h6>

            <div class="mb-2">
              <span class="fw-bold">วันที่ส่งใบสมัคร : </span>
              <span> {{ convertDate(it.send_at) }}</span>
            </div>

            <div class="mb-2">
              <span class="fw-bold">ปีการศึกษา : </span>
              <span>
                {{
                  it.semester_detail.term + "/" + it.semester_detail.year
                }}</span
              >
            </div>

            <div class="mb-2">
              <span class="fw-bold">ชั้นปีที่ : </span>
              <span>{{ it.student_detail.class_year }}</span>
            </div>
            <div class="mb-2">
              <span class="fw-bold">สถานประกอบการ : </span>
              <span>{{ it.company_detail.name }}</span>
            </div>
            <div class="mb-2">
              <span class="fw-bold">จังหวัดที่ตั้งสถานประกอบการ : </span>

              <span>{{ convertAddress(it.response_province_id) }}</span>
            </div>

            <div class="mb-2">
              <span class="fw-bold">อาจารย์นิเทศ : </span>

              <span>
                {{
                  it.visitor_id
                    ? it.visitor_detail?.prefix +
                      it.visitor_detail?.firstname +
                      " " +
                      it.visitor_detail?.surname
                    : ""
                }}</span
              >
            </div>

            <div class="mb-2">
              <span
                class="badge p-2 text-white"
                :style="`background-color: ${it.form_status_detail.color};`"
                >{{ it.form_status_detail.name }}</span
              >
            </div>
            <div class="dropdown">
              <button
                class="btn btn-primary btn-sm dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-pencil-square"></i>
                <span>จัดการ</span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <a
                    class="dropdown-item cursor-pointer"
                    @click="
                      handleDetail({
                        id: it.id,
                      })
                    "
                    >ดูรายละเอียด</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="items.length === 0" class="text-center mt-3">
      <span>ไม่พบข้อมูล</span>
    </div>

    <div class="col-12 mt-4">
      <div class="tp-pagination">
        <BlogPagination
          :perPage="paginationData.perPage"
          :totalItems="paginationData.totalItems"
          :totalPage="paginationData.totalPage"
          :currentPage="paginationData.currentPage"
          @update:currentPage="updateCurrentPage"
          @update:perPage="updatePerPage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from "vue";

// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

import Swal from "sweetalert2/dist/sweetalert2.js";

// Import Pagination
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";
// Composable
import useDateData from "@/composables/useDateData";
import { fetchAddressAlls } from "@/composables/useFetchSelectionData";

export default defineComponent({
  name: "staff-card-list-form",
  components: {
    BlogPagination,
  },
  props: {
    items: {
      type: Array as () => any[],
      required: true,
    },
    paginationData: {
      type: Object,
      required: true,
    },
    sortKey: {
      type: String,
      required: true,
    },
    sortOrder: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { items, sortKey, sortOrder } = toRefs(props);
    const { paginationData } = toRefs(props);
    const internalCurrentPage = ref(paginationData.value.currentPage);
    const internalPerPage = ref(paginationData.value.perPage);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const headerColumn = [
      { column_name: "sended_at", title: "วันที่ส่งใบสมัคร", sort: true },
      { column_name: "semester_id", title: "ปีการศึกษา", sort: true },
      { column_name: "student_code", title: "รหัสนักศึกษา", sort: true },
      { column_name: "fullname", title: "ชื่อ-นามสกุล", sort: true },
      { column_name: "class_year", title: "ชั้นปี", sort: true },
      {
        column_name: "company_detail.name",
        title: "สถานประกอบการ",
        sort: true,
      },
      { column_name: "province_id", title: "จังหวัด", sort: true },
      { column_name: "form_status_id", title: "สถานะ", sort: true },
      { column_name: "manage", title: "จัดการข้อมูล", sort: false },
    ];

    const selectOptions = ref({
      address_alls: <any>[],
    });

    const fetchAddress = async () => {
      selectOptions.value.address_alls = await fetchAddressAlls({});
    };
    fetchAddress();

    // fetch

    const handleDetail = (item: any) => {
      emit("detail", item);
    };

    const handleEdit = (item: any) => {
      emit("edit", item);
    };

    const handleSort = (key: any) => {
      emit("sort", key);
    };

    const handleHistoryDetail = (item: any) => {
      emit("history-reject", item);
    };
    const handleCancel = (item: any) => {
      Swal.fire({
        title: "ยืนยันการยกเลิกใบสมัคร",
        text: "เมื่อยกเลิกใบสมัครจะไม่สามารถกลับมาแก้ไขได้",
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
          emit("cancel", item);
        }
      });
    };

    const convertAddress = (sub_district_id: any) => {
      if (sub_district_id == null) return "";
      let ad = selectOptions.value.address_alls.find((x: any) => {
        return x.sub_district_id == sub_district_id;
      });
      return ad?.province;
    };

    const updateCurrentPage = (newPage: any) => {
      internalCurrentPage.value = newPage;
      emit("update:currentPage", newPage);
    };

    const updatePerPage = (newPerPage: any) => {
      internalPerPage.value = newPerPage;
      emit("update:perPage", newPerPage);
    };

    const getSortIcon = (key: any) => {
      if (sortKey.value !== key) return "";
      return sortOrder.value === 1 ? "fa fa-sort-desc" : "fa fa-sort-asc";
    };

    return {
      items,
      handleDetail,
      handleEdit,
      handleHistoryDetail,
      handleCancel,
      convertDate: useDateData().convertDate,
      updateCurrentPage,
      updatePerPage,
      getSortIcon,
      handleSort,
      headerColumn,
      userData,
      convertAddress,
    };
  },
});
</script>

<style scoped>
th {
  vertical-align: middle;
}
.sort-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
