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
        <div class="modal-header">
          <h3 class="modal-title">รายการกรรมการ</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
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
                ดูข้อมูลโครงการ
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

            <div class="container mt-5">
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    รายการกรรมการ
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#profile"
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    เลือกกรรมการ
                  </button>
                </li>
              </ul>
              <div class="tab-content" id="myTabContent">
                <div
                  class="tab-pane fade show active card"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div class="form">
                    <div class="mb-7 col-12 col-lg-12">
                      <div class="row">
                        <div
                          class="col-md-12 table-responsive"
                        >
                          <!-- ตารางปกติสำหรับหน้าจอขนาดใหญ่ (ไม่เปลี่ยนแปลง) -->
                          <table class="table table-bordered table-striped">
                            <thead class="bg-primary">
                              <tr>
                                <th
                                  class="text-center text-white"
                                  style="width: 50px"
                                >
                                  ลำดับ
                                </th>
                                <th class="text-center text-white">
                                  ชื่อ-นามสกุล (Email)
                                </th>
                                <th
                                  class="text-center text-white"
                                  style="width: 400px"
                                >
                                  รายละเอียด
                                </th>
                                <th
                                  class="text-center text-white"
                                  style="width: 120px"
                                >
                                  สถานะ
                                </th>
                                <th
                                  class="text-center text-white"
                                  style="width: 120px"
                                >
                                  ส่งเมล
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(rv, idx) in review_items" :key="idx">
                                <td class="text-center">{{ idx + 1 }}</td>
                                <td>
                                  {{ rv.reviewer_id?.fullname }}
                                </td>
                                <td class="text-center">
                                  {{ rv.detail }}
                                </td>
                                <td class="text-center">
                                  <span
                                    class="badge p-2 text-white"
                                    :style="`background-color: ${rv.review_status_label?.bg_color};`"
                                  >
                                    {{ rv.review_status_label?.name_th }}</span
                                  >
                                </td>
                                <td class="text-center">
                                  <button
                                    class="btn btn-success btn-icon"
                                    :class="[
                                      rv.review_status == 1 ? '' : 'disabled',
                                    ]"
                                    v-if="rv.reviewer_id != null"
                                    @click="onSendMail(rv)"
                                  >
                                    <i class="fa fa-envelope"></i>
                                    <span class="ms-1">
                                      {{ rv.time_no_send_mail }}
                                    </span>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mx-auto text-center mt-5 mb-5">
                    <button
                      @click="onClose({ reload: false })"
                      type="button"
                      class="btn btn-danger me-2"
                    >
                      ปิด
                    </button>
                  </div>
                </div>
                <div
                  class="card tab-pane fade"
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <div class="form">
                    <div class="mb-7 col-12 col-lg-12">
                      <div class="row">
                        <div class="col-md-12 table-responsive">
                          <table class="table table-bordered table-striped">
                            <thead class="bg-primary">
                              <tr>
                                <th
                                  class="text-center text-white"
                                  style="width: 50px"
                                >
                                  ลำดับ
                                </th>
                                <th class="text-center text-white">
                                  ชื่อ-นามสกุล (Email)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(rv, idx) in review_items" :key="idx">
                                <td class="text-center">{{ idx + 1 }}</td>
                                <td>
                                  <v-select
                                    label="fullname"
                                    name="id"
                                    placeholder="เลือกกรรมการ"
                                    :options="selectOptions.reviewers"
                                    class="form-control"
                                    :clearable="true"
                                    v-model="rv.reviewer_id"
                                  >
                                  </v-select>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mx-auto text-center mt-5 mb-5">
                    <button
                      @click="onClose({ reload: false })"
                      type="button"
                      class="btn btn-danger me-2"
                    >
                      ปิด
                    </button>
                    <button
                      @click="onSubmit"
                      type="button"
                      class="btn btn-success"
                    >
                      ยืนยัน
                    </button>
                  </div>

                  <div class="mt-5 mb-5">
                    <button
                      class="btn btn-info ms-2"
                      type="button"
                      @click="openAddReviewerModal = true"
                    >
                      ไม่พบตัวเลือกกรรมการ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Preloader :isLoading="isLoading" :position="'absolute'" />
      </div>
    </div>

    <div>
      <AddReviewerPage
        :paper_id="item.id"
        v-if="openAddReviewerModal"
        @reload="onReLoadReviewer"
        @close-modal="openAddReviewerModal = false"
      ></AddReviewerPage>
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
// Import Modal Bootstrap
import { Modal } from "bootstrap";
import ApiService from "@/core/services/ApiService";
// Use Toast Composables
import useToast from "@/composables/useToast";
import { useRouter } from "vue-router";
import _ from "lodash";

// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Use Composables
import Preloader from "@/components/preloader/Preloader.vue";
import useDateData from "@/composables/useDateData";
import useReviewStatusData from "@/composables/useReviewStatusData";

// Import Component
import DetailPage from "@/views/admin-paper/Detail.vue";
import AddReviewerPage from "@/views/reviewer/Add.vue";

export default defineComponent({
  name: "reject-paper-modal",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    Preloader,
    DetailPage,
    vSelect,
    AddReviewerPage,
  },
  setup(props, { emit }) {
    // UI
    const isLoading = ref<any>(true);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);
    const router = useRouter();
    const openAddReviewerModal = ref(false);

    // Variable
    const { item } = toRefs(props);
    const selectOptions = ref<any>({
      reviewers: [],
      review_statuses: useReviewStatusData().statuses,
    });
    const review_default = {
      id: null,
      detail: null,
      review_status: 1,
      paper_id: item.value.id,
      reviewer_id: null,
      is_send_mail: 0,
      time_no_send_mail: 0,
    };
    const review_items = reactive<any>([
      {
        ...review_default,
      },
      {
        ...review_default,
      },
      {
        ...review_default,
      },
    ] as any[]);

    const review_items_old = reactive<any>([
      {
        ...review_default,
      },
    ] as any[]);

    //Fetch
    const fetchReviewers = async () => {
      try {
        const { data } = await ApiService.query("reviewer/", {});
        selectOptions.value.reviewers = data.data.map((x: any) => {
          x.fullname = `${x.fullname} (${x.email})`;
          return x;
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchReview = async () => {
      try {
        const { data } = await ApiService.query("review/", {
          params: { paper_id: item.value.id },
        });

        review_items.length = 0;
        review_items_old.length = 0;

        let new_data = data.data.map((x: any) => {
          let reviewer_id = {
            id: x.reviewer_id,
            fullname:
              x.reviewer.prefix_name +
              x.reviewer.firstname +
              " " +
              x.reviewer.surname +
              " (" +
              x.reviewer.email +
              ")",
          };
          x.reviewer_id = reviewer_id;

          x.review_status_label = selectOptions.value.review_statuses.find(
            (e: any) => {
              return e.id == x.review_status;
            }
          );
          return x;
        });

        Object.assign(review_items, _.cloneDeep(new_data));

        Object.assign(review_items_old, _.cloneDeep(new_data));

        if (review_items.length < 3) {
          for (let index = review_items.length; index < 3; index++) {
            review_items.push({
              ...review_default,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

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
      for (let i = 0; i < review_items.length; i++) {
        if (review_items[i].reviewer_id?.id) {
          let data_item: any = {
            id: review_items[i].id,
            review_status: review_items[i].review_status,
            reviewer_id: review_items[i].reviewer_id.id,
            is_send_mail: review_items[i].is_send_mail,
            time_no_send_mail: review_items[i].time_no_send_mail,
            paper_id: item.value.id,
          };

          let api = {
            type: "post",
            url: "review/",
          };

          if (data_item.id != null) {
            api.type = "put";
            api.url = "review/" + data_item.id;
          }

          await ApiService[api.type](api.url, data_item)
            .then(({ data }) => {
              if (data.msg != "success") {
                throw new Error("ERROR");
              }
            })
            .catch(({ response }) => {
              isLoading.value = false;
              console.log(response);
            });
        }
      }

      for (let i = 0; i < review_items_old.length; i++) {
        let check = review_items.find((x: any) => {
          return (
            x.id == review_items_old[i].id &&
            x.reviewer_id?.id == review_items_old[i].reviewer_id?.id
          );
        });

        if (!check) {
          await ApiService.delete("review/" + review_items_old[i].id)
            .then(({ data }) => {
              if (data.msg != "success") {
                throw new Error("ERROR");
              }
            })
            .catch(({ response }) => {
              console.log(response);
            });
        }
      }

      await fetchReview();

      isLoading.value = false;
      useToast("บันทึกข้อมูลเสร็จสิ้น");
    };

    const onSendMail = async (rv: any) => {
      isLoading.value = true;
      await ApiService.put("review/send-mail/" + rv.id, {
        time_no_send_mail: rv.time_no_send_mail + 1,
      })
        .then(async ({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          await fetchReview();

          isLoading.value = false;
          useToast("ส่งอีเมลเสร็จสิ้น");
        })
        .catch(({ response }) => {
          isLoading.value = false;
          console.log(response);
        });
    };

    // const onSubmit = async () => {
    //   isLoading.value = true;
    //   let data_item: any = {
    //     detail: reject_item.detail,
    //     paper_id: item.value.id,
    //     return_status: 1,
    //   };

    //   await ApiService.post("return-paper/", data_item)
    //     .then(({ data }) => {
    //       if (data.msg != "success") {
    //         throw new Error("ERROR");
    //       }
    //     })
    //     .catch(({ response }) => {
    //       isLoading.value = false;
    //       console.log(response);
    //     });

    //   await ApiService.put("paper/" + item.value.id, {
    //     status_id: 3,
    //   })
    //     .then(({ data }) => {
    //       if (data.msg != "success") {
    //         throw new Error("ERROR");
    //       }
    //       isLoading.value = false;
    //       onClose({ reload: true });
    //       useToast("บันทึกข้อมูลเสร็จสิ้น");
    //       router.push({ name: "admin-paper" });
    //     })
    //     .catch(({ response }) => {
    //       isLoading.value = false;
    //       console.log(response);
    //     });
    // };

    // Mounted

    const onReLoadReviewer = async () => {
      await fetchReviewers();
    };

    onMounted(async () => {
      await fetchReviewers();
      await fetchReview();
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
      onClose,
      onSubmit,
      review_items,
      selectOptions,
      openAddReviewerModal,
      onReLoadReviewer,
      onSendMail,
    };
  },
});
</script>

<style scoped>
.separator.separator-dotted {
  border-bottom-color: #ccc;
}

.w-10 {
  max-width: 10%;
}

.w-60 {
  min-width: 60%;
}
</style>
