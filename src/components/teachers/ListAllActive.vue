<template>
  <div>
    <table class="table table-bordered table-striped fs-8" style="width: 100%">
      <thead class="bg-primary">
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
          <td>{{ it.fullname }}</td>
          <td>{{ it.faculty_detail.name }}</td>
          <td>{{ it.department_detail.name }}</td>
          <td>{{ it.user_id }}</td>
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
                <!-- <li>
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
                    @click="
                      handleDelete({
                        id: it.id,
                      })
                    "
                    >ลบ</a
                  >
                </li> -->
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

import Swal from "sweetalert2/dist/sweetalert2.js";

// Import Pagination
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";
// Composable
import useDateData from "@/composables/useDateData";
import { fetchAddressAlls } from "@/composables/useFetchSelectionData";

export default defineComponent({
  name: "users-list",
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
      { column_name: "name", title: "ชื่อ", sort: true },
      { column_name: "faculty", title: "คณะ", sort: true },
      { column_name: "department", title: "ภาควิชา", sort: true },
      { column_name: "MAP User", title: "ผู้ใช้งาน", sort: true },
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

    const handleDelete = (item: any) => {
      Swal.fire({
        title: "ยืนยันการลบ",
        text: "เมื่อลบแล้วจะไม่สามารถกลับมาแก้ไขได้",
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
          emit("delete", item);
        }
      });
    };

    const convertAddress = (sub_district_id: any) => {
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
      handleDelete,
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
