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
        <h4 class="card-title">หนังสือขอความอนุเคราะห์</h4>
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
            รอออกหนังสือ ({{ items_wating_count }})
          </button>
          <button
            class="btn btn-outline btn-outline-success btn-sm fs-7 ms-2"
            @click="onchangeCurrentStatus('success')"
          >
            ออกหนังสือแล้ว
          </button>
          <!-- buttons -->
        </div>
      </div>
      <div class="card-body" style="padding-bottom: 0px">
        <button
          class="btn btn-outline btn-outline-primary btn-sm fs-7 me-2"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="fa fa-check fs-4"></i>
          <span class="d-none d-lg-inline-block ms-2">เลือก</span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <a class="dropdown-item" @click="onSelectItemAll">ทั้งหมด</a>
          </li>
          <li>
            <a class="dropdown-item" @click="onDisSelectItemAll">ยกเลิก</a>
          </li>
        </ul>

        <button
          class="btn btn-outline btn-outline-success btn-sm fs-7"
          type="button"
          @click="onAddBook"
        >
          <i class="fa fa-file fs-4"></i>
          <span class="d-none d-lg-inline-block ms-2"
            >ออกหนังสือขอความอนุเคราะห์</span
          >
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
          :selectedItem="selectedItem"
          :book_type="'request_book'"
          @update:currentPage="paginationData.currentPage = $event"
          @update:perPage="paginationData.perPage = $event"
          @update:selectedItem="(event: any) => {
            onUpdateSelectedItem(event)
          }"
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
    </div>

    <!-- Modal -->
    <div>
      <!-- Detail Form Modal -->
      <div id="detail-form-modal">
        <StudentDetailFormPage
          v-if="openDetailFormModal == true"
          :id="item.id"
          parantPage="staff"
          @reload="fetchItems()"
          @close-modal="
            () => {
              fetchCountWatingItems();
              fetchItems();
              openDetailFormModal = false;
            }
          "
        />
      </div>

      <div id="add-book-modal">
        <AddBookComponent
          v-if="openAddBookModal == true"
          book_type="request_book"
          :ids="selectedItem"
          @reload="fetchItems()"
          @close-modal="
            () => {
              openAddBookModal = false;
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
import ListComponent from "@/components/students/book/ListAllActive.vue";
import CardListComponent from "@/components/students/book/CardAllActive.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import SearchComponent from "@/components/students/Search.vue";
import AddBookComponent from "@/components/students/book/Add.vue";
// Modal
import StudentDetailFormPage from "@/views/form-students/Detail.vue";
import { fetchAddressAlls } from "@/composables/useFetchSelectionData";

export default defineComponent({
  name: "request-book",
  components: {
    ListComponent,
    CardListComponent,
    Preloader,
    StudentDetailFormPage,
    SearchComponent,
    AddBookComponent,
  },
  setup() {
    // UI Variable
    const isLoading = ref<any>(false);
    const sortKey = ref<any>("id");
    const sortOrder = ref<any>(-1);
    const current_active_status = ref<any>("total");
    const openAddBookModal = ref<any>(false);
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
    const items_wating_count = ref(0);
    const search = reactive<any>({
      semester_id: null,
      faculty_id: null,
      division_id: null,
      company_id: null,
      student_code: "",
      search_name: "",
      form_status_id: "6,7,8,9,10,11,12,13,14,15,16,17,18",
    });

    const selectedItem = ref([]);

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
        form_status_id: 6,
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
        faculty_id: search.faculty_id?.id,
        division_id: search.division_id?.id,
        company_id: search.company_id?.id,
        advisor_id: search.advisor_id?.id,
        semester_id: search.semester_id?.id,
        visitor_id: search.visitor_id?.id,
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
        search.form_status_id = 6;
      } else if (cas == "success") {
        search.form_status_id = "7,8,9,10,11,12,13,14,15,16,17,18";
      } else {
        search.form_status_id = "6,7,8,9,10,11,12,13,14,15,16,17,18";
      }
      selectedItem.value = [];
      await fetchItems();
    };

    const onSelectItemAll = () => {
      selectedItem.value = [];
      let check = items.filter((d: any) => {
        return d.form_status_id > 5 && d.form_status < 90;
      });
      selectedItem.value = check.map((d: any) => {
        return d.id;
      });
      //   chkItem
      console.log(selectedItem.value);
    };

    const onDisSelectItemAll = () => {
      selectedItem.value = [];
      console.log(selectedItem.value);
    };

    const onUpdateSelectedItem = (item: any) => {
      selectedItem.value = item;
      console.log(selectedItem.value);
    };

    const onAddBook = () => {
      if (selectedItem.value.length != 0) {
        openAddBookModal.value = true;
      } else {
        useToast("โปรดเลือกนักศึกษา", "error");
      }
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
      items_wating_count,
      search,
      paginationData,
      sortKey,
      sortOrder,
      sortedItems,
      isLoading,
      openDetailFormModal,
      openAddBookModal,
      //   Event
      onFormDetailModal,
      onchangeCurrentStatus,
      fetchItems,
      fetchCountWatingItems,
      onClear,
      onSelectItemAll,
      onDisSelectItemAll,
      selectedItem,
      onUpdateSelectedItem,
      onAddBook,
    };
  },
});
</script>
