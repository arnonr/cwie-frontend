<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="main-modal"
    aria-hidden="true"
    style="background-color: rgba(128, 128, 128, 0.8)"
  >
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">แบบฟอร์มเพิ่มข้อมูลกรรมการ</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading">
          <div class="form row">
            <div class="mb-7 col-12 col-lg-12">
              <label for="prefix_name" class="required form-label"
                >คำนำหน้า</label
              >
              <input
                type="text"
                class="form-control"
                :placeholder="`คำนำหน้า`"
                :aria-label="`คำนำหน้า`"
                v-model="item.prefix_name"
              />
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="firstname" class="required form-label">ชื่อ</label>
              <input
                type="text"
                class="form-control"
                :placeholder="`ชื่อ`"
                :aria-label="`ชื่อ`"
                v-model="item.firstname"
              />
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="surname" class="required form-label">นามสกุล</label>
              <input
                type="text"
                class="form-control"
                :placeholder="`นามสกุล`"
                :aria-label="`นามสกุล`"
                v-model="item.surname"
              />
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="organization_name" class="required form-label"
                >หน่วยงาน</label
              >
              <input
                type="text"
                class="form-control"
                :placeholder="`หน่วยงาน`"
                :aria-label="`หน่วยงาน`"
                v-model="item.organization_name"
              />
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="email" class="required form-label">อีเมล</label>
              <input
                type="text"
                class="form-control"
                :placeholder="`email`"
                :aria-label="`email`"
                v-model="item.email"
              />
            </div>
          </div>
          <div class="row">
            <div class="mx-auto text-center mt-5">
              <button
                @click="onClose({ reload: false })"
                type="button"
                class="btn btn-danger me-2"
              >
                ปิด
              </button>
              <button @click="onSubmit" type="button" class="btn btn-success">
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
        <Preloader :isLoading="isLoading" :position="'absolute'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

// Use Composables
import Preloader from "@/components/preloader/Preloader.vue";
// Import Component

export default defineComponent({
  name: "paper-detail-modal",
  props: {
    paper_id: {
      type: Number,
      required: true,
    },
  },
  components: {
    dayjs,
    Preloader,
  },
  setup(props, { emit }) {
    // UI
    const isLoading = ref<any>(true);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    // Variable
    const selectOptions = ref({});

    const item = reactive<any>({});

    // Event
    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    const onSubmit = async () => {
      await ApiService.post("reviewer/", item)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }

          onClose({ reload: true });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );

      isLoading.value = false;
    });

    onUnmounted(() => {
      if (mainModalRef.value) {
        mainModalRef.value.addEventListener("hidden.bs.modal", () =>
          onClose({ reload: false })
        );
      }
      mainModalObj.value.hide();
      emit("close-modal");
    });
    // Return
    return {
      isLoading,
      mainModalRef,
      item,
      onClose,
      onSubmit,
    };
  },
});
</script>

<style scoped>
/* @import "https://fonts.googleapis.com/css2?family=Sarabun&display=swap"; */
.generate-pdf {
  font-family: Sarabun, sans-serif;
}

.separator.separator-dotted {
  border-bottom-color: #ccc;
}
</style>

<style>
.generate-pdf {
  padding: 0mm 10mm 0mm 10mm;
}

.html2pdf__page-break {
  page-break-before: always; /* บังคับให้เริ่มหน้าใหม่ */
  height: 0; /* ซ่อนเส้นแบ่งหน้า */
}
</style>
