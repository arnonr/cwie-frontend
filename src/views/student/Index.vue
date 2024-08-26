<template>
  <!--begin::Wrapper-->
  <div class="container mt-5">
    <!-- Profile -->

    <div class="row">
      <div class="col-md-3">
        <StudentProfileMinimalCardComponent :item="student_profile_item" />
      </div>
      <div class="col-md-9">
        <div class="card shadow-sm my-5">
          <div
            class="card-header bg-white d-flex justify-content-end"
            style="border-bottom: none"
          >
            <div class="card-toolbar">
              <button
                class="btn btn-outline btn-outline-primary me-2 pe-sm-3 ps-sm-5"
                @click="onEditStudentProfileModal"
              >
                <i class="fa fa-edit"></i>
                <span class="d-none d-lg-inline-block">กรอกข้อมูลส่วนตัว</span>
              </button>
            </div>
          </div>
          <div class="card-body" style="padding-top: 0rem">
            <StudentProfileCardComponent :item="student_profile_item" />
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm my-5">
      <div class="card-header bg-white">
        <h4 class="card-title">ใบสมัครโครงการ CWIE</h4>
        <div class="card-toolbar">
          <button
            class="btn btn-outline btn-outline-primary me-2 pe-sm-3 ps-sm-5"
            @click="onAddFormModal"
          >
            <i class="bi bi-file-earmark-plus-fill fs-4"></i>
            <span class="d-none d-lg-inline-block ms-2">กรอกใบสมัคร</span>
          </button>

          <div class="dropdown">
            <button
              class="btn btn-outline btn-outline-success me-2 pe-sm-3 ps-sm-5 dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-file-earmark-plus-fill fs-4"></i>
              <span class="d-none d-lg-inline-block">ดาวน์โหลดเอกสาร</span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <a class="dropdown-item cursor-pointer" @click=""
                  >ใบสมัครโครงการ</a
                >
              </li>
              <li>
                <a class="dropdown-item cursor-pointer" @click=""
                  >หนังสือขอความอนุเคราะห์</a
                >
              </li>
              <li>
                <a class="dropdown-item cursor-pointer" @click=""
                  >หนังสือส่งตัว
                </a>
              </li>
            </ul>
          </div>

          <div class="dropdown">
            <button
              class="btn btn-outline btn-outline-info me-2 pe-sm-3 ps-sm-5 dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-file-earmark-plus-fill fs-4"></i>
              <span class="d-none d-lg-inline-block">อัพโหลดเอกสาร</span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <a class="dropdown-item cursor-pointer" @click=""
                  >เอกสารตอบรับ</a
                >
              </li>
              <li>
                <a class="dropdown-item cursor-pointer" @click=""
                  >แผนการปฏิบัติงาน</a
                >
              </li>
            </ul>
          </div>

          <button
            class="btn btn-outline btn-outline-danger me-2 pe-sm-3 ps-sm-5"
            @click="goToAddPage"
          >
            <i class="bi bi-file-earmark-plus-fill fs-4"></i>
            <span class="d-none d-lg-inline-block ms-2">ยกเลิกใบสมัคร</span>
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

    <!-- Modal -->
    <div>
      <!-- Edit Student Profile Modal -->
      <div id="edit-student-profile-modal">
        <EditStudentProfilePage
          v-if="openEditStudentProfileModal == true"
          :id="student_profile_item.id"
          @close-modal="
            () => {
              openEditStudentProfileModal = false;
            }
          "
          @reload="fetchStudentProfile()"
        />
      </div>

      <!-- Modal Detail ดูข้อมูล -->
      <!-- <div id="detail-modal">
        <DetailPage
          v-if="openDetailModal == true"
          :paper_id="item.id"
          @close-modal="
            () => {
              openDetailModal = false;
            }
          "
        />
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";
import useToast from "@/composables/useToast";

// Component
import StudentProfileMinimalCardComponent from "@/components/student/StudentProfileMinimalCard.vue";
import StudentProfileCardComponent from "@/components/student/StudentProfileCard.vue";
import ListComponent from "@/components/form/List.vue";
import CardListComponent from "@/components/form/CardList.vue";
import Preloader from "@/components/preloader/Preloader.vue";
// Modal
import DetailPage from "@/views/paper/DetailModal.vue";
import EditStudentProfilePage from "@/views/student/Edit.vue";
import HistoryRejectPage from "@/views/paper/HistoryDetailModal.vue"; // ประวัติการแก้ไข

export default defineComponent({
  name: "student",
  components: {
    StudentProfileMinimalCardComponent,
    StudentProfileCardComponent,
    ListComponent,
    CardListComponent,
    Preloader,
    DetailPage,
    EditStudentProfilePage,
    HistoryRejectPage,
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
    const openEditStudentProfileModal = ref<any>(false);
    const openDetailFormModal = ref(false);
    const openEditFormModal = ref(false);
    const openHistoryRejectModal = ref(false);

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const student_profile_item = ref<any>({});
    const items = reactive<any>([]); // form items
    const item = reactive<any>({}); // form item
    // const edit_student_profile_item = ref<any>({});
    // const edit_item = ref<any>({}); // form item

    // Fetch Data
    const fetchStudentProfile = async () => {
      isLoading.value = true;
      const { data } = await ApiService.query(
        `student-profile/${userData.student_profile.id}`,
        {}
      );

      student_profile_item.value = data.data;
      isLoading.value = false;
    };

    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        student_id: userData.student_profile.id,
      };

      const { data } = await ApiService.query("student-profile", {
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
    const onDetailModal = (it: any) => {
      Object.assign(item, it);
      openDetailFormModal.value = true;
    };

    const onEditStudentProfileModal = () => {
      openEditStudentProfileModal.value = true;
    };

    const onHistoryRejectModal = (it: any) => {
      Object.assign(item, it);
      openHistoryRejectModal.value = true;
    };

    const onAddFormModal = (it: any) => {
      Object.assign(item, it);
      openEditFormModal.value = true;
    };

    const onEditFormModal = (it: any) => {
      Object.assign(item, it);
      openEditFormModal.value = true;
    };

    // Mounted
    onMounted(() => {
      fetchStudentProfile();
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
      student_profile_item,
      items,
      item,
      paginationData,
      sortKey,
      sortOrder,
      sortedItems,
      isLoading,
      openEditStudentProfileModal,
      openDetailFormModal,
      openEditFormModal,
      openHistoryRejectModal,
      //   Fetch
      fetchStudentProfile,
      fetchItems,
      //   Event
      onDetailModal,
      onEditStudentProfileModal,
      onHistoryRejectModal,
      onAddFormModal,
      onEditFormModal,
    };
  },
});
</script>
