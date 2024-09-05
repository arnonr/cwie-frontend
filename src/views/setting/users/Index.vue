<template>
  <!--begin::Wrapper-->
  <div class="container mt-5">
    <div class="card shadow-sm my-5">
      <div class="card-header bg-white">
        <h4 class="card-title">รายการผู้ใช้งาน</h4>
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
            รออนุมัติ ({{ items_wating_count }})
          </button>
          <button
            class="btn btn-outline btn-outline-success btn-sm fs-7 ms-2"
            @click="onchangeCurrentStatus('success')"
          >
            อนุมัติเสร็จสิ้น
          </button>
          <!-- buttons -->
        </div>
      </div>
      <!-- <div class="card-body" style="padding-bottom: 0px">
        <button
          class="btn btn-outline btn-outline-success btn-sm fs-7"
          type="button"
          @click="onAddModal"
        >
          <i class="fa fa-plus fs-4"></i>
          <span class="d-none d-lg-inline-block ms-2">เพิ่มผู้ใช้งาน</span>
        </button>
      </div> -->
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
          @edit="(it: any) => {onEditModal(it) }"
          @delete="(it: any) => {onDelete(it) }"
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
          @edit="(it: any) => {onEditModal(it) }"
          @delete="(it: any) => {onDelete(it) }"
        />
      </div>
      <div class="card-footer"></div>
    </div>

    <!-- Modal -->
    <div>
      <!-- Add Modal -->
      <div id="add-user-modal">
        <AddUserComponent
          v-if="openAddModal == true"
          :id="item.id"
          @close-modal="
            () => {
              fetchItems();
              openAddModal = false;
            }
          "
        />
      </div>
      <!-- Edit Modal -->
      <div id="edit-user-modal">
        <EditUserComponent
          v-if="openEditModal == true"
          :id="item.id"
          @close-modal="
            () => {
              fetchItems();
              openEditModal = false;
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
import ListComponent from "@/components/users/ListAllActive.vue";
import CardListComponent from "@/components/users/CardAllActive.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import SearchComponent from "@/components/students/Search.vue";
import EditUserComponent from "@/components/users/Edit.vue";
import AddUserComponent from "@/components/users/Add.vue";

export default defineComponent({
  name: "staff-manage-user",
  components: {
    ListComponent,
    CardListComponent,
    Preloader,
    SearchComponent,
    EditUserComponent,
    AddUserComponent,
  },
  setup() {
    // UI Variable
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
    const openEditModal = ref(false);
    const openAddModal = ref(false);

    // Variable
    const items = reactive<any>([]); // form items
    const item = reactive<any>({}); // form item
    const items_wating_count = ref(0);
    const search = reactive<any>({
      search_name: "",
    });

    // Fetch Data
    const fetchCountWatingItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        is_active: true,
        status_id: 1,
      };

      const { data } = await ApiService.query("user/count-all", {
        params: params,
      });

      items_wating_count.value = data.count;
    };
    fetchCountWatingItems();

    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        is_active: true,
        ...paginationData,
        orderBy: sortKey.value,
        order: sortOrder.value == 1 ? "asc" : "desc",
      };

      const { data } = await ApiService.query("user", {
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
    const onAddModal = () => {
      openAddModal.value = true;
    };
    const onEditModal = (it: any) => {
      Object.assign(item, it);
      openEditModal.value = true;
    };
    const onDelete = async (it: any) => {
      await ApiService.delete("user/" + it);
      fetchItems();
      useToast("ระงับการใช้งาน", "success");
    };
    const onClear = () => {};

    const onchangeCurrentStatus = async (cas: string) => {
      current_active_status.value = cas;
      if (cas == "wating") {
        search.status_id = 1;
      } else if (cas == "success") {
        search.status_id = 2;
      } else {
        search.status_id = undefined;
      }
      await fetchItems();
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
      openAddModal,
      openEditModal,
      //   Event
      onchangeCurrentStatus,
      fetchItems,
      onClear,
      onAddModal,
      onEditModal,
      onDelete,
    };
  },
});
</script>
