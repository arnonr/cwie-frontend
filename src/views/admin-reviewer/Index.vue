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
        <h4 class="card-title">รายการกรรมการ</h4>
        <div class="card-toolbar">
          <button
            class="btn btn-outline btn-outline-primary me-2 pe-sm-3 ps-sm-5"
            @click="goToAddPage()"
          >
            <i class="bi bi-file-earmark-plus-fill fs-4"></i>
            <span class="d-none d-lg-inline-block ms-2">เพิ่มกรรมการ</span>
          </button>
        </div>
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
          @delete="(it: any) => {onConfirmDelete(it.id)}"
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
          @delete="(it: any) => {onConfirmDelete(it.id)}"
        />
      </div>
    </div>

    <div>
      <div id="edit-modal">
        <EditReviewerPage
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

    <div>
      <div id="add-modal">
        <AddReviewerPage
          v-if="openAddModal == true"
          :item="item"
          @close-modal="
            () => {
              openAddModal = false;
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
import Swal from "sweetalert2/dist/sweetalert2.js";

// Component
import SearchComponent from "@/components/reviewer/Search.vue";
import ListComponent from "@/components/reviewer/AdminList.vue";
import CardListComponent from "@/components/reviewer/AdminCardList.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import EditReviewerPage from "@/views/admin-reviewer/EditReviewerModal.vue";
import AddReviewerPage from "@/views/admin-reviewer/AddReviewerModal.vue";
// Use Toast Composables
import useToast from "@/composables/useToast";

export default defineComponent({
  name: "admin-reviewer",
  components: {
    SearchComponent,
    ListComponent,
    CardListComponent,
    EditReviewerPage,
    AddReviewerPage,
    Preloader,
    //   ManageReviewPaperPage,
  },
  setup() {
    // UI Variable
    const isLoading = ref<any>(false);
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
    const openAddModal = ref(false);

    // Fetch Data
    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        orderBy: sortKey.value != "" ? sortKey.value : "created_at",
        order: sortOrder.value == 1 ? "asc" : "desc",
        perPage: paginationData.perPage,
        currentPage: paginationData.currentPage,
      };

      const { data } = await ApiService.query("reviewer", {
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

    const onConfirmDelete = async (id: number) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Cancel it!",
      }).then((result: any) => {
        if (result.isConfirmed) {
          onDelete(id);
        }
      });
    };

    const onDelete = async (id: number) => {
      isLoading.value = true;
      await ApiService.delete(`reviewer/${id}`)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          isLoading.value = false;
          useToast("ลบรายการเสร็จสิ้น", "success");
          fetchItems();
        })
        .catch(({ response }) => {
          isLoading.value = false;
          console.log(response);
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

    const goToAddPage = () => {
      openAddModal.value = true;
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
      openAddModal,
      goToAddPage,
      onConfirmDelete,
    };
  },
});
</script>
