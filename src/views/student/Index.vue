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
                :disabled="
                  student_profile_item.status_id == 1 ||
                  student_profile_item.status_id == 3
                    ? false
                    : true
                "
              >
                <i class="fa fa-edit"></i>
                <span class="d-none d-lg-inline-block">กรอกข้อมูลส่วนตัว</span>
              </button>
            </div>
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

    <div class="alert alert-info d-flex align-items-center p-5">
      <i class="ki-duotone ki-shield-tick fs-2hx text-success me-4"
        ><span class="path1"></span><span class="path2"></span
      ></i>

      <div class="d-flex flex-column">
        <!-- <h4 class="mb-1 text-dark">This is an alert</h4> -->
        <span v-if="student_profile_item.status_id == 1">
          1. คลิกปุ่ม กรอกข้อมูลส่วนตัว และทำการกรอกข้อมูลส่วนตัวให้ครบถ้วน<br />
          2. คลิกปุ่ม กรอกใบสมัคร และทำการกรอกข้อมูลใบสมัครให้ครบถ้วน
        </span>
        <span v-if="student_profile_item.status_id == 2">
          รออนุมัติใบสมัคร<br />
        </span>
        <span v-if="student_profile_item.status_id == 3">
          แก้ไขใบสมัคร โดยดู Comment ได้ที่ปุ่มจัดการ > ประวัติการ Comment<br />
        </span>

        <span v-if="student_profile_item.status_id == 6">
          สามารถดาวน์โหลดใบสมัครได้ที่ปุ่ม ดาวน์โหลดเอกสาร > ใบสมัครโครงการ<br />
        </span>

        <span v-if="student_profile_item.status_id == 7">
          1. สามารถดาวน์โหลดใบสมัครได้ที่ปุ่ม ดาวน์โหลดเอกสาร >
          หนังสือขอความอนุเคราะห์<br />
          2. นักศึกษาสามารถอัพโหลดเอกสารตอบรับได้ที่ปุ่ม อัพโหลดเอกสาร >
          เอกสารตอบรับ
        </span>

        <span v-if="student_profile_item.status_id == 8">
          1. รออนุมัติเอกสารตอบรับ<br />
        </span>

        <span v-if="student_profile_item.status_id == 9">
          ส่งเอกสารตอบรับใหม่ โดยดู Comment ได้ที่ปุ่มจัดการ > ประวัติการ
          Comment<br />
        </span>

        <span v-if="student_profile_item.status_id == 10">
          รอออกหนังสือส่งตัว<br />
        </span>
        <span v-if="student_profile_item.status_id == 11">
          1. นักศึกษาสามารถดาวน์โหลดหนังสืทอส่งตัวได้ที่ปุ่ม ดาวน์โหลดเอกสาร >
          หนังสือส่งตัว<br />
          2. นักศึกษาสามารถอัพโหลดแผนการปฏิบัติงานได้ที่ปุ่ม อัพโหลดเอกสาร >
          แผนการปฏิบัติงาน
        </span>
        <span v-if="student_profile_item.status_id == 12">
          1. รออนุมัติแผนการปฏิบัติงาน<br />
        </span>
        <span v-if="student_profile_item.status_id == 13">
          ส่งเอกสารแผนการปฏิบัติงานใหม่ โดยดู Comment ได้ที่ปุ่มจัดการ >
          ประวัติการ Comment<br />
        </span>
        <span v-if="student_profile_item.status_id == 14">
          1. นักศึกษาสามารถอัพโหลดรายงานผลการปฏิบัติงานได้ที่ปุ่ม อัพโหลดเอกสาร
          > รายงานผลการปฏิบัติงาน
        </span>
        <span v-if="student_profile_item.status_id == 15">
          1. รออนุมัติรายงานผลการปฏิบัติงาน<br />
        </span>
        <span v-if="student_profile_item.status_id == 16">
          ส่งรายงานผลการปฏิบัติงานใหม่ โดยดู Comment ได้ที่ปุ่มจัดการ >
          ประวัติการ Comment<br />
        </span>
        <span v-if="student_profile_item.status_id == 17">
          อนุมัติรายงานผลการปฏิบัติงาน
        </span>
        <span v-if="student_profile_item.status_id == 18">
          จบสหกิจศึกษา<br />
        </span>
      </div>
    </div>

    <div class="card shadow-sm my-5">
      <div class="card-header bg-white">
        <h4 class="card-title">ใบสมัครโครงการ CWIE</h4>
        <div class="card-toolbar">
          <button
            class="btn btn-outline btn-outline-primary me-2 pe-sm-3 ps-sm-5"
            @click="onAddFormModal"
            :disabled="
              student_profile_item.status_id == 1 ||
              student_profile_item.status_id == 3
                ? false
                : true
            "
          >
            <i class="bi bi-file-earmark-plus-fill fs-4"></i>
            <span class="d-none d-lg-inline-block ms-2">กรอกใบสมัคร</span>
          </button>

          <div class="dropdown">
            <ButtonsDownloadGroupComponent
              :student_profile_item="student_profile_item"
              :item="item_active"
            />
          </div>

          <div class="dropdown">
            <button
              class="btn btn-outline btn-outline-danger me-2 pe-sm-3 ps-sm-5 dropdown-toggle"
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
                <a
                  class="dropdown-item cursor-pointer"
                  :class="{
                    disabled:
                      student_profile_item.status_id != 7 &&
                      student_profile_item.status_id != 9,
                  }"
                  @click="
                    (student_profile_item.status_id == 7 ||
                      student_profile_item.status_id == 9) &&
                      onAddResponseModal()
                  "
                  >เอกสารตอบรับ</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item cursor-pointer"
                  :class="{
                    disabled:
                      student_profile_item.status_id != 11 &&
                      student_profile_item.status_id != 13,
                  }"
                  @click="
                    (student_profile_item.status_id == 11 ||
                      student_profile_item.status_id == 13) &&
                      onAddPlanModal()
                  "
                  >แผนการปฏิบัติงาน</a
                >
              </li>

              <li>
                <a
                  class="dropdown-item cursor-pointer"
                  :class="{
                    disabled:
                      student_profile_item.status_id != 14 &&
                      student_profile_item.status_id != 16,
                  }"
                  @click="
                    (student_profile_item.status_id == 14 ||
                      student_profile_item.status_id == 16) &&
                      onAddReportModal()
                  "
                  >รายงานผลการปฏิบัติงาน</a
                >
              </li>
            </ul>
          </div>
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

      <!-- Add Response Modal -->
      <div id="add-response-modal">
        <AddResponseComponent
          v-if="openAddResponseModal == true"
          :student_profile="student_profile_item"
          :item="item_active"
          @reload="
            () => {
              fetchStudentProfile();
              fetchItems();
            }
          "
          @close-modal="
            () => {
              openAddResponseModal = false;
            }
          "
        />
      </div>

      <!-- Add Plan Modal -->
      <div id="add-plan-modal">
        <AddPlanComponent
          v-if="openAddPlanModal == true"
          :student_profile="student_profile_item"
          :item="item_active"
          @reload="
            () => {
              fetchStudentProfile();
              fetchItems();
            }
          "
          @close-modal="
            () => {
              openAddPlanModal = false;
            }
          "
        />
      </div>

      <!-- Add Report Modal -->
      <div id="add-report-modal">
        <AddReportComponent
          v-if="openAddReportModal == true"
          :student_profile="student_profile_item"
          :item="item_active"
          @reload="
            () => {
              fetchStudentProfile();
              fetchItems();
            }
          "
          @close-modal="
            () => {
              openAddReportModal = false;
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
import StudentProfileMinimalCardComponent from "@/components/student/StudentProfileMinimalCard.vue";
import StudentProfileCardComponent from "@/components/student/StudentProfileCard.vue";
import ListComponent from "@/components/form/List.vue";
import CardListComponent from "@/components/form/CardList.vue";
import ButtonsDownloadGroupComponent from "@/components/document/ButtonsDownloadGroup.vue";
import Preloader from "@/components/preloader/Preloader.vue";
// Modal
import DetailPage from "@/views/paper/DetailModal.vue";
import EditStudentProfilePage from "@/views/student/EditProfile.vue";
import AddFormPage from "@/views/form/Add.vue";
import EditFormPage from "@/views/form/Edit.vue";
import DetailFormPage from "@/views/form/Detail.vue";
import HistoryRejectPage from "@/views/form/HistoryRejectModal.vue"; // ประวัติการแก้ไข
import AddResponseComponent from "@/components/form/AddResponse.vue";
import AddPlanComponent from "@/components/form/AddPlan.vue";
import AddReportComponent from "@/components/form/AddReport.vue";

export default defineComponent({
  name: "student",
  components: {
    StudentProfileMinimalCardComponent,
    StudentProfileCardComponent,
    AddResponseComponent,
    AddReportComponent,
    AddPlanComponent,
    ListComponent,
    CardListComponent,
    Preloader,
    DetailPage,
    EditStudentProfilePage,
    HistoryRejectPage,
    AddFormPage,
    EditFormPage,
    DetailFormPage,
    ButtonsDownloadGroupComponent,
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
    const openAddFormModal = ref(false);
    const openAddResponseModal = ref(false);
    const openAddPlanModal = ref(false);
    const openAddReportModal = ref(false);

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const student_profile_item = ref<any>({});
    const items = reactive<any>([]); // form items
    const item = reactive<any>({}); // form item
    const item_active = reactive<any>({});
    const documents = ref([]);
    const document_types = ref([]);

    // Fetch Data
    const fetchStudentProfile = async () => {
      isLoading.value = true;
      const { data } = await ApiService.query(
        `student-profile/${userData.student_profile.id}`,
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

    const fetchItems = async () => {
      isLoading.value = true;
      const params = {
        student_id: userData.student_profile.id,
        orderBy: "id",
        order: "desc",
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

      fetchStudentProfile();
      fetchItems();

      useToast("ยกเลิกใบสมัครเสร็จสิ้น", "success");

      //
    };

    const onAddResponseModal = () => {
      openAddResponseModal.value = true;
    };

    const onAddPlanModal = () => {
      openAddPlanModal.value = true;
    };

    const onAddReportModal = () => {
      openAddReportModal.value = true;
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
      item_active,
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
      openAddResponseModal,
      openAddPlanModal,
      openAddReportModal,
      //   Fetch
      fetchStudentProfile,
      fetchItems,
      //   Event
      onEditStudentProfileModal,
      onHistoryRejectModal,
      onAddFormModal,
      onFormDetailModal,
      onEditFormModal,
      onFormCancel,
      onAddResponseModal,
      onAddPlanModal,
      onAddReportModal,
    };
  },
});
</script>
