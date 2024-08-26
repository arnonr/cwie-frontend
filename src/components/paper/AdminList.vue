<template>
  <div>
    <table class="table table-bordered table-striped fs-8" style="width: 100%">
      <thead class="bg-warning">
        <tr>
          <th
            class="text-center text-white cursor-pointer"
            v-for="(hc, idx) in headerColumn"
            :key="idx"
            @click="hc.sort == true ? handleSort(hc.column_name) : undefined"
          >
            <span>{{ hc.title }}</span>
            <i
              :class="getSortIcon(hc.column_name)"
              class="sort-icon ms-2 text-grey"
            ></i>
          </th>
        </tr>
      </thead>
      <tbody v-if="items.length != 0">
        <tr v-for="(it, idx) in items" :key="idx">
          <td class="text-center">
            {{ convertDate(it.created_at) }}
          </td>
          <td class="text-center">{{ it.rp_no }}</td>

          <td>{{ it.title_th }}</td>
          <td>
            {{
              it.user.prefix_name + it.user.firstname + " " + it.user.surname
            }}
          </td> 
          <td>{{ it.department?.name }}</td>
          <td class="text-center">{{ it.paper_type?.name }}</td>
          <td class="text-center">
            <span
              class="badge p-2 text-white"
              :style="`background-color: ${
                convertStatus(it.status_id).bg_color
              };`"
              >{{ convertStatus(it.status_id).name_th }}</span
            >
          </td>

          <td class="text-center">
            <div class="dropdown">
              <button
                class="btn btn-primary btn-sm dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i
                  class="bi bi-pencil-square fs-4 d-sm-inline-block d-lg-none"
                ></i>
                <span class="d-none d-lg-inline-block">จัดการ</span>
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
                    >รายละเอียด</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item cursor-pointer"
                    @click="
                      handleHistoryDetail({
                        id: it.id,
                      })
                    "
                    >ประวัติการดำเนินการ/รายละเอียดที่ต้องแก้ไข</a
                  >
                </li>
                <li>
                  <!-- v-if="it.status_id == 1 || it.status_id == 3" -->
                  <a
                    class="dropdown-item cursor-pointer"
                    @click="
                      handleEdit({
                        id: it.id,
                      })
                    "
                    >แก้ไขข้อมูล</a
                  >
                </li>

                <li>
                  <a
                    class="dropdown-item cursor-pointer"
                    v-if="it.status_id == 2"
                    @click="
                      handleReject({
                        id: it.id,
                      })
                    "
                    >ส่งกลับให้แก้ไข</a
                  >
                </li>

                <li>
                  <a
                    class="dropdown-item cursor-pointer"
                    v-if="it.status_id == 2"
                    @click="
                      handleManageReview({
                        id: it.id,
                      })
                    "
                    >รายการกรรมการ</a
                  >
                </li>

                <li>
                  <a
                    class="dropdown-item cursor-pointer"
                    v-if="it.status_id == 2"
                    @click="
                      handleApprove({
                        id: it.id,
                      })
                    "
                    >ยกเลิก/ตอบรับข้อเสนอ</a
                  >
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr>
          <td colspan="10">
            <div class="text-center"><span>ไม่พบข้อมูล</span></div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="col-xxl-12">
      <div class="tp-pagination mt-30">
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
  name: "admin-list-paper",
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
      { column_name: "created_at", title: "วันที่เสนอ", sort: true },
      { column_name: "rp_no", title: "รหัส", sort: true },
      { column_name: "title_th", title: "ชื่อโครงการ (TH)", sort: true },
      { column_name: "fullname", title: "ผู้ส่ง", sort: true },
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

    const handleReject = (item: any) => {
      emit("reject", item);
    };

    const handleApprove = (item: any) => {
      emit("approve", item);
    };

    const handleCancel = (item: any) => {
      emit("cancel", item);
    };

    const handleManageReview = (item: any) => {
      emit("manage-review", item);
    };

    const handleHistoryDetail = (item: any) => {
      emit("history-detail", item);
    };

    const handleSort = (key: any) => {
      emit("sort", key);
    };

    const convertStatus = (status: any) => {
      const findStatus = statuses.find((x: any) => x.id === status);
      return {
        name_th: findStatus.name_th,
        bg_color: findStatus.bg_color,
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
      handleReject,
      handleApprove,
      handleCancel,
      handleManageReview,
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
