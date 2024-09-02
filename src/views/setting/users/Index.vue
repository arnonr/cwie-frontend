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
            ทั้งหมด ({{ items_status.total.length }})
          </button>

          <button
            class="btn btn-outline btn-outline-warning btn-sm fs-7 ms-2"
            @click="onchangeCurrentStatus('wating')"
          >
            รออนุมัติ ({{ items_status.wating.length }})
          </button>
          <button
            class="btn btn-outline btn-outline-success btn-sm fs-7 ms-2"
            @click="onchangeCurrentStatus('success')"
          >
            อนุมัติเสร็จสิ้น ({{ items_status.success.length }})
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
          @edit="(it: any) => {onEditModal(it) }"
          @delete="(it: any) => {onDelete(it) }"
        />
      </div>
      <div class="card-body d-lg-none">
        <!-- <CardListComponent
          :items="items"
          :paginationData="paginationData"
          :sortKey="sortKey"
          :sortOrder="sortOrder"
          @update:currentPage="paginationData.currentPage = $event"
          @update:perPage="paginationData.perPage = $event"
          @sort="(key: any) => {
                sortedItems(key)}"
          @detail="(it: any) => {onFormDetailModal(it) }"
        /> -->
      </div>
      <div class="card-footer"></div>
    </div>

    <!-- Modal -->
    <div>
      <!-- Add Modal -->
      <div id="add-user-modal">
        <AddUserComponent
          v-if="openAddModal == true"
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
import useDateData from "@/composables/useDateData";
// Modal
import EditUserComponent from "@/components/users/Edit.vue";
import AddUserComponent from "@/components/users/Edit.vue";

export default defineComponent({
  name: "staff-student",
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
    const openAddModal = ref(false);
    const openEditModal = ref(false);

    // Variable
    const items = reactive<any>([]); // form items
    const item = reactive<any>({}); // form item
    const items_status = ref<any>({
      total: [],
      wating: [],
      success: [],
    });
    const search = reactive<any>({
      search_name: "",
    });

    // Fetch Data
    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        orderBy: "id",
        order: "desc",
        is_active: true,
      };

      const { data } = await ApiService.query("user", {
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
        if (x.form_status_id == 5) {
          items_status.value.wating.push(x);
        } else {
          items_status.value.success.push(x);
        }
      });

      isLoading.value = false;
    };

    // Modal action
    const onAddModal = (it: any) => {
      openAddModal.value = true;
    };

    const onEditModal = (it: any) => {
      Object.assign(item, it);
      console.log(item)
      openEditModal.value = true;
    };

    const onDelete = async (it: any) => {
      await ApiService.delete("user/" + it);
      fetchItems();
      useToast("ลบเสร็จสิ้น", "success");
    };

    const onClear = () => {};

    const onchangeCurrentStatus = (cas: string) => {
      current_active_status.value = cas;
      items.length = 0;
      Object.assign(items, [...items_status.value[cas]]);
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
      //   Event
      onchangeCurrentStatus,
      fetchItems,
      onClear,
      onAddModal,
      onEditModal,
      onDelete,
      openAddModal,
      openEditModal,
    };
  },
});
</script>
