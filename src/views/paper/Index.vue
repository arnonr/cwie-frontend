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
        <h4 class="card-title">ข้อมูลส่วนตัว</h4>
        <div class="card-toolbar">
          <button
            class="btn btn-outline btn-outline-primary me-2 pe-sm-3 ps-sm-5"
            @click="onEditUserModal"
          >
            <i class="fa fa-edit"></i>
            <span class="d-none d-lg-inline-block">แก้ไข</span>
          </button>
        </div>
      </div>
      <div class="card-body row">
        <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">ชื่อ-นามสกุล : </span>
          <span class="fst-italic"
            >{{ user_item.prefix_name != null ? user_item.prefix_name : ""
            }}{{ user_item.firstname + " " + user_item.surname }}</span
          >
          <div class="separator separator-dotted my-2"></div>
        </div>
        <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">หน่วยงาน : </span>
          <span class="fst-italic">{{ user_item.department?.name }}</span>
        </div>

        <div class="separator separator-dotted my-2"></div>
      </div>
    </div>
    <div class="card shadow-sm my-5">
      <div class="card-header bg-white">
        <h4 class="card-title">โครงการวิจัย</h4>
        <div class="card-toolbar">
          <button
            class="btn btn-outline btn-outline-primary me-2 pe-sm-3 ps-sm-5 disabled"
            @click="goToAddPage"
          >
            <i class="bi bi-file-earmark-plus-fill fs-4"></i>
            <span class="d-none d-lg-inline-block ms-2">เสนอโครงการวิจัย (ปิดรับ)</span>
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
          @detail="(it: any) => {onDetailModal(it) }"
          @history-detail="(it: any) =>{ onHistoryDetailModal(it)}"
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
          @detail="(it: any) => {onDetailModal(it) }"
          @history-detail="(it: any) =>{ onHistoryDetailModal(it)}"
        />
      </div>
    </div>

    <div>
      <div id="edit-user-modal">
        <EditUserPage
          v-if="openEditUserModal == true"
          :id="user_item.id"
          @close-modal="
            () => {
              openEditUserModal = false;
            }
          "
          @reload="fetchUser"
        />
      </div>

      <!-- Modal Detail ดูข้อมูล -->
      <div id="detail-modal">
        <DetailPage
          v-if="openDetailModal == true"
          :paper_id="item.id"
          @close-modal="
            () => {
              openDetailModal = false;
            }
          "
        />
      </div>

      <!-- Modal History Detail ดูข้อมูลประวัติการแก้ไข -->
      <div id="history-detail-modal">
        <HistoryDetailPage
          v-if="openHistoryDetailModal == true"
          :paper_id="item.id"
          @close-modal="
            () => {
              openHistoryDetailModal = false;
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
import { useRouter } from "vue-router";
import useToast from "@/composables/useToast";

// Component
import SearchComponent from "@/components/paper/Search.vue";
import ListComponent from "@/components/paper/List.vue";
import CardListComponent from "@/components/paper/CardList.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import EditUserPage from "@/views/user/EditUser.vue";
import DetailPage from "@/views/paper/DetailModal.vue";
import HistoryDetailPage from "@/views/paper/HistoryDetailModal.vue";

export default defineComponent({
  name: "paper",
  components: {
    SearchComponent,
    ListComponent,
    CardListComponent,
    Preloader,
    EditUserPage,
    DetailPage,
    HistoryDetailPage,
  },
  setup() {
    // UI Variable
    const isLoading = ref<any>(false);
    const router = useRouter();
    const sortKey = ref<any>("");
    const sortOrder = ref<any>(-1);

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const openEditUserModal = ref<any>(false);
    const user_item = reactive<any>({});

    const search = reactive<any>({});

    const items = reactive<any[]>([]);
    const item = reactive<any>({});

    const paginationData = reactive<any>({
      perPage: 20,
      currentPage: 1,
      totalPage: 1,
      totalItems: 0,
    });

    const openDetailModal = ref(false);
    const openEditModal = ref(false);
    const openReceive1Modal = ref(false);
    const openHistoryDetailModal = ref(false);

    // Fetch Data
    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        ...search,
        create_year: search.year ?? undefined,
        title_th: search.title_th ?? undefined,
        rp_no: search.rp_no ?? undefined,
        fullname: search.fullname ?? undefined,
        status_id: search.status_id?.id ?? undefined,
        orderBy: sortKey.value != "" ? sortKey.value : "created_at",
        order: sortOrder.value == 1 ? "asc" : "desc",
        perPage: paginationData.perPage,
        currentPage: paginationData.currentPage,
        user_id: userData.id,
      };

      const { data } = await ApiService.query("paper", {
        params: params,
      });

      items.length = 0;
      Object.assign(items, data.data);
      paginationData.totalPage = data.totalPage;
      paginationData.totalItems = data.totalData;
      paginationData.currentPage = data.currentPage;
      isLoading.value = false;
    };
    const fetchUser = async () => {
      try {
        const { data } = await ApiService.query("user/" + userData.id, {});
        Object.assign(user_item, {
          ...data.data,
          department_id:
            data.data.department_id != null
              ? {
                  name: data.data.department.name,
                  id: data.data.department_id,
                }
              : null,
        });
      } catch (error) {
        console.log(error);
      }
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

    const onExport = async () => {};

    // Modal action

    const onDetailModal = (it: any) => {
      Object.assign(item, it);
      openDetailModal.value = true;
    };

    const onEditUserModal = () => {
      openEditUserModal.value = true;
    };

    const onHistoryDetailModal = (it: any) => {
      Object.assign(item, it);
      openHistoryDetailModal.value = true;
    };

    // Mounted
    onMounted(() => {
      fetchUser();
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

    const goToAddPage = () => {
      if (
        user_item.prefix_name == "" ||
        user_item.firstname == "" ||
        user_item.surname == "" ||
        user_item.email == "" ||
        user_item.department_id == null
      ) {
        useToast("โปรดระบุข้อมูลส่วนตัวให้ครบถ้วน", "error");
        return;
      }
      router.push({ name: "paper-add" });
    };

    const goToEditPage = (id: number) => {
      if (
        user_item.prefix_name == "" ||
        user_item.firstname == "" ||
        user_item.surname == "" ||
        user_item.email == "" ||
        user_item.department_id == null
      ) {
        useToast("โปรดระบุข้อมูลส่วนตัวให้ครบถ้วน", "error");
        return;
      }
      router.push({ name: "paper-edit", params: { id: id } });
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
      onExport,
      onDetailModal,
      fetchItems,
      fetchUser,
      openDetailModal,
      openEditModal,
      openReceive1Modal,
      goToAddPage,
      goToEditPage,
      openEditUserModal,
      onEditUserModal,
      user_item,
      sortKey,
      sortOrder,
      sortedItems,
      openHistoryDetailModal,
      onHistoryDetailModal,
    };
  },
});
</script>
