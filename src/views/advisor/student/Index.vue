<template>
  <!--begin::Wrapper-->
  <div class="container mt-5">
    <!-- Profile -->
    <!-- 
    <div class="accordion" id="accordionExample">
      <div class="accordion-item border rounded shadow-sm">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="false"
            aria-controls="collapseOne"
          >
            ค้นหาใบสมัคร
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            
          </div>
        </div>
      </div>
    </div> -->
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
        <h4 class="card-title">ใบสมัครโครงการ CWIE</h4>
        <div class="card-toolbar">
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
          @detail="(it: any) => {onFormDetailModal(it) }"
        />
      </div>
      <!-- <div class="card-body d-lg-none">
          <CardListComponent
            :items="items"
            :paginationData="paginationData"
            :sortKey="sortKey"
            :sortOrder="sortOrder"
            @update:currentPage="paginationData.currentPage = $event"
            @update:perPage="paginationData.perPage = $event"
            @sort="(key: any) => {
              sortedItems(key)}"
            @edit="(it: any) => {goToFormEditPage(it.id)}"
            @detail="(it: any) => {onFormDetailModal(it) }"
            @history-detail="(it: any) =>{ onHistoryRejectModal(it)}"
          />
        </div> -->
    </div>

    <!-- Modal -->
    <div>
      <!-- Detail Form Modal -->
      <div id="detail-form-modal">
        <StudentDetailFormPage
          v-if="openDetailFormModal == true"
          :id="item.id"
          @close-modal="
            () => {
              openDetailFormModal = false;
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
import ListComponent from "@/components/students/form/List.vue";
import CardListComponent from "@/components/form/CardList.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import SearchComponent from "@/components/students/Search.vue";
// Modal
import StudentDetailFormPage from "@/views/students/Detail.vue";

export default defineComponent({
  name: "student",
  components: {
    ListComponent,
    CardListComponent,
    Preloader,
    StudentDetailFormPage,
    SearchComponent,
  },
  setup() {
    // UI Variable
    const isLoading = ref<any>(false);
    const sortKey = ref<any>("");
    const sortOrder = ref<any>(-1);
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
    const search = reactive<any>({});

    // Fetch Data

    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        orderBy: "id",
        order: "desc",
        is_active: true,
        form_status_id: "2,3,4,5,6,7,8,9,10",
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

    const onClear = () => {
      Object.assign(search, {
        complaint_type_id: null,
        year: null,
        complaint_title: "",
        jcoms_no: "",
        complainant_fullname: "",
        accused_fullname: "",
        inspector_id: null,
        bureau_id: null,
        division_id: null,
        agency_id: null,
        state_id: null,
        inspector_state_id: null,
        create_from: null,
        create_to: null,
        topic_category_id: null,
        topic_type_id: null,
        complaint_channel_id: null,
        incident_datetime: null,
        province_id: null,
        district_id: null,
        sub_district_id: null,
        card_type: null,
        id_card: "",
        is_anonymous: null,
        receive_doc_no: "",
      });
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
      search,
      paginationData,
      sortKey,
      sortOrder,
      sortedItems,
      isLoading,
      openDetailFormModal,
      //   Event
      onFormDetailModal,
      fetchItems,
      onClear,
    };
  },
});
</script>
