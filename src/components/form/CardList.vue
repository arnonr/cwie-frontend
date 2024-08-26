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
          :class="`border-${convertStatus(it.status_id).bg_bs_color}`"
        >
          <div class="card-body p-5">
            <h6 class="card-title">{{ it.title_th }}</h6>
            <h6 class="card-subtitle mb-2 text-muted">{{ it.rp_no }}</h6>
            <p class="card-text">
              <strong>วันที่เสนอ:</strong> {{ convertDate(it.sended_at) }}<br />
              <strong>หน่วยงาน:</strong> {{ it.department?.name }}<br />
              <strong>ประเภททุนวิจัย:</strong> {{ it.paper_type?.name }}
            </p>
            <div class="mb-2">
              <span
                class="badge p-2 text-white"
                :style="`background-color: ${
                  convertStatus(it.status_id).bg_color
                };`"
                >{{ convertStatus(it.status_id).name_th }}</span
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
                        complainant_id: it.complainant_id,
                      })
                    "
                  >
                    รายละเอียด
                  </a>
                </li>
                <li v-if="it.status_id > 1">
                  <a
                    class="dropdown-item cursor-pointer"
                    @click="handleHistoryDetail({ id: it.id })"
                  >
                    ประวัติการดำเนินการ/รายละเอียดที่ต้องแก้ไข
                  </a>
                </li>
                <li v-if="it.status_id == 1 || it.status_id == 3">
                  <a
                    class="dropdown-item cursor-pointer"
                    @click="handleEdit({ id: it.id })"
                  >
                    แก้ไขข้อมูล
                  </a>
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

// Import Pagination
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";
// Composable
import useStatusData from "@/composables/useStatusData";
import useDateData from "@/composables/useDateData";

export default defineComponent({
  name: "list-paper",
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
    let { statuses } = useStatusData();
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const headerColumn = [
      { column_name: "sended_at", title: "วันที่เสนอ", sort: true },
      { column_name: "rp_no", title: "รหัสโครงการ", sort: true },
      { column_name: "title_th", title: "ชื่อโครงการ (TH)", sort: true },
      { column_name: "department_id", title: "หน่วยงาน", sort: true },
      { column_name: "paper_type_id", title: "ประเภททุนวิจัย", sort: true },
      { column_name: "status_id", title: "สถานะ", sort: true },
      { column_name: "manage", title: "จัดการข้อมูล", sort: false },
    ];

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
      emit("history-detail", item);
    };

    const convertStatus = (status: any) => {
      const findStatus = statuses.find((x: any) => x.id === status);
      return {
        name_th: findStatus.name_th,
        bg_color: findStatus.bg_color,
        bg_bs_color: findStatus.bg_bs_color,
      };
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
      convertDate: useDateData().convertDate,
      convertStatus,
      updateCurrentPage,
      updatePerPage,
      getSortIcon,
      handleSort,
      headerColumn,
      userData,
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
