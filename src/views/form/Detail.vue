<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="main-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">ใบสมัครโครงการ CWIE</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading && item">
          <div>
            <div class="header-detail my-6">
              <h6><i class="fa fa-book"></i> ข้อมูลใบสมัคร</h6>
            </div>
            <div class="content-detail row lh-xxl">
              <template v-for="(f, idx) in fields">
                <div
                  class="col-12"
                  :class="[f.colClass]"
                  v-if="f.model != 'separator'"
                >
                  <span>{{ f.label }} : </span>
                  <span v-html="item[f.model]"></span>
                  <div
                    class="separator separator-dashed my-4 d-block d-md-none"
                  ></div>
                </div>
                <div
                  v-if="f.model == 'separator'"
                  class="separator separator-dashed my-4 d-none d-md-block"
                ></div>
              </template>
              <div class="col-12 col-lg-12">
                <div>นามบัตรผู้ประสานงาน :</div>
                <img :src="item['namecard_file']" alt="" style="width:50%"/>
                <div
                  class="separator separator-dashed my-4 d-block d-md-none"
                ></div>
              </div>
              <div
                class="separator separator-dashed my-4 d-none d-md-block"
              ></div>
            </div>
          </div>

          <div>
            <div class="header-detail my-6">
              <h6><i class="fa fa-book"></i> ข้อมูลเอกสาร/ขั้นตอนการอนุมัติ</h6>
            </div>
            <div class="content-detail row lh-xxl">
              <template v-for="(f, idx) in fields2">
                <div
                  class="col-12"
                  :class="[f.colClass]"
                  v-if="f.model != 'separator'"
                >
                  <span>{{ f.label }} : </span>
                  <span>{{ item[f.model] }} </span>
                  <div
                    class="separator separator-dashed my-4 d-block d-md-none"
                  ></div>
                </div>
                <div
                  v-if="f.model == 'separator'"
                  class="separator separator-dashed my-4 d-none d-md-block"
                ></div>
              </template>
            </div>
          </div>

          <div>
            <div class="header-detail my-6">
              <h6><i class="fa fa-book"></i> ข้อมูลเอกสารตอบกลับ</h6>
            </div>
            <div class="content-detail row lh-xxl">
              <template v-for="(f, idx) in fields3">
                <div
                  class="col-12"
                  :class="[f.colClass]"
                  v-if="f.model != 'separator'"
                >
                  <span>{{ f.label }} : </span>
                  <span>{{ item[f.model] }} </span>
                  <div
                    class="separator separator-dashed my-4 d-block d-md-none"
                  ></div>
                </div>
                <div
                  v-if="f.model == 'separator'"
                  class="separator separator-dashed my-4 d-none d-md-block"
                ></div>
              </template>
            </div>
          </div>
          <div>
            <div class="header-detail my-6">
              <h6><i class="fa fa-book"></i> ข้อมูลแผนการปฏิบัติงาน</h6>
            </div>
            <div class="content-detail row lh-xxl">
              <template v-for="(f, idx) in fields4">
                <div
                  class="col-12"
                  :class="[f.colClass]"
                  v-if="f.model != 'separator'"
                >
                  <span>{{ f.label }} : </span>
                  <span>{{ item[f.model] }} </span>
                  <div
                    class="separator separator-dashed my-4 d-block d-md-none"
                  ></div>
                </div>
                <div
                  v-if="f.model == 'separator'"
                  class="separator separator-dashed my-4 d-none d-md-block"
                ></div>
              </template>
            </div>
          </div>
          <div>
            <div class="header-detail my-6">
              <h6><i class="fa fa-book"></i> รายงานผลการปฏิบัติสหกิจศึกษา</h6>
            </div>
            <div class="content-detail row lh-xxl">
              <template v-for="(f, idx) in fields5">
                <div
                  class="col-12"
                  :class="[f.colClass]"
                  v-if="f.model != 'separator'"
                >
                  <span>{{ f.label }} : </span>
                  <span>{{ item[f.model] }} </span>
                  <div
                    class="separator separator-dashed my-4 d-block d-md-none"
                  ></div>
                </div>
                <div
                  v-if="f.model == 'separator'"
                  class="separator separator-dashed my-4 d-none d-md-block"
                ></div>
              </template>
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
  onMounted,
  toRefs,
  onBeforeUnmount,
  getCurrentInstance,
  computed,
} from "vue";

import ApiService from "@/core/services/ApiService";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
import useDateData from "@/composables/useDateData";

export default defineComponent({
  name: "detail-form",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    // UI
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    // Variable
    const isLoading = ref(true);
    const item = ref<any>({});
    const fields = ref<any>([
      {
        label: "สถานะใบสมัคร",
        model: "form_status",
        colClass: "col-lg-12",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "วันที่ส่งใบสมัคร",
        model: "send_at",
        colClass: "col-lg-4",
      },
      {
        label: "ปีการศึกษา",
        model: "semester",
        colClass: "col-lg-4",
      },
      {
        label: "วันที่ปฏิบัติสหกิจศึกษา",
        model: "full_date",
        colClass: "col-lg-4",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "ประธานอาจารย์นิเทศประจำสาขาวิชา",
        model: "division_head_fullname",
        colClass: "col-lg-6",
      },
      {
        label: "ประธานหลักสูตรสหกิจศึกษาของคณะ",
        model: "faculty_head_fullname",
        colClass: "col-lg-6",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "อาจารย์นิเทศ",
        model: "supervision_fullname",
        colClass: "col-lg-6",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "สถานประกอบการ",
        model: "company",
        colClass: "col-lg-12",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "ที่ตั้งสถานประกอบการ",
        model: "company_address",
        colClass: "col-lg-12",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "คำนำหน้า ชื่อ-สกุล ผู้ประสานงาน",
        model: "co_name",
        colClass: "col-lg-6",
      },
      {
        label: "ตำแหน่ง ผู้ประสานงาน",
        model: "co_position",
        colClass: "col-lg-6",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "เบอร์โทรศัพท์ ผู้ประสานงาน",
        model: "co_phone",
        colClass: "col-lg-6",
      },
      {
        label: "Email ผู้ประสานงาน",
        model: "co_email",
        colClass: "col-lg-6",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },

      {
        label: "คำนำหน้า ชื่อ-สกุล ผู้เรียนถึง (ใช้ในการออกหนังสือ)",
        model: "request_name",
        colClass: "col-lg-6",
      },
      {
        label: "ตำแหน่งผู้เรียนถึง (ใช้ในการออกหนังสือ)",
        model: "request_position",
        colClass: "col-lg-6",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
    ]);

    const fields2 = ref<any>([
      {
        label: "วันที่อาจารย์ที่ปรึกษาอนุมัติ",
        model: "advisor_verified_at",
        colClass: "col-lg-4",
      },
      {
        label: "วันที่ประธานอาจารย์นิเทศอนุมัติ",
        model: "division_head_approved_at",
        colClass: "col-lg-4",
      },
      {
        label: "วันที่ประธานหลักสูตรสหกิจศึกษาอนุมัติ",
        model: "faculty_head_approved_at",
        colClass: "col-lg-4",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "วันที่เจ้าหน้าที่อนุมัติ",
        model: "staff_confirmed_at",
        colClass: "col-lg-4",
      },
      {
        label: "วันที่หนังสือขอความอนุเคราะห์",
        model: "request_document_date",
        colClass: "col-lg-4",
      },
      {
        label: "วันที่หนังสือส่งตัว",
        model: "send_document_date",
        colClass: "col-lg-4",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
    ]);

    const fields3 = ref<any>([
      {
        label: "วันที่ส่งหนังสือตอบกลับ",
        model: "response_send_at",
        colClass: "col-lg-4",
      },
      {
        label: "ไฟล์หนังสือผลการตอบกลับ",
        model: "response_document_file",
        colClass: "col-lg-4",
      },
      {
        label: "ผลการตอบกลับ",
        model: "response_result ",
        colClass: "col-lg-4",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "วันที่ยืนยันหนังสือตอบกลับ",
        model: "confirm_response_at",
        colClass: "col-lg-4",
      },
      {
        label: "จังหวัดที่ปฏิบัติงาน",
        model: "response_province_id",
        colClass: "col-lg-4",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
    ]);

    const fields4 = ref<any>([
      {
        label: "วันที่ส่งแผนการปฏิบัติงาน",
        model: "plan_send_at",
        colClass: "col-lg-4",
      },
      {
        label: "ไฟล์แผนการปฏิบัติงาน",
        model: "plan_document_file",
        colClass: "col-lg-4",
      },
      {
        label: "วันที่อาจารย์นิเทศอนมุัติแผน",
        model: "plan_accept_at",
        colClass: "col-lg-4",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "สถานที่ปฏิบัติงาน",
        model: "workplace_address",
        colClass: "col-lg-12",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์",
        model: "workplace_address_all",
        colClass: "col-lg-6",
      },
      {
        label: "Google Map",
        model: "workplace_googlemap_url",
        colClass: "col-lg-6",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
    ]);

    const fields5 = ref<any>([
      {
        label: "วันที่ส่งรายงานผลการปฏิบัติงาน",
        model: "send_at",
        colClass: "col-lg-4",
      },
      {
        label: "ไฟล์นำเสนอ PPT",
        model: "ppt_report_file  ",
        colClass: "col-lg-4",
      },
      {
        label: "ไฟล์ Poster",
        model: "poster_report_file",
        colClass: "col-lg-4",
      },

      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
      {
        label: "ไฟล์บันทึกการปฏิบัติงาน",
        model: "poster_report_file",
        colClass: "col-lg-4",
      },
      {
        label: "วันที่ตรวจรายงานผล",
        model: "send_at",
        colClass: "col-lg-4",
      },
      {
        label: "วันที่อนุมัติผลการจบสหกิจศึกษา",
        model: "send_at",
        colClass: "col-lg-4",
      },
      {
        label: "separator",
        model: "separator",
        colClass: "col-lg-12",
      },
    ]);

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      emit("close-modal");
    };

    const fetchItem = async () => {
      console.log(props);
      isLoading.value = true;
      const { data } = await ApiService.query(`form/${props.id}`, {});

      item.value = data.data;

      item.value.form_status =
        "<span class='badge p-2 text-white' style='background-color: " +
        data.data.form_status_detail.color +
        ";}'>" +
        data.data.form_status_detail.name +
        "</span>";

      item.value.send_at = useDateData().convertDate(data.data.send_at);
      item.value.semester =
        data.data.semester_detail.term + "/" + data.data.semester_detail.year;

      item.value.division_head_fullname =
        data.data.division_head_detail.prefix +
        data.data.division_head_detail.firstname +
        " " +
        data.data.division_head_detail.surname;

      item.value.faculty_head_fullname =
        data.data.division_head_detail.prefix +
        data.data.faculty_head_detail.firstname +
        " " +
        data.data.faculty_head_detail.surname;

      item.value.supervision_fullname = data.data.supervision_detail
        ? data.data.supervision_detail?.prefix +
          data.data.supervision_detail?.firstname +
          " " +
          data.data.supervision_detail?.surname
        : "-";

      item.value.company = data.data.company_detail.name;
      item.value.company_address = data.data.company_detail.name;
      item.value.full_date =
        useDateData().convertDate(data.data.start_date) +
        " - " +
        useDateData().convertDate(data.data.end_date);

      isLoading.value = false;
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );

      isLoading.value = true;

      await fetchItem();

      isLoading.value = false;
    });

    onBeforeUnmount(() => {});

    // Return
    return {
      mainModalRef,
      item,
      fields,
      fields2,
      fields3,
      fields4,
      fields5,
      isLoading,
      onClose,
      convertDate: useDateData().convertDate,
    };
  },
});
</script>

<style scoped></style>
