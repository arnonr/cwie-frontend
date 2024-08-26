<template>
  <!--begin::Wrapper-->
  <div class="container mt-5">
    <!-- Search -->
    <div class="card shadow-sm my-6">
      <SearchComponent :search="search" @search="fetchItems" @clear="onClear" />
    </div>
    <!-- Profile -->
    <div class="card shadow-sm my-5">
      <div class="card-header bg-white">
        <h4 class="card-title">รายการผู้ใช้งาน</h4>
      </div>
      <div class="card-body table-responsive d-none d-lg-block">
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
          @edit="(it: any) => {goToEditPage(it.id)}"
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
          @edit="(it: any) => {goToEditPage(it.id)}"
        />
      </div>
    </div>

    <div>
      <div id="edit-modal">
        <EditUserPage
          v-if="openEditModal == true"
          :item="item"
          @close-modal="
            () => {
              openEditModal = false;
            }
          "
          @reload="fetchItems"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";

// Component
import SearchComponent from "@/components/user/Search.vue";
import ListComponent from "@/components/user/AdminList.vue";
import CardListComponent from "@/components/user/AdminCardList.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import EditUserPage from "@/views/admin-user/EditUserModal.vue";

export default defineComponent({
  name: "admin-user",
  components: {
    SearchComponent,
    ListComponent,
    CardListComponent,
    EditUserPage,
    Preloader,
    //   ManageReviewPaperPage,
  },
  setup() {
    // UI Variable
    const isLoading = ref<any>(false);
    const router = useRouter();
    const sortKey = ref<any>("");
    const sortOrder = ref<any>(-1);

    // Variable
    const search = reactive<any>({});

    const items = reactive<any[]>([]);
    const item = reactive<any>({});

    const paginationData = reactive<any>({
      perPage: 20,
      currentPage: 1,
      totalPage: 1,
      totalItems: 0,
    });

    const openEditModal = ref(false);

    // Fetch Data
    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        department_id: search.department_id?.id ?? undefined,
        orderBy: sortKey.value != "" ? sortKey.value : "created_at",
        order: sortOrder.value == 1 ? "asc" : "desc",
        perPage: paginationData.perPage,
        currentPage: paginationData.currentPage,
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

    // Event
    const onClear = () => {
      Object.keys(search).forEach((key) => {
        if (typeof search[key] === "object" && search[key] !== null) {
          Object.keys(search[key]).forEach((subKey) => {
            search[key][subKey] = null;
          });
        } else {
          search[key] = null;
        }
      });
    };

    // Mounted
    onMounted(() => {
      fetchItems();
    });

    // Watch
    watch(
      () => paginationData.currentPage,
      () => {
        fetchItems();
      }
    );

    watch(
      () => paginationData.perPage,
      () => {
        fetchItems();
      }
    );

    const goToEditPage = (id: number) => {
      Object.assign(item, { id: id });
      openEditModal.value = true;
    };

    const sortedItems = (key: any) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value * -1;
      } else {
        sortKey.value = key;
      }

      if (!sortKey.value) return items;

      fetchItems();
    };

    return {
      search,
      items,
      item,
      paginationData,
      isLoading,
      onClear,
      fetchItems,
      goToEditPage,
      sortKey,
      sortOrder,
      sortedItems,
      openEditModal,
    };
  },
});
</script>
