<template>
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
          <h3 class="modal-title">ข้อมูลส่วนตัว</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading">
          <div>
            <div class="card" v-if="item.id != null">
              <div class="card-body">
                <form-wizard
                  color="#ffc600"
                  ref="formStep"
                  finishButtonText="บันทึก"
                  backButtonText="ย้อนกลับ"
                  nextButtonText="ถัดไป"
                  step-size="xs"
                  id="form"
                  @on-change="onTabChange"
                >
                  <!-- @on-complete="onComplete" -->
                  <Tab1 :item="item" @on-next="onTabChange" v-if="item" />

                  <!-- <Tab2 :item="item" :budget="budget" :errors="errors" /> -->
                  <!-- 
                  <Tab3 :tab_index="tab_index" :item="item" :budget="budget" /> -->

                  <template #footer="props">
                    <div class="wizard-footer-left">
                      <button
                        v-if="props.activeTabIndex > 0"
                        @click.native="props.prevTab()"
                        class="btn btn-danger text-white float-left"
                        :disabled="isLoading"
                      >
                        ย้อนกลับ
                      </button>
                    </div>

                    <div class="wizard-footer-right">
                      <!-- <button
                        v-if="!props.isLastStep"
                        @click.native="props.nextTab()"
                        class="btn btn-primary text-white"
                        :disabled="isLoading"
                      >
                        ถัดไป
                      </button> -->

                      <!-- <button
                        v-else
                        @click.native="onComplete(0)"
                        class="btn btn-primary text-white"
                        :disabled="isLoading"
                      >
                        {{ props.isLastStep ? "บันทึก" : "Next" }}
                      </button> -->

                      <!-- @click.native="onComplete(1)" -->
                      <!-- <button
                        v-if="props.isLastStep"
                        class="finish-button btn text-white ms-4"
                        style="background-color: green"
                        :disabled="isLoading"
                      >
                        {{ "ส่งข้อมูล" }}
                      </button> -->
                    </div>
                  </template>
                </form-wizard>
              </div>
              <Preloader
                :isLoading="isLoading != undefined ? isLoading : false"
                :position="'fix'"
              />
            </div>
          </div>
        </div>
        <Preloader :isLoading="isLoading" :position="'absolute'" />
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
  onUnmounted,
  toRefs,
} from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter, useRoute } from "vue-router";
// Import Modal Bootstrap
import { Modal } from "bootstrap";

// Import FormWizard
import { FormWizard } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";

// Use Toast Composables
import useToast from "@/composables/useToast";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(buddhistEra);
dayjs.extend(customParseFormat);

// Import Component
import Preloader from "@/components/preloader/Preloader.vue";
import Tab1 from "@/components/form/form/Tab1Add.vue";
import Tab2 from "@/components/form/form/Tab2.vue";
import Tab3 from "@/components/form/form/Tab3.vue";

// Import Yup Validate
import * as Yup from "yup";

export default defineComponent({
  name: "edit-profile-student",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  components: {
    FormWizard,
    Preloader,
    Tab1,
    Tab2,
    Tab3,
  },
  setup(props, { emit }) {
    // UI Variable
    const isLoading = ref<any>(false);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);
    const tab_index = ref(0);
    const onTabChange = (prevIndex: number, nextIndex: number) => {
      tab_index.value = nextIndex;
    };

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const item = reactive<any>({});
    const document_items = reactive<any>([] as any[]);
    const document_templates = reactive<any>([] as any[]);

    //Fetch Data
    const fetchItem = async () => {
      try {
        const { data } = await ApiService.query(
          `student-profile/${props.id}`,
          {}
        );
        const {
          faculty_id,
          division_id,
          department_id,
          status_id,
          advisor_id,
          faculty_detail,
          department_detail,
          division_detail,
          advisor_detail,
          status_detail,
        } = data.data;

        Object.assign(item, {
          ...data.data,
          faculty_id: faculty_id
            ? { id: faculty_id, name: faculty_detail.name }
            : null,
          department_id: department_id
            ? { id: department_id, name: department_detail.name }
            : null,
          division_id: division_id
            ? { id: division_id, name: division_detail.name }
            : null,
          advisor_id: advisor_id
            ? {
                id: advisor_id,
                name:
                  advisor_detail.prefix +
                  advisor_detail.firstname +
                  advisor_detail.surname,
              }
            : null,
          status_id: status_id
            ? { id: status_id, name: status_detail.name }
            : null,
          faculty_name: faculty_detail.name,
          division_name: division_detail.name,
        });

        console.log(item.advisor_id)
      } catch (error) {
        console.log(error);
      }
    };

    // Submit Event
    // const onComplete = (type= 1) = {
    //     console.log(type)
    // };

    const onSubmit = async () => {
      let data_item: any = {
        title_th: item.title_th,
        title_en: item.title_en,
        abstract: item.abstract,
        keyword: item.keyword,
        department_id: item.department_id?.id,
        paper_type_id: item.paper_type_id?.id,
        paper_kind_id: item.paper_kind_id?.id,
        history: item.history,
        objective: item.objective,
        scope: item.scope,
        review_literature: item.review_literature,
        method: item.method,
        benefit: item.benefit,
        location: item.location,
        references: item.references,
        user_id: userData.id,
      };

      await ApiService.put("student-profile/" + item.id, data_item)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }

          item.id = data.id;
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    // UI Event
    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );
      await fetchItem();
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

    // Watch

    return {
      // errors
      mainModalRef,
      isLoading,
      tab_index,
      item,
      // event
      onTabChange,
      //   onComplete,
      onClose,
    };
  },
});
</script>

<style>
.vs--searchable .vs__dropdown-toggle {
  border: none;
}
</style>
