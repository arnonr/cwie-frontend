<template>
  <div class="modal fade" tabindex="-1" ref="mainModalRef" id="main-modal">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">รายละเอียด</h3>
          <button
            @click="onClose"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="container" v-if="item">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12 mb-5">
                    <h4 class="color-primary">สถานะผู้ใช้งาน</h4>
                  </div>
                  <div class="col-md-12">
                    <span> สถานะปัจจุบัน : </span>
                    <span
                      class="badge p-2 text-white fw-bold"
                      :class="['bg-' + showStatus(item.status).color]"
                      >{{ showStatus(item.status).name }}</span
                    >
                    <div class="separator separator-dotted my-2"></div>
                  </div>

                  <div class="col-md-12 mb-5 mt-5">
                    <h4 class="color-primary">ข้อมูลผู้ใช้งาน</h4>
                  </div>

                  <div class="col-md-12">
                    <span>ชื่อ-นามสกุล : </span>
                    <span class="fst-italic">
                      {{
                        item.prefix_name?.name_th +
                        item.firstname +
                        " " +
                        item.lastname
                      }}</span
                    >
                    <div class="separator separator-dotted my-2"></div>
                  </div>

                  <div class="col-md-6">
                    <span>รหัสเจ้าหน้าที่ : </span>
                    <span class="fst-italic">{{ item.officer_code }}</span>
                    <div class="separator separator-dotted my-2"></div>
                  </div>

                  <div class="col-md-6">
                    <span>เลขบัตรประจำตัวประชาชน : </span>
                    <span class="fst-italic">{{ item.id_card }}</span>
                    <div class="separator separator-dotted my-2"></div>
                  </div>

                  <div class="col-md-6">
                    <span>วันเกิด : </span>
                    <span class="fst-italic">
                      {{ showDate(item.birthday) }}
                    </span>
                    <div class="separator separator-dotted my-2"></div>
                  </div>
                  <div class="col-md-6">
                    <span>หมายเลขโทรศัพท์ : </span>
                    <span class="fst-italic">{{ item.phone_number }}</span>
                    <div class="separator separator-dotted my-2"></div>
                  </div>

                  <div class="col-md-6">
                    <span>อีเมล : </span>
                    <span class="fst-italic">{{ item.email }}</span>
                    <div class="separator separator-dotted my-2"></div>
                  </div>

                  <div class="col-md-6">
                    <span>Line ID : </span>
                    <span class="fst-italic">
                      {{ item.line_id }}
                    </span>
                    <div class="separator separator-dotted my-2"></div>
                  </div>

                  <div class="col-md-12">
                    <span>หน่วยงาน : </span>
                    <span class="fst-italic">{{ showOrganization(item) }}</span>
                    <div class="separator separator-dotted my-2"></div>
                  </div>

                  <div class="col-md-6">
                    <span>ตำแหน่ง : </span>
                    <span class="fst-italic">
                      {{ item.position?.name_th }}</span
                    >
                    <div class="separator separator-dotted my-2"></div>
                  </div>
                  <div class="col-md-6">
                    <span>สายงาน : </span>
                    <span class="fst-italic"> {{ item.section?.name_th }}</span>
                    <div class="separator separator-dotted my-2"></div>
                  </div>
                  <div class="col-md-12">
                    <span>สิทธิผู้ใช้งาน : </span>
                    <span class="fst-italic"> {{ item.role?.name_th }}</span>
                    <div class="separator separator-dotted my-2"></div>
                  </div>

                  <div class="col-md-12">
                    <span>ไฟล์บัตรข้าราชการ : </span>
                    <img
                      v-if="item.file_attach"
                      :src="item.file_attach"
                      class="mt-5 w-100 w-md-50"
                    />
                    <div class="separator separator-dotted my-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
import ApiService from "@/core/services/ApiService";

// Import route
import { useRoute } from "vue-router";

// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

// Use Composables
import useBasicData from "@/composables/useBasicData";

export default defineComponent({
  name: "detail-user",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  components: {
    dayjs,
  },
  setup(props, context) {
    // Variable
    const emit = context.emit;
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    const selectOptions = ref({
      // complaint_channels: <any>[],
      user_statuses: useBasicData().user_statuses,
    });

    const item = reactive<any>({});

    // Fetch
    const fetchUser = async () => {
      try {
        const { data } = await ApiService.query("user/" + props.id, {});

        Object.assign(item, data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const new_item = reactive<any>({
      organization_all: [],
    });

    //Event
    const onClose = () => {
      mainModalObj.value.hide();
      emit("close-modal");
    };

    // Mounted
    onMounted(async () => {
      await fetchUser();
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
    });

    onUnmounted(() => {
      mainModalObj.value.hide();
      emit("close-modal");
    });

    // Watch

    const showOrganization = (ac: any) => {
      let og = "";

      if (ac.agency != null) {
        og = og + ac.agency.name_th + " > ";
      }

      if (item.division != null) {
        og = og + ac.division.name_th + " > ";
      }

      if (item.bureau != null) {
        og = og + ac.bureau.name_th;
      }
      return og;
    };

    const showDate = (date: any) => {
      if (date == null) {
        return "";
      }
      return dayjs(date).locale("th").format("DD MMM BBBB");
    };

    const showStatus = (status: any) => {
      if (status == undefined) {
        return {
          id: null,
          color: "",
          name: "",
        };
      }
      let find_status = selectOptions.value.user_statuses.find((x: any) => {
        return x.id == status;
      });
      return find_status;
    };

    // Return
    return {
      item,
      new_item,
      selectOptions,
      showOrganization,
      showDate,
      showStatus,
      onClose,
      mainModalRef,
    };
  },
});
</script>

<style>
@media only screen and (max-width: 768px) {
  .card > .card-body {
    padding: 0px;
  }
}

.color-primary {
  color: #800001;
}
</style>
