<template>
  <tab-content :title="`ลำดับที่ 2`" :before-change="onTab2Validate">
    <div class="row">
      <div class="col-12 mb-7">
        <h6>คณะผู้วิจัย</h6>

        <div class="p-3 border border-dark-subtle rounded">
          <div
            class="row"
            :class="[idx == 0 ? '' : ' mt-7']"
            v-if="researcher"
            style="margin: 0.03rem"
            v-for="(rs, idx) in researcher"
            :key="'researcher' + idx"
          >
            <div class="">
              <h6>ลำดับที่ {{ idx + 1 }}</h6>
            </div>
            <div class="mb-3 col-12 col-lg-2">
              <label for="prefix_name" class="form-label">คำนำหน้า</label>
              <input
                type="text"
                class="form-control"
                v-model="rs.prefix_name"
              />
            </div>
            <div class="mb-3 col-12 col-lg-5">
              <label for="firstname" class="form-label">ชื่อ</label>
              <input type="text" class="form-control" v-model="rs.firstname" />
            </div>
            <div class="mb-3 col-12 col-lg-5">
              <label for="surname" class="form-label">นามสกุล</label>
              <input type="text" class="form-control" v-model="rs.surname" />
            </div>
            <div class="mb-7 col-12 col-lg-6">
              <label for="department_id" class="form-label">หน่วยงาน</label>
              <v-select
                name="department_id"
                label="name"
                placeholder="หน่วยงาน"
                :options="selectOptions.departments"
                class="form-control"
                :clearable="false"
                v-model="rs.department_id"
              >
              </v-select>
            </div>
            <div class="mb-7 col-12 col-lg-6">
              <label for="department_text" class="form-label"
                >กรณีหน่วยงานอื่นๆ โปรดระบุ</label
              >
              <input
                type="text"
                class="form-control"
                v-model="rs.department_text"
              />
              <div
                class="d-block mt-1"
                v-if="researcher_errors.department_text.error == 1"
              >
                <span role="alert" class="text-danger">{{
                  researcher_errors.department_text.text
                }}</span>
              </div>
            </div>
            <div class="mb-7 col-12 col-lg-6">
              <label for="phone_number" class="form-label">เบอร์โทรศัพท์</label>
              <input
                type="text"
                class="form-control"
                v-model="rs.phone_number"
              />
              <div
                class="d-block mt-1"
                v-if="researcher_errors.phone_number.error == 1"
              >
                <span role="alert" class="text-danger">{{
                  researcher_errors.phone_number.text
                }}</span>
              </div>
            </div>
            <div class="mb-7 col-12 col-lg-6">
              <label for="expertise" class="form-label"
                >ความชำนาญ/ความสนใจพิเศษ</label
              >
              <input type="text" class="form-control" v-model="rs.expertise" />
              <div
                class="d-block mt-1"
                v-if="researcher_errors.expertise.error == 1"
              >
                <span role="alert" class="text-danger">{{
                  researcher_errors.expertise.text
                }}</span>
              </div>
            </div>
            <div class="mb-7 col-12 col-lg-6">
              <label for="research_type" class="required form-label"
                >ประเภท</label
              >
              <v-select
                name="research_type"
                label="name"
                placeholder="ประเภท"
                :options="selectOptions.researcher_types"
                class="form-control"
                :clearable="false"
                v-model="rs.researcher_type_id"
              >
              </v-select>
              <div
                class="d-block mt-1"
                v-if="researcher_errors.researcher_type_id.error == 1"
              >
                <span role="alert" class="text-danger">{{
                  researcher_errors.researcher_type_id.text
                }}</span>
              </div>
            </div>
            <div class="mb-7 col-12 col-lg-4">
              <label for="percentage" class="form-label">สัดส่วน (%)</label>
              <input type="text" class="form-control" v-model="rs.percentage" />
              <div
                class="d-block mt-1"
                v-if="researcher_errors.percentage.error == 1"
              >
                <span role="alert" class="text-danger">{{
                  researcher_errors.percentage.text
                }}</span>
              </div>
            </div>

            <div class="mb-1 col-12 col-md-2">
              <button
                class="btn btn-danger mt-7 w-100"
                @click="onDecreaseResearcher(idx)"
              >
                <i class="fa fa-close"></i>
                <span>ลบ</span>
              </button>
            </div>
            <hr />
          </div>
        </div>

        <div class="mt-3">
          <a @click="onIncreaseResearcher" class="cursor-pointer"
            ><span>+ เพิ่ม</span></a
          >
        </div>
      </div>

      <div class="col-12 mb-7">
        <hr class="dotted" />

        <h6>
          ขั้นตอนและระยะเวลาของแผนดำเนินงานโดยละเอียด
          รวมทั้งแผนภูมิแสดงระยะเวลาในการดำเนินงาน (Phasing Chart)
          ภายในระยะเวลาที่ใช้ในการวิจัย
        </h6>

        <div class="p-3 border border-dark-subtle rounded">
          <div
            class="row"
            :class="[idx == 0 ? '' : ' mt-7']"
            v-if="method_list"
            style="margin: 0.03rem"
            v-for="(ml, idx) in method_list"
            :key="'method' + idx"
          >
            <div class="">
              <h6>ลำดับที่ {{ idx + 1 }}</h6>
            </div>

            <div class="mb-3 col-12 col-lg-6">
              <label for="method_start_date" class="form-label"
                >วันที่เริ่ม</label
              >
              <VueDatePicker
                v-model="ml.start_date"
                :enable-time-picker="false"
                placeholder="วันเดือนปี"
                :locale="'th'"
                auto-apply
                class="form-control"
                :format="format"
              >
                <template #year-overlay-value="{ text }">
                  {{ parseInt(text) + 543 }}
                </template>

                <template #year="{ value }">
                  {{ value + 543 }}
                </template>
              </VueDatePicker>
              <div
                class="d-block mt-1"
                v-if="method_list_errors.start_date == 1"
              >
                <span role="alert" class="text-danger">{{
                  method_list_errors.start_date.text
                }}</span>
              </div>
            </div>

            <div class="mb-3 col-12 col-lg-6">
              <label for="method_end_date" class="form-label"
                >วันที่สิ้นสุด</label
              >
              <VueDatePicker
                v-model="ml.end_date"
                :enable-time-picker="false"
                placeholder="วันเดือนปี"
                :locale="'th'"
                auto-apply
                class="form-control"
                :format="format"
              >
                <template #year-overlay-value="{ text }">
                  {{ parseInt(text) + 543 }}
                </template>

                <template #year="{ value }">
                  {{ value + 543 }}
                </template>
              </VueDatePicker>
              <div class="d-block mt-1" v-if="method_list_errors.end_date == 1">
                <span role="alert" class="text-danger">{{
                  method_list_errors.end_date.text
                }}</span>
              </div>
            </div>

            <div class="mb-3 col-12 col-lg-10">
              <label for="method_detail" class="form-label">รายละเอียด</label>
              <input type="text" class="form-control" v-model="ml.detail" />
              <div
                class="d-block mt-1"
                v-if="method_list_errors.detail.error == 1"
              >
                <span role="alert" class="text-danger">{{
                  method_list_errors.detail.text
                }}</span>
              </div>
            </div>

            <div class="mb-1 col-12 col-md-2">
              <button
                class="btn btn-danger mt-7 w-100"
                @click="onDecreaseMethodList(idx)"
              >
                <i class="fa fa-close"></i>
                <span>ลบ </span>
              </button>
            </div>
            <hr />
          </div>
        </div>

        <div class="mt-3">
          <a @click="onIncreaseMethodList" class="cursor-pointer"
            ><span>+ เพิ่ม</span></a
          >
        </div>
      </div>

      <div class="col-12 mb-7">
        <hr class="dotted" />
        <h3>
          งบประมาณในการดำเนินงานวิจัย โดยระบุ
          รายละเอียดของงบประมาณค่าใช้จ่ายในรายการดังต่อไปนี้
        </h3>

        <h6>
          หมวดค่าตอบแทน เฉพาะค่าจ้างผู้ช่วยวิจัย ไม่เกินเดือนละ 3000 บาท
          (ไม่เกิน 6 เดือน)
        </h6>

        <div class="p-3 border border-dark-subtle rounded">
          <div
            class="row"
            :class="[idx == 0 ? '' : ' mt-7']"
            v-if="budget"
            style="margin: 0.03rem"
            v-for="(bg, idx) in budget"
            :key="'budget1' + idx"
          >
            <div class="">
              <h4>ลำดับที่ {{ idx + 1 }}</h4>
            </div>
            <div class="mb-3 col-12 col-lg-8">
              <label for="budget_detail" class="form-label"> รายละเอียด</label>
              <input
                type="text"
                class="form-control"
                placeholder="รายละเอียด"
                aria-label="รายละเอียด"
                v-model="bg.detail"
              />
              <div class="d-block mt-1" v-if="budget_errors.detail.error == 1">
                <span role="alert" class="text-danger">{{
                  budget_errors.detail.text
                }}</span>
              </div>
            </div>
            <div class="mb-3 col-12 col-lg-2">
              <label for="amount" class="form-label">จำนวนเงิน</label>
              <input
                type="text"
                class="form-control"
                placeholder="จำนวนเงิน"
                aria-label="จำนวนเงิน"
                v-model="bg.amount"
              />
              <div class="d-block mt-1" v-if="budget_errors.amount.error == 1">
                <span role="alert" class="text-danger">{{
                  budget_errors.amount.text
                }}</span>
              </div>
            </div>
            <div class="mb-1 col-12 col-md-2">
              <button
                class="btn btn-danger mt-7 w-100"
                @click="onDecreaseBudget(1, idx)"
              >
                <i class="fa fa-close"></i>
                <span>ลบ</span>
              </button>
            </div>
            <hr />
          </div>
        </div>

        <div class="mt-3">
          <a @click="onIncreaseBudget(1)" class="cursor-pointer"
            ><span>+ เพิ่ม</span></a
          >
        </div>

        <!-- budget 2 -->
        <h6 class="mt-6">
          หมวดค่าใช้สอย เช่น ค่าพาหนะ ค่าจ้างเหมาต่าง ๆ เช่น ค่าจัดทำรูปเล่ม
        </h6>

        <div class="p-3 border border-dark-subtle rounded">
          <div
            class="row"
            :class="[idx == 0 ? '' : ' mt-7']"
            v-if="budget2"
            style="margin: 0.03rem"
            v-for="(bg, idx) in budget2"
            :key="'budget2' + idx"
          >
            <div class="">
              <h4>ลำดับที่ {{ idx + 1 }}</h4>
            </div>
            <div class="mb-3 col-12 col-lg-8">
              <label for="budget_detail" class="form-label"> รายละเอียด</label>
              <input
                type="text"
                class="form-control"
                placeholder="รายละเอียด"
                aria-label="รายละเอียด"
                v-model="bg.detail"
              />
              <div class="d-block mt-1" v-if="budget_errors.detail.error == 1">
                <span role="alert" class="text-danger">{{
                  budget_errors.detail.text
                }}</span>
              </div>
            </div>
            <div class="mb-3 col-12 col-lg-2">
              <label for="amount" class="form-label">จำนวนเงิน</label>
              <input
                type="text"
                class="form-control"
                placeholder="จำนวนเงิน"
                aria-label="จำนวนเงิน"
                v-model="bg.amount"
              />
              <div class="d-block mt-1" v-if="budget_errors.amount.error == 1">
                <span role="alert" class="text-danger">{{
                  budget_errors.amount.text
                }}</span>
              </div>
            </div>
            <div class="mb-1 col-12 col-md-2">
              <button
                class="btn btn-danger mt-7 w-100"
                @click="onDecreaseBudget(2, idx)"
              >
                <i class="fa fa-close"></i>
                <span>ลบ</span>
              </button>
            </div>
            <hr />
          </div>
        </div>

        <div class="mt-3">
          <a @click="onIncreaseBudget(2)" class="cursor-pointer"
            ><span>+ เพิ่ม</span></a
          >
        </div>

        <!-- budget 3 -->
        <h6 class="mt-6">
          หมวดค่าวัสดุ (แจกแจงรายละเอียดราคาต่อหน่วยอย่างชัดเจน)
        </h6>

        <div class="p-3 border border-dark-subtle rounded">
          <div
            class="row"
            :class="[idx == 0 ? '' : ' mt-7']"
            v-if="budget3"
            style="margin: 0.03rem"
            v-for="(bg, idx) in budget3"
            :key="'budget3' + idx"
          >
            <div class="">
              <h4>ลำดับที่ {{ idx + 1 }}</h4>
            </div>
            <div class="mb-3 col-12 col-lg-8">
              <label for="budget_detail" class="form-label"> รายละเอียด</label>
              <input
                type="text"
                class="form-control"
                placeholder="รายละเอียด"
                aria-label="รายละเอียด"
                v-model="bg.detail"
              />
              <div class="d-block mt-1" v-if="budget_errors.detail.error == 1">
                <span role="alert" class="text-danger">{{
                  budget_errors.detail.text
                }}</span>
              </div>
            </div>
            <div class="mb-3 col-12 col-lg-2">
              <label for="amount" class="form-label">จำนวนเงิน</label>
              <input
                type="text"
                class="form-control"
                placeholder="จำนวนเงิน"
                aria-label="จำนวนเงิน"
                v-model="bg.amount"
              />
              <div class="d-block mt-1" v-if="budget_errors.amount.error == 1">
                <span role="alert" class="text-danger">{{
                  budget_errors.amount.text
                }}</span>
              </div>
            </div>
            <div class="mb-1 col-12 col-md-2">
              <button
                class="btn btn-danger mt-7 w-100"
                @click="onDecreaseBudget(3, idx)"
              >
                <i class="fa fa-close"></i>
                <span>ลบ</span>
              </button>
            </div>
            <hr />
          </div>
        </div>

        <div class="mt-3">
          <a @click="onIncreaseBudget(3)" class="cursor-pointer"
            ><span>+ เพิ่ม</span></a
          >
        </div>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="references" class="required form-label"
          >รายการเอกสารอ้างอิงหรือบรรณานุกรม</label
        >
        <froala
          :tag="'textarea'"
          :config="froalaConfig.references"
          v-model="item.references"
        ></froala>
        <div class="d-block mt-1" v-if="errors.references.error == 1">
          <span role="alert" class="text-danger">{{
            errors.references.text
          }}</span>
        </div>
      </div>

      <div class="col-12">
        <div class="mb-7 row">
          <div class="col-12 col-lg-12">
            <label for="formFile" class="form-label"
              >แนบไฟล์ (ถ้ามี) (แนบได้หลายไฟล์) /Attach files</label
            >
            <dashboard
              :uppy="uppy"
              :plugins="['Webcam']"
              aria-placeholder=""
              ref="dash"
              :props="{
                width: '100%',
                doneButtonHandler: null,
                hideCancelButton: true,
                showRemoveButtonAfterComplete: true,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </tab-content>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// Import Datepicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(buddhistEra);
dayjs.extend(utc);
dayjs.extend(timezone);
// Import FormWizard
import { TabContent } from "vue3-form-wizard";
// Uppy
import { Dashboard } from "@uppy/vue";
import Uppy from "@uppy/core";
import Webcam from "@uppy/webcam";
// import Preview from "@uppy/preview";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/webcam/dist/style.css";
// import "@wiris/mathtype-froala3/wiris.js"

// Use Composables
import useBasicData from "@/composables/useBasicData";
import useMasterData from "@/composables/useMasterData";
import useFroalaConfigData from "@/composables/useFroalaConfigData";

export default defineComponent({
  name: "paper-form-tab2",
  props: {
    item: {
      type: Object,
      required: true,
    },
    budget: {
      type: Array as () => any[],
      required: true,
    },
    budget2: {
      type: Array as () => any[],
      required: true,
    },
    budget3: {
      type: Array as () => any[],
      required: true,
    },
    researcher: {
      type: Array as () => any[],
      required: true,
    },
    method_list: {
      type: Array as () => any[],
      required: true,
    },
    r: {
      type: String,
    },
    errors: {
      type: Object,
      required: true,
    },
    method_list_errors: {
      type: Object,
      required: true,
    },
    researcher_errors: {
      type: Object,
      required: true,
    },
    budget_errors: {
      type: Object,
      required: true,
    },
    budget2_errors: {
      type: Object,
      required: true,
    },
    budget3_errors: {
      type: Object,
      required: true,
    },
  },
  components: {
    vSelect,
    VueDatePicker,
    dayjs,
    Dashboard,
    TabContent,
  },
  setup(props, { emit }) {
    // Variable
    const { item, budget, budget2, budget3, researcher, method_list } =
      toRefs(props);

    const format = (date: any) => {
      const day = dayjs(date).locale("th").format("DD");
      const month = dayjs(date).locale("th").format("MMM");
      const year = date.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    };

    let froalaConfig: any = {
      references: useFroalaConfigData().froala_config,
    };

    let textEditor = ["references"];

    textEditor.forEach((x: any) => {
      froalaConfig[x]["events"] = {
        keyup: function (inputEvent: any) {
          item.value[x] = this.html.get();
        },
        click: function (clickEvent: any) {
          item.value[x] = this.html.get();
        },
        "commands.after": function (cmd: any, param1: any, param2: any) {
          item.value[x] = this.html.get();
        },
        "paste.after": function (pasteEvent: any) {
          item.value[x] = this.html.get();
        },
        initialized: function () {
          this.html.insert(item.value[x]);
        },
      };
    });

    // Uppy
    const uppy = new Uppy({
      meta: {
        paper_id: props.item.id,
        secret_key: props.r,
        id: null,
        table_name: "paper",
      } as any,
      debug: true,
      restrictions: {
        allowedFileTypes: ["image/*", "video/*", "application/*"],
      },
    })
      .use(XHRUpload, {
        headers: {},
        endpoint: `${import.meta.env.VITE_APP_API_URL}/froala/uppy`,
        fieldName: "file",
      })
      .use(Webcam, {
        modes: ["picture"],
      });

    uppy.on("file-added", (file) => {
      if (file.meta.id == null) {
        uppy.upload();
      }
    });

    uppy.on("upload-success", (file: any, response) => {
      uppy.setFileMeta(file.id, {
        id: response.body ? response.body.id : null,
        url: response.body ? response.body.link : null,
      } as any);
    });

    uppy.on("file-removed", (file: any) => {
      if (file.meta.id != null) {
        ApiService.delete(
          `${import.meta.env.VITE_APP_API_URL}/file-attach/${file.meta.id}`
        )
          .then(({ data }) => {
            if (data.msg != "success") {
              throw new Error("ERROR");
            }
          })
          .catch(({ response }) => {
            console.log(response.data.errors);
          });
      }
    });
    // End Uppy

    const selectOptions = ref({
      departments: <any>[],
      researcher_types: useBasicData().researcher_types,
    });

    // fetch
    const fetchFileAttach = async () => {
      if (props.item.id == undefined) return;
      const { data } = await ApiService.query("file-attach", {
        params: { paper_id: props.item.id, perPage: 100 },
      });

      //
      for (let i = 0; i < data.data.length; i++) {
        await fetch(data.data[i].filename)
          .then((response) => response.blob())
          .then((blob) => {
            if (blob.type != "text/html") {
              uppy.addFile({
                name: "unnamed_file",
                type: blob.type,
                data: blob,
                meta: {
                  relativePath: data.data[i].filename,
                  paper_id: data.data[i].paper_id,
                  id: data.data[i].id,
                  secret_key: data.data[i].secret_key,
                  isRemote: true,
                },
                source: "Local",
                isRemote: false,
              });
            }
          });
      }
      //

      //
      uppy.getFiles().forEach((file) => {
        // uppy.setFileState(file.id, {
        //   progress: { uploadComplete: true, uploadStarted: 1 },
        // });

        const progress = {
          uploadComplete: true,
          uploadStarted: Date.now(),
        } as any;

        uppy.setFileState(file.id, { progress });
      });
    };

    // Event
    const onTab2Validate = async () => {
      return true;
    };

    // Mounted
    onMounted(async () => {
      selectOptions.value.departments = await useMasterData().fetchDepartments({
        is_active: 1,
        perPage: 500,
      });
      fetchFileAttach();
    });

    onBeforeUnmount(() => {});

    const onIncreaseBudget = (type: any) => {
      if (type == 1) {
        budget.value.push({
          id: null,
          detail: "",
          amount: null,
          paper_id: null,
        });
      }
      if (type == 2) {
        budget2.value.push({
          id: null,
          detail: "",
          amount: null,
          paper_id: null,
        });
      }

      if (type == 3) {
        budget3.value.push({
          id: null,
          detail: "",
          amount: null,
          paper_id: null,
        });
      }
    };
    const onDecreaseBudget = (type: any, index: number) => {
      if (type == 1) {
        budget.value.splice(index, 1);
      }
      if (type == 2) {
        budget2.value.splice(index, 1);
      }
      if (type == 3) {
        budget3.value.splice(index, 1);
      }
    };

    const onIncreaseResearcher = () => {
      researcher.value.push({
        prefix_name: null,
        firstname: null,
        surname: null,
        department_id: null,
        department_text: null,
        phone_number: null,
        expertise: null,
        researcher_type: null,
        percentage: null,
        paper_id: null,
      });
    };

    const onDecreaseMethodList = (index: any) => {
      method_list.value.splice(index, 1);
    };

    const onIncreaseMethodList = () => {
      method_list.value.push({
        start_date: null,
        end_date: null,
        detail: null,
      });
    };

    const onDecreaseResearcher = (index: any) => {
      researcher.value.splice(index, 1);
    };

    // Return
    return {
      froalaConfig,
      format,
      selectOptions,
      uppy,
      onTab2Validate,
      onIncreaseBudget,
      onDecreaseBudget,
      onIncreaseResearcher,
      onDecreaseResearcher,
      onIncreaseMethodList,
      onDecreaseMethodList,
    };
  },
});
</script>

<style>
.fr-toolbar {
  border: 1px solid #ffc600;
}

.fr-box.fr-basic .fr-wrapper {
  border: 1px solid #ffc600;
}

.fr-second-toolbar {
  border: 1px solid #ffc600;
}
</style>
