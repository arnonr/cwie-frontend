<template>
  <tab-content :title="'สรุปข้อมูล'">
    <div class="row" v-if="tab_index == 2">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12 mb-5">
            <h4>ข้อมูลสาระสำคัญของโครงการ</h4>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">ประเภทงานวิจัย : </span>
            <span>{{ item.paper_type_id?.name }}</span>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">ลักษณะงานวิจัย : </span>
            <span>{{ item.paper_kind_id?.name }}</span>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">ชื่อโครงการ ภาษาไทย : </span>
            <span>{{ item.title_th }}</span>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">ชื่อโครงการ ภาษาอังกฤษ : </span>
            <span>{{ item.title_en }}</span>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">บทคัดย่อ (Abstract) : </span>
            <div v-html="item.abstract"></div>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">คำสำคัญ (Keyword) : </span>
            <span v-for="(k, idx) in new_item.keyword" :key="idx"
              >{{ idx != 0 ? " , " : "" }}
              {{ k }}
            </span>
            <div class="separator separator-dotted my-2"></div>
          </div>
          <div class="col-md-12">
            <span class="fw-bold">ภาควิชา : </span>
            <span>{{ item.department_id?.name }}</span>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold"
              >ความเป็นมาและความสำคัญของปัญหาการวิจัยที่ทำ :
            </span>
            <div v-html="item.history"></div>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">วัตถุประสงค์ของโครงการวิจัย : </span>
            <div v-html="item.objective"></div>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">ขอบเขตของการวิจัย : </span>
            <div v-html="item.scope"></div>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">ผลงานวิจัยที่เกี่ยวข้อง : </span>
            <div v-html="item.review_literature"></div>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">ระเบียบวิธีวิจัย : </span>
            <div v-html="item.method"></div>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">ประโยชน์ที่คาดว่าจะได้รับ : </span>
            <div v-html="item.benefit"></div>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="col-md-12">
            <span class="fw-bold">สถานที่ทำการทดลอง และ/หรือเก็บข้อมูล : </span>
            <div v-html="item.location"></div>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div class="pt-6">
            <h6 class="py-5 px-5 bg-warning rounded">คณะผู้วิจัย</h6>
            <div v-for="(rc, idx) in researcher" :key="idx" class="row">
              <div class="col-md-6 mt-10">
                <span class="fw-bold">คนที่ {{ idx + 1 }} : </span>
                <span>
                  {{ rc.prefix_name + "" + rc.firstname + " " + rc.surname }}
                </span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-6 mt-10">
                <span class="fw-bold">หน่วยงาน : </span>
                <span>{{
                  rc.department_id ? rc.department_id?.name : rc.department_text
                }}</span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-6">
                <span class="fw-bold">เบอร์โทรศัพท์ : </span>
                <span>{{ rc.phone_number }}</span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-6">
                <span class="fw-bold">ความชำนาญ/ความสนใจพิเศษ : </span>
                <span>{{ rc.expertise }}</span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-6">
                <span class="fw-bold">ประเภท : </span>
                <span>{{ rc.researcher_type?.name }}</span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-6">
                <span class="fw-bold">สัดส่วน (%) : </span>
                <span>{{ rc.percentage }}</span>
                <div class="separator separator-dotted my-2"></div>
              </div>
            </div>
            <hr class="my-6" />
          </div>

          <div class="pt-6">
            <h6 class="py-5 px-5 bg-warning rounded">
              ขั้นตอนและระยะเวลาของแผนดำเนินงาน
            </h6>
            <div v-for="(ml, idx) in method_list" :key="idx" class="row">
              <div class="col-md-12 mt-10">
                <span class="fw-bold">ลำดับที่ {{ idx + 1 }} : </span>
                <span>
                  {{ ml.detail }}
                </span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-6 mt-10">
                <span class="fw-bold">วันที่เริ่ม: </span>
                <span>{{ convertDate(ml.start_date) }}</span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-6 mt-10">
                <span class="fw-bold">วันที่สิ้นสุด: </span>
                <span>{{ convertDate(ml.end_date) }}</span>
                <div class="separator separator-dotted my-2"></div>
              </div>
            </div>
            <hr class="my-6" />
          </div>

          <div class="pt-6">
            <h6 class="py-5 px-5 bg-warning rounded">
              งบประมาณในการดำเนินงานวิจัย
            </h6>
            <h6 class="mt-10">หมวดค่าตอบแทน เฉพาะค่าจ้างผู้ช่วยวิจัย</h6>
            <div v-for="(bg, idx) in budget" :key="idx" class="row">
              <div class="col-md-9 mt-5">
                <span class="fw-bold">ลำดับที่ {{ idx + 1 }} : </span>
                <span>
                  {{ bg.detail }}
                </span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-3 mt-5">
                <span class="fw-bold">จำนวนเงิน : </span>
                <span
                  >{{
                    Number(bg.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                  บาท</span
                >
                <div class="separator separator-dotted my-2"></div>
              </div>
            </div>
            <hr class="my-6" />
          </div>

          <div v-if="budget2.length != 0">
            <h6>
              หมวดค่าใช้สอย เช่น ค่าพาหนะ ค่าจ้างเหมาต่าง ๆ เช่น ค่าจัดทำรูปเล่ม
            </h6>
            <div v-for="(bg, idx) in budget2" :key="idx" class="row">
              <div class="col-md-9 mt-5">
                <span class="fw-bold">ลำดับที่ {{ idx + 1 }} : </span>
                <span>
                  {{ bg.detail }}
                </span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-3 mt-5">
                <span class="fw-bold">จำนวนเงิน : </span>
                <span
                  >{{
                    Number(bg.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                  บาท</span
                >
                <div class="separator separator-dotted my-2"></div>
              </div>
            </div>
            <hr class="my-6" />
          </div>

          <div v-if="budget3.length != 0">
            <h6>หมวดค่าวัสดุ (แจกแจงรายละเอียดราคาต่อหน่วยอย่างชัดเจน)</h6>
            <div v-for="(bg, idx) in budget3" :key="idx" class="row">
              <div class="col-md-9 mt-5">
                <span class="fw-bold">ลำดับที่ {{ idx + 1 }} : </span>
                <span>
                  {{ bg.detail }}
                </span>
                <div class="separator separator-dotted my-2"></div>
              </div>
              <div class="col-md-3 mt-5">
                <span class="fw-bold">จำนวนเงิน : </span>
                <span
                  >{{
                    Number(bg.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                  บาท</span
                >
                <div class="separator separator-dotted my-2"></div>
              </div>
            </div>
            <hr class="my-6" />
          </div>

          <div class="pt-6">
            <h6 class="py-5 px-5 bg-warning rounded">
              รายการเอกสารอ้างอิงหรือบรรณานุกรม
            </h6>
            <div v-html="item.references"></div>
            <div class="separator separator-dotted my-2"></div>
          </div>

          <div v-for="(fa, idx) in file_attach" :key="idx">
            <span class="fw-bold">ไฟล์แนบ {{ idx + 1 }} : </span>
            <a :href="fa.filename" target="_blank"><span>คลิก</span></a>
            <div class="separator separator-dotted my-2"></div>
          </div>
        </div>
      </div>
    </div>
  </tab-content>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs, watch } from "vue";
import ApiService from "@/core/services/ApiService";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
// Import FormWizard
import { TabContent } from "vue3-form-wizard";

// Composable
import useDateData from "@/composables/useDateData";

export default defineComponent({
  name: "complaint-form-tab3",
  props: {
    item: {
      type: Object,
      required: true,
    },
    budget: {
      type: Object,
      required: true,
    },
    budget2: {
      type: Object,
      required: true,
    },
    budget3: {
      type: Object,
      required: true,
    },
    researcher: {
      type: Object,
      required: true,
    },
    method_list: {
      type: Object,
      required: true,
    },
    tab_index: {
      type: Number,
      required: true,
    },
    r: {
      type: String,
    },
  },
  components: {
    dayjs,
    TabContent,
  },
  setup(props) {
    // Variable
    const { tab_index, item } = toRefs(props);

    const selectOptions = ref({});

    const file_attach = reactive<any>([]);

    // Fetch
    const fetchFileAttach = async () => {
      try {
        let params = item.value.id
          ? { paper_id: item.value.id }
          : { secret_key: props.r };

        const { data } = await ApiService.query("file-attach/", {
          params: { ...params },
        });
        Object.assign(file_attach, data.data);
      } catch (error) {
        console.log(error);
      }
    };

    // Mounted
    const new_item = reactive<any>({
      is_anonymous: null,
      keyword: [],
    });

    const beforeShowTab = () => {
      fetchFileAttach();

      new_item.keyword =
        item.value.keyword != "" && item.value.keyword != null
          ? item.value.keyword
              .split(",")
              .map((it: any) => it.replace(/(^'|'$)/g, ""))
          : [];
    };

    onMounted(async () => {
      beforeShowTab();
    });

    // Watch
    watch(
      () => tab_index.value,
      () => {
        beforeShowTab();
      }
    );
    // onCalulate

    // Return
    return {
      selectOptions,
      new_item,
      convertDate: useDateData().convertDate,
      file_attach,
    };
  },
});
</script>

<style scoped>
.vs__dropdown-toggle {
  border: none;
}

.v-select {
  padding: 0.4em 0.5em;
}

.dp__main {
  padding: 0.35em 0em;
}

.dp__input {
  border: none !important;
}
@media only screen and (max-width: 768px) {
  .card > .card-body {
    padding: 0px;
  }
}

.form-check-input-custom {
  border-radius: 0.45em;
  border-color: #1b84ff;
  border-width: 2px;
}

.form-check-input-custom:disabled {
  pointer-events: none;
  filter: none;
  opacity: 1;
}

.form-check-input-custom:disabled {
  color: var(--bs-gray-500);
  background-color: none !important;
  border-color: #1b84ff;
  opacity: 1;
}

.form-check-input[disabled] ~ .form-check-label,
.form-check-input:disabled ~ .form-check-label {
  opacity: 1;
}

.color-primary {
  color: #800001;
}
</style>
