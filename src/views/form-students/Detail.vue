<template>
  <!--begin::Wrapper-->

  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="main-modal"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">ข้อมูลนักศึกษา</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading">
          <div class="container mt-5">
            <!-- Profile -->

            <div class="row">
              <div class="col-md-3">
                <StudentProfileMinimalCardComponent
                  :item="student_profile_item"
                />
              </div>
              <div class="col-md-9">
                <div class="card shadow-sm my-5">
                  <div
                    class="card-header bg-white d-flex justify-content-end"
                    style="border-bottom: none"
                  >
                    <!-- <div class="card-toolbar">
              <button
                class="btn btn-outline btn-outline-primary me-2 pe-sm-3 ps-sm-5"
                @click="onEditStudentProfileModal"
                :disabled="
                  student_profile_item.status_id == 1 ||
                  student_profile_item.status_id == 2
                    ? false
                    : true
                "
              >
                <i class="fa fa-edit"></i>
                <span class="d-none d-lg-inline-block">แก้ไขข้อมูลส่วนตัว</span>
              </button>
            </div> -->
                  </div>
                  <div class="card-body" style="padding-top: 0rem">
                    <StudentProfileCardComponent
                      :item="student_profile_item"
                      :documents="documents"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="card shadow-sm my-5">
              <div class="card-header bg-white">
                <h4 class="card-title">ใบสมัครโครงการ CWIE</h4>
                <div class="card-toolbar">
                  <ButtonsDownloadGroupComponent
                    :student_profile_item="student_profile_item"
                    :item="item_active"
                  />

                  <button
                    class="btn btn-outline btn-outline-success me-2 pe-sm-3 ps-sm-5"
                    @click="
                      approve_at = 'advisor_verified_at';
                      onApproveFormModal(student_profile_item.status_id, 1);
                    "
                    v-if="
                      parantPage == 'advisor' &&
                      student_profile_item.status_id == 2 &&
                      userData.group_id == 6 &&
                      student_profile_item.advisor_id ==
                        userData.teacher_profile.id
                    "
                  >
                    <i class="bi bi-file-earmark-plus-fill fs-4"></i>
                    <span class="d-none d-lg-inline-block ms-2"
                      >อาจารย์ที่ปรึกษาพิจารณาอนุมัติ</span
                    >
                  </button>

                  <button
                    class="btn btn-outline btn-outline-success me-2 pe-sm-3 ps-sm-5"
                    @click="
                      approve_at = 'division_head_approved_at';
                      onApproveFormModal(student_profile_item.status_id, 2);
                    "
                    v-if="
                      parantPage == 'division-head' &&
                      student_profile_item.status_id == 4 &&
                      userData.group_id == 6 &&
                      item_active.division_head_id ==
                        userData.teacher_profile.id
                    "
                  >
                    <i class="bi bi-file-earmark-plus-fill fs-4"></i>
                    <span class="d-none d-lg-inline-block ms-2"
                      >ประธานอาจารย์นิเทศพิจารณาอนุมัติ</span
                    >
                  </button>

                  <button
                    class="btn btn-outline btn-outline-success me-2 pe-sm-3 ps-sm-5"
                    @click="
                      approve_at = 'staff_confirmed_at';
                      onApproveFormModal(student_profile_item.status_id, 3);
                    "
                    v-if="
                      student_profile_item.status_id == 5 &&
                      checkStaffPermission
                    "
                  >
                    <i class="bi bi-file-earmark-plus-fill fs-4"></i>
                    <span class="d-none d-lg-inline-block ms-2"
                      >เจ้าหน้าที่พิจารณาอนุมัติ</span
                    >
                  </button>

                  <button
                    class="btn btn-outline btn-outline-success me-2 pe-sm-3 ps-sm-5"
                    @click="
                      approve_at = 'confirm_response_at';
                      onApproveFormModal(student_profile_item.status_id, 4);
                    "
                    v-if="
                      student_profile_item.status_id == 8 &&
                      checkStaffPermission
                    "
                  >
                    <i class="bi bi-file-earmark-plus-fill fs-4"></i>
                    <span class="d-none d-lg-inline-block ms-2"
                      >พิจารณาอนุมัติเอกสารตอบกลับ</span
                    >
                  </button>

                  <button
                    class="btn btn-outline btn-outline-success me-2 pe-sm-3 ps-sm-5"
                    @click="
                      approve_at = 'plan_accept_at';
                      onApproveFormModal(student_profile_item.status_id, 5);
                    "
                    v-if="
                      parantPage == 'visitos' &&
                      student_profile_item.status_id == 12 &&
                      userData.group_id == 6 &&
                      student_profile_item.visitor_id ==
                        userData.teacher_profile.id
                    "
                  >
                    <i class="bi bi-file-earmark-plus-fill fs-4"></i>
                    <span class="d-none d-lg-inline-block ms-2"
                      >พิจารณาอนุมัติแผนการปฏิบัติงาน</span
                    >
                  </button>

                  <button
                    class="btn btn-outline btn-outline-success me-2 pe-sm-3 ps-sm-5"
                    @click="
                      approve_at = 'report_accept_at';
                      onApproveFormModal(student_profile_item.status_id, 6);
                    "
                    v-if="
                      parantPage == 'visitos' &&
                      student_profile_item.status_id == 15 &&
                      userData.group_id == 6 &&
                      student_profile_item.visitor_id ==
                        userData.teacher_profile.id
                    "
                  >
                    <i class="bi bi-file-earmark-plus-fill fs-4"></i>
                    <span class="d-none d-lg-inline-block ms-2"
                      >พิจารณาอนุมัติรายงานผลการปฏิบัติงาน</span
                    >
                  </button>

                  <button
                    class="btn btn-outline btn-outline-success me-2 pe-sm-3 ps-sm-5"
                    @click="
                      approve_at = 'closed_at';
                      onApproveFormModal(student_profile_item.status_id, 6);
                    "
                    v-if="
                      student_profile_item.status_id == 17 &&
                      checkStaffPermission
                    "
                  >
                    <i class="bi bi-file-earmark-plus-fill fs-4"></i>
                    <span class="d-none d-lg-inline-block ms-2"
                      >จบสหกิจศึกษา</span
                    >
                  </button>

                  <!-- <div class="dropdown">
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
          </div> -->

                  <!-- <div class="dropdown">
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
          </div> -->
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
                  @edit="(it: any) => {onEditFormModal(it)}"
                  @detail="(it: any) => {onFormDetailModal(it) }"
                  @cancel="(it: any) => {onFormCancel(it) }"
                  @history-reject="(it: any) =>{ onHistoryRejectModal(it)}"
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
                  @edit="(it: any) => {onEditFormModal(it)}"
                  @detail="(it: any) => {onFormDetailModal(it) }"
                  @cancel="(it: any) => {onFormCancel(it) }"
                  @history-reject="(it: any) =>{ onHistoryRejectModal(it)}"
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

              <!-- Add Form Modal -->
              <div id="add-form-modal">
                <AddFormPage
                  v-if="openAddFormModal == true"
                  :student_profile="student_profile_item"
                  @reload="fetchStudentProfile()"
                  @close-modal="
                    () => {
                      fetchItems();
                      openAddFormModal = false;
                    }
                  "
                />
              </div>

              <!-- Edit Form Modal -->
              <div id="edit-form-modal">
                <EditFormPage
                  v-if="openEditFormModal == true"
                  :student_profile="student_profile_item"
                  :id="item.id"
                  @reload="fetchStudentProfile()"
                  @close-modal="
                    () => {
                      fetchItems();
                      openEditFormModal = false;
                    }
                  "
                />
              </div>

              <!-- Detail Form Modal -->
              <div id="detail-form-modal">
                <DetailFormPage
                  v-if="openDetailFormModal == true"
                  :student_profile="student_profile_item"
                  :id="item.id"
                  @reload="fetchStudentProfile()"
                  @close-modal="
                    () => {
                      openDetailFormModal = false;
                    }
                  "
                />
              </div>

              <!-- History Reject Modal -->
              <div id="history-reject-modal">
                <HistoryRejectPage
                  v-if="openHistoryRejectModal == true"
                  :id="item.id"
                  @close-modal="
                    () => {
                      openHistoryRejectModal = false;
                    }
                  "
                />
              </div>

              <!-- Approve Modal -->
              <div id="approve-modal">
                <!--  -->
                <ApproveModalPage
                  v-if="openApproveModal == true"
                  :item="item"
                  :reject_status_id="reject_status_id"
                  :approve_at="approve_at"
                  @close-modal="
                    () => {
                      fetchStudentProfile();
                      fetchItems();
                      openApproveModal = false;
                    }
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  watch,
  onUnmounted,
} from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";
import { Modal } from "bootstrap";
import useToast from "@/composables/useToast";

// Component
import StudentProfileMinimalCardComponent from "@/components/student/StudentProfileMinimalCard.vue";
import StudentProfileCardComponent from "@/components/student/StudentProfileCard.vue";
import ListComponent from "@/components/students/form/ListOneStudent.vue";
import CardListComponent from "@/components/students/form/CardListOneStudent.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import ButtonsDownloadGroupComponent from "@/components/document/ButtonsDownloadGroup.vue";

// Modal
import DetailPage from "@/views/paper/DetailModal.vue";
import EditStudentProfilePage from "@/views/student/EditProfile.vue";
import AddFormPage from "@/views/form/Add.vue";
import EditFormPage from "@/views/form/Edit.vue";
import DetailFormPage from "@/views/form/Detail.vue";
import HistoryRejectPage from "@/views/form/HistoryRejectModal.vue"; // ประวัติการแก้ไข
import ApproveModalPage from "@/views/form-students/ApproveModal.vue"; // ประวัติการแก้ไข

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
    AddFormPage,
    EditFormPage,
    DetailFormPage,
    ApproveModalPage,
    ButtonsDownloadGroupComponent,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    parantPage: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    // UI Variable
    const isLoading = ref<any>(false);
    const sortKey = ref<any>("");
    const sortOrder = ref<any>(-1);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);
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
    const openAddFormModal = ref(false);
    const openApproveModal = ref(false);

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const student_profile_item = ref<any>({});
    const items = reactive<any>([]); // form items
    const item = reactive<any>({}); // form item
    const item_active = reactive<any>({});
    const documents = ref([]);
    const document_types = ref([]);
    const reject_status_id = ref<any>(null);
    const approve_at = ref<any>(null);

    // Fetch Data
    const fetchStudentProfile = async () => {
      isLoading.value = true;
      const { data } = await ApiService.query(
        `student-profile/${item.student_id}`,
        {}
      );

      student_profile_item.value = data.data;

      let prefix: any = "";
      student_profile_item.value.advisor_fullname = "";
      if (student_profile_item.value.advisor_detail) {
        prefix =
          student_profile_item.value.advisor_detail.prefix != null
            ? student_profile_item.value.advisor_detail.prefix
            : "อ.";

        student_profile_item.value.advisor_fullname =
          prefix +
          student_profile_item.value.advisor_detail?.firstname +
          " " +
          student_profile_item.value.advisor_detail?.surname;
      }

      await fetchDocuments();
      isLoading.value = false;
    };

    const fetchDocuments = async () => {
      try {
        const { data } = await ApiService.query("document/", {
          params: {
            student_id: student_profile_item.value.id,
            is_active: true,
          },
        });

        documents.value = data.data;
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDocumentTypes = async () => {
      try {
        const { data } = await ApiService.query("document-type/", {
          params: {
            is_active: true,
          },
        });

        document_types.value = data.data;
      } catch (error) {
        console.log(error);
      }
    };
    fetchDocumentTypes();

    const fetchItem = async () => {
      isLoading.value = true;
      const { data } = await ApiService.query(`form/${props.id}`, {});

      Object.assign(item, data.data);
      isLoading.value = false;
    };

    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        orderBy: "id",
        order: "desc",
        student_id: item.student_id,
      };

      const { data } = await ApiService.query("form", {
        params: params,
      });

      Object.assign(
        item_active,
        data.data.find((x: any) => {
          return (x.is_active = true);
        })
      );

      items.length = 0;
      Object.assign(items, data.data);
      paginationData.totalPage = data.totalPage;
      paginationData.totalItems = data.totalData;
      paginationData.currentPage = data.currentPage;

      isLoading.value = false;
    };

    // Modal action

    const onEditStudentProfileModal = () => {
      openEditStudentProfileModal.value = true;
    };

    const onCheckStudentProfile = () => {
      let res = true;
      const {
        advisor_id,
        prefix,
        firstname,
        surname,
        class_year,
        gpa,
        address,
        province_id,
        district_id,
        sub_district_id,
        email,
        phone,
        contact1_name,
        contact1_phone,
        contact1_relation,
        contact2_name,
        contact2_phone,
        contact2_relation,
        blood_group,
        height,
        weight,
        emergency_phone,
        congenital_disease,
        drug_allergy,
      } = student_profile_item.value;

      if (
        [
          advisor_id,
          prefix,
          firstname,
          surname,
          class_year,
          gpa,
          address,
          province_id,
          district_id,
          sub_district_id,
          email,
          phone,
          contact1_name,
          contact1_phone,
          contact1_relation,
          contact2_name,
          contact2_phone,
          contact2_relation,
          blood_group,
          height,
          weight,
          emergency_phone,
          congenital_disease,
          drug_allergy,
        ].some((value) => !value)
      ) {
        return false;
      }

      document_types.value.forEach((el: any) => {
        let check_doc = documents.value.find((x: any) => {
          return x.document_type_id == el.id;
        });
        if (!check_doc) {
          res = false;
        }
      });

      return res;
    };

    const onAddFormModal = (it: any) => {
      let check = onCheckStudentProfile();
      if (!check) {
        useToast("โปรดระบุข้อมูลส่วนตัวให้ครบถ้วน", "error");
        return;
      }
      Object.assign(item, it);
      openAddFormModal.value = true;
    };

    const onEditFormModal = (it: any) => {
      Object.assign(item, it);
      openEditFormModal.value = true;
    };

    const onFormDetailModal = (it: any) => {
      Object.assign(item, it);
      openDetailFormModal.value = true;
    };

    const onHistoryRejectModal = (it: any) => {
      Object.assign(item, it);
      openHistoryRejectModal.value = true;
    };

    const onFormCancel = async (it: any) => {
      await ApiService.delete("form/cancel/" + it.id);

      await ApiService.post(
        `student-profile/${student_profile_item.value.id}`,
        {
          status_id: 1,
        }
      )
        .then(({ status }) => {
          if (status != 200) {
            throw new Error("ERROR");
          }
        })
        .catch(({ response }) => {
          console.log(response);
        });

      useToast("ยกเลิกใบสมัครเสร็จสิ้น", "success");

      //
    };

    const onApproveFormModal = async (
      current_form_status_id: number,
      reject_status: number
    ) => {
      reject_status_id.value = reject_status;
      openApproveModal.value = true;
    };

    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      emit("close-modal");
    };

    const checkStaffPermission = () => {
      const check =
        userData.group_id == 1 ||
        userData.group_id == 2 ||
        (userData.group_id == 3 &&
          userData.staff_profile.faculty_id ==
            student_profile_item.value.faculty_id) ||
        (userData.group_id == 4 &&
          userData.staff_profile.value.department_id ==
            student_profile_item.value.department_id) ||
        (userData.group_id == 5 &&
          userData.staff_profile.division_id ==
            student_profile_item.value.division_id);

      return props.parantPage == "staff" && check;
    };

    // Mounted
    onMounted(async () => {
      await fetchItem();
      await fetchStudentProfile();
      await fetchItems();

      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );
    });

    onUnmounted(() => {
      if (mainModalRef.value) {
        mainModalRef.value.removeEventListener("hidden.bs.modal", onClose);
      }
      mainModalObj.value.hide();
      emit("close-modal");
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
      userData,
      student_profile_item,
      items,
      item,
      approve_at,
      item_active,
      mainModalRef,
      reject_status_id,
      documents,
      paginationData,
      sortKey,
      sortOrder,
      sortedItems,
      isLoading,
      openEditStudentProfileModal,
      openEditFormModal,
      openHistoryRejectModal,
      openAddFormModal,
      openDetailFormModal,
      openApproveModal,
      //   Fetch
      fetchStudentProfile,
      fetchItems,
      //   Event
      checkStaffPermission,
      onEditStudentProfileModal,
      onHistoryRejectModal,
      onAddFormModal,
      onFormDetailModal,
      onEditFormModal,
      onFormCancel,
      onApproveFormModal,
      onClose,
    };
  },
});
</script>
