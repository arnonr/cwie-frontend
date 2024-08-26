<template>
  <div>
    <div class="row">
      <div class="mb-7 col-12 col-lg-12 text-end">
        <button
          class="btn btn-primary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-collapseOne"
          aria-expanded="false"
          aria-controls="flush-collapseOne"
        >
          ดูข้อมูล
        </button>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <div class="accordion accordion-flush" id="accordionFlushExample">
          <div class="accordion-item">
            <div
              id="flush-collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body" style="padding: 0">
                <DetailPage v-if="item.id" :paper_id="item.id" />
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="form">
        <div class="mb-7 col-12 col-lg-12">
          <label for="" class="form-label">หมายเหตุ</label>
          <textarea
            v-model="reject_item.detail"
            rows="10"
            type="text"
            class="form-control"
            placeholder=""
            aria-label=""
          />
        </div>
      </div>

      <div class="mx-auto text-center mt-5">
        <button
          @click="onClose({ reload: false })"
          type="button"
          class="btn btn-danger me-2"
        >
          ยกเลิก
        </button>
        <button @click="onSubmit" type="button" class="btn btn-success">
          ยืนยัน
        </button>
      </div>
    </div>
    <Preloader :isLoading="isLoading" :position="'absolute'" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onUnmounted,
  toRefs,
} from "vue";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
import ApiService from "@/core/services/ApiService";
// Use Toast Composables
import useToast from "@/composables/useToast";
import { useRouter } from "vue-router";

// Use Composables
import Preloader from "@/components/preloader/Preloader.vue";
import useDateData from "@/composables/useDateData";

// Import Component
import DetailPage from "@/views/admin-paper/Detail.vue";

export default defineComponent({
  name: "reject-paper-modal",
  components: {
    Preloader,
    DetailPage,
  },
  setup(props, { emit }) {
    // UI
    const isLoading = ref<any>(true);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);
    const router = useRouter();

    // Variable
    const item = reactive<any>({});

    const reject_item = reactive<any>({});

    //Fetch

    // Event
    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    const onSubmit = async () => {
      isLoading.value = true;
      let data_item: any = {
        detail: reject_item.detail,
        paper_id: item.value.id,
        return_status: 1,
      };

      await ApiService.post("return-paper/", data_item)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
        })
        .catch(({ response }) => {
          isLoading.value = false;
          console.log(response);
        });

      await ApiService.put("paper/" + item.value.id, {
        status_id: 3,
      })
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          isLoading.value = false;
          onClose({ reload: true });
          useToast("บันทึกข้อมูลเสร็จสิ้น");
          router.push({ name: "admin-paper" });
        })
        .catch(({ response }) => {
          isLoading.value = false;
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
      convertDate: useDateData().convertDate,
      item,
      reject_item,
      onClose,
      onSubmit,
    };
  },
});
</script>

<style scoped>
.separator.separator-dotted {
  border-bottom-color: #ccc;
}
</style>
