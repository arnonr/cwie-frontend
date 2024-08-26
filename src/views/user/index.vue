<template>
  <!--begin::Wrapper-->
  <div class="container">
    <div class="card shadow-sm my-6">
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h6
            class="accordion-header p-5 accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="false"
            aria-controls="collapseOne"
          >
            <i class="fa fa-search pe-2"></i> ค้นหาผู้ใช้งาน
          </h6>
          <div
            id="collapseOne"
            class="accordion-collapse collapse hide"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <div class="row ps-5 pe-5 ps-md-0 pe-md-0">
                <div class="col-12 col-md-4 my-2">
                  <label for="">ชื่อผู้ใช้งาน</label>
                  <input
                    type="text"
                    id="txt-search-fullname"
                    name="txt-search-fullname"
                    class="form-control"
                    v-model="search.fullname"
                  />
                </div>

                <div class="col-12 col-md-4 my-2">
                  <label for="">บช./ภ.</label>
                  <v-select
                    id="slt-search-bureau-id"
                    name="slt-search-bureau-id"
                    label="name_th"
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
                    label="name_th"
                    placeholder="บก./ภ.จว."
                    :options="selectOptions.divisions"
                    v-model="search.division_id"
                    class="form-control"
                    :clearable="true"
                  ></v-select>
                </div>

                <div class="col-12 col-md-4 my-2">
                  <label for="">สถานะผู้ใช้งาน</label>
                  <v-select
                    id="slt-search-status-id"
                    name="slt-search-status-id"
                    label="name"
                    placeholder="สถานะผู้ใช้งาน"
                    :options="selectOptions.user_statuses"
                    v-model="search.status"
                    class="form-control"
                    :clearable="true"
                  ></v-select>
                </div>

                <div class="col-12 col-md-4 my-2">
                  <label for="">กลุ่มผู้ใช้งาน</label>
                  <v-select
                    id="slt-search-role-id"
                    name="slt-search-role-id"
                    label="name_th"
                    placeholder="กลุ่มผู้ใช้งาน"
                    :options="selectOptions.roles"
                    v-model="search.role_id"
                    class="form-control"
                    :clearable="true"
                  ></v-select>
                </div>
              </div>
              <div class="pt-5">
                <button class="btn btn-success fw-bold" @click="onSearch()">
                  ค้นหา
                </button>
                <button class="btn btn-danger ms-2 fw-bold" @click="onClear()">
                  ล้าง
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm my-5">
      <div class="card-header bg-white">
        <h4 class="card-title">รายการผู้ใช้งาน</h4>
        <div class="card-toolbar"></div>
      </div>
      <div class="card-body table-responsive">
        <!-- <div class="overflow-visible"> -->
        <table class="table table-bordered table-striped" style="width: 100%">
          <thead class="bg-color-police">
            <tr>
              <th class="text-center text-white">รหัสเจ้าหน้าที่</th>
              <th class="text-center text-white">ชื่อผู้ใช้งาน</th>
              <th class="text-center text-white">หน่วยงาน</th>
              <th class="text-center text-white">กลุ่มผู้ใช้งาน</th>
              <th class="text-center text-white">สถานะ</th>
              <th class="text-center text-white">จัดการข้อมูล</th>
            </tr>
          </thead>
          <tbody v-if="items.length != 0">
            <tr v-for="(it, idx) in items" :key="idx">
              <td class="text-center">
                {{ it.officer_code }}
              </td>
              <td class="text-center">
                {{ it.firstname + " " + it.lastname }}
              </td>
              <td>
                <span v-if="it.division_id"
                  >{{ it.division.name_th }} > {{ it.bureau.name_th }}</span
                >
                <span v-else-if="it.bureau_id">{{ it.bureau.name_th }}</span>
                <span v-else-if="it.inspector_id">{{
                  it.inspector.name_th
                }}</span>
                <span v-else></span>
              </td>
              <td class="text-center">
                {{ it.role.name_th }}
              </td>

              <td class="text-center">
                <span
                  class="badge p-2 text-white fw-bold"
                  :class="['bg-' + showStatus(it.status).color]"
                  >{{ showStatus(it.status).name }}</span
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
                  <ul
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <a
                        class="dropdown-item cursor-pointer"
                        @click="
                          () => {
                            Object.assign(item, it);
                            openDetailModal = true;
                          }
                        "
                        >รายละเอียด</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item cursor-pointer"
                        @click="
                          () => {
                            Object.assign(item, it);
                            openEditModal = true;
                          }
                        "
                        >แก้ไขข้อมูล/เปลี่ยนสถานะ</a
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
              :totalItems="totalItems"
              :totalPage="totalPage"
              :currentPage="currentPage"
              @update:currentPage="currentPage = $event"
            />
          </div>
        </div>
        <!-- </div> -->
      </div>
    </div>

    <!-- Modal ดูรายละเอียด -->
    <div id="detail-modal">
      <DetailUser
        :id="item.id"
        v-if="openDetailModal == true"
        @close-modal="
          () => {
            openDetailModal = false;
          }
        "
      />
    </div>
    <!--  -->

    <!-- Modal แก้ไขข้อมูล -->
    <div id="edit-modal">
      <EditUser
        :id="item.id"
        v-if="openEditModal == true"
        @reload="
          () => {
            fetchItems();
          }
        "
        @close-modal="
          () => {
            openEditModal = false;
          }
        "
      />
    </div>
    <!--  -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { useAbility } from "@casl/vue";
import ApiService from "@/core/services/ApiService";

import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// Import Datepicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
// Import Pagination
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";
// Import ExcelJS
// import ExcelJS from "exceljs";

import DetailUser from "@/views/user/DetailUser.vue";
import EditUser from "@/views/user/EditUser.vue";

import useBasicData from "@/composables/useBasicData";

// Component
export default defineComponent({
  name: "complaint",
  components: {
    VueDatePicker,
    dayjs,
    vSelect,
    BlogPagination,
    DetailUser,
    EditUser,
  },
  setup() {
    // Variable
    const router = useRouter();
    const ability = useAbility();
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const selectOptions = ref<any>({
      organizations: [],
      perPage: [
        { title: "20", value: 20 },
        { title: "40", value: 40 },
        { title: "60", value: 60 },
      ],
      user_statuses: useBasicData().user_statuses,
      roles: [],
      inspectors: [],
      bureaus: [],
      divisions: [],
      prefix_names: [],
    });

    const search = ref<any>({});
    const item = reactive<any>({});
    const items = reactive<any>([]);
    const perPage = ref(20);
    const currentPage = ref(1);
    const totalPage = ref(1);
    const totalItems = ref(0);

    const openDetailModal = ref(false);
    const openEditModal = ref(false);

    // Fetch Data
    const fetchRole = async () => {
      const { data } = await ApiService.query("role", {
        params: {
          is_active: 1,
          perPage: 500,
        },
      });
      selectOptions.value.roles = data.data;
    };

    const fetchPrefixName = async () => {
      const { data } = await ApiService.query("prefix-name", {
        params: {
          is_active: 1,
          perPage: 500,
        },
      });
      selectOptions.value.prefix_names = data.data;
    };

    const fetchInspector = async () => {
      const { data } = await ApiService.query("inspector", {
        params: {
          perPage: 100000,
          orderBy: "name_th",
          order: "asc",
        },
      });
      selectOptions.value.inspectors = data.data;
    };

    const fetchBureau = async () => {
      const { data } = await ApiService.query("bureau", {
        params: {
          perPage: 100000,
          orderBy: "name_th",
          order: "asc",
          inspector_id: search.value.inspector_id?.id,
        },
      });
      selectOptions.value.bureaus = data.data;
    };

    const fetchDivision = async () => {
      const { data } = await ApiService.query("division", {
        params: {
          perPage: 100000,
          orderBy: "name_th",
          order: "asc",
          bureau_id: search.value.bureau_id?.id,
        },
      });
      selectOptions.value.divisions = data.data;
    };

    const fetchItems = async () => {
      const params = {
        perPage: perPage.value,
        currentPage: currentPage.value,
        orderBy: "created_at",
        order: "desc",
        ...search.value,
        role_id: search.value.role_id?.id ?? undefined,
        status: search.value.status?.id ?? undefined,
        inspector_id: search.value.inspector_id?.id ?? undefined,
        bureau_id: search.value.bureau_id?.id ?? undefined,
        division_id: search.value.division_id?.id ?? undefined,
        agency_id: search.value.agency_id?.id ?? undefined,
      };

      const { data } = await ApiService.query("user", {
        params: params,
      });

      items.length = 0;
      Object.assign(items, data.data);
      totalPage.value = data.totalPage;
      totalItems.value = data.totalData;
      currentPage.value = data.currentPage;
    };

    // Event
    const onSearch = async () => {
      fetchItems();
    };
    const onClear = async () => {
      search.value = {};
    };

    // Show
    const showStatus = (status: any) => {
      let find_status = selectOptions.value.user_statuses.find((x: any) => {
        return x.id == status;
      });
      return find_status;
    };

    // Mounted
    onMounted(() => {
      fetchPrefixName();
      fetchRole();
      fetchInspector();
      fetchBureau();
      fetchItems();
    });

    onUnmounted(() => {});

    // Watch
    watch([currentPage], () => {
      fetchItems();
    });

    watch(
      () => search.value.inspector_id,
      () => {
        search.value.bureau_id = null;
        search.value.division_id = null;
        fetchBureau();
      }
    );

    watch(
      () => search.value.bureau_id,
      () => {
        search.value.division_id = null;

        if (search.value.bureau_id) {
          fetchDivision();
        } else {
          selectOptions.value.divisions = [];
        }
      }
    );

    return {
      totalPage,
      totalItems,
      search,
      items,
      perPage,
      currentPage,
      selectOptions,
      item,
      router,
      showStatus,
      onSearch,
      onClear,
      fetchItems,
      openDetailModal,
      openEditModal,
    };
  },
});
</script>

<style>
.vs__dropdown-toggle {
  border: none;
}

.v-select {
  padding: 0.4em 0.5em;
}

.dp__main {
  padding: 0.35em 0em;
}

.dp__input {
  border: none !important;
}
@media only screen and (max-width: 768px) {
  .card > .card-body {
    padding: 0px;
  }
}

.bg-color-police {
  background-color: #800001;
}
</style>

<!-- Get ข้อมูล count -->
<!-- สิทธิ์การมองเห็น เมนูย่อย และข้อมูลกับ Filter -->
