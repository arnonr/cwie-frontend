<template>
  <tab-content :title="`ลำดับที่ 1`" :before-change="onTab1Validate">
    <div class="row">
      <div class="mb-7 col-12 col-lg-12">
        <label for="paper_type_id" class="required form-label"
          >ประเภทงานวิจัย</label
        >
        <v-select
          name="paper_type_id"
          label="name"
          placeholder="ประเภทงานวิจัย"
          :options="selectOptions.paper_types"
          class="form-control"
          :clearable="false"
          v-model="item.paper_type_id"
        >
        </v-select>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="paper_type_id" class="required form-label"
          >ลักษณะงานวิจัย</label
        >
        <v-select
          name="paper_kind_id"
          label="name"
          placeholder="ลักษณะงานวิจัย"
          :options="selectOptions.paper_kinds"
          class="form-control"
          :clearable="false"
          v-model="item.paper_kind_id"
        >
        </v-select>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="title_th" class="required form-label"
          >ชื่อโครงการ ภาษาไทย</label
        >
        <input
          type="text"
          class="form-control"
          :placeholder="`ชื่อโครงการ ภาษาไทย`"
          :aria-label="`ชื่อโครงการ ภาษาไทย`"
          v-model="item.title_th"
        />
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="title_en" class="required form-label"
          >ชื่อโครงการ ภาษาอังกฤษ</label
        >
        <input
          type="text"
          class="form-control"
          :placeholder="`ชื่อโครงการ ภาษาอังกฤษ`"
          :aria-label="`ชื่อโครงการ ภาษาอังกฤษ`"
          v-model="item.title_en"
        />
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="abstract" class="required form-label"
          >บทคัดย่อ (Abstract)</label
        >
        <froala
          :tag="'textarea'"
          :config="froalaConfig.abstract"
          v-model="item.abstract"
        ></froala>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="keyword" class="form-label">Keyword</label>
        <vue3-tags-input
          :tags="tags"
          placeholder=""
          @on-tags-changed="handleChangeTag"
        />
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="department_id" class="required form-label">ภาควิชา</label>
        <v-select
          name="department_id"
          label="name"
          placeholder="ภาควิชา"
          :options="selectOptions.departments"
          class="form-control"
          :clearable="false"
          v-model="item.department_id"
        >
        </v-select>
      </div>
      <div class="mb-7 col-12 col-lg-12">
        <label for="history" class="required form-label"
          >ความเป็นมาและความสำคัญของปัญหาการวิจัยที่ทำ</label
        >
        <froala
          :tag="'textarea'"
          :config="froalaConfig.history"
          v-model="item.history"
        ></froala>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="objective" class="required form-label"
          >วัตถุประสงค์ของโครงการวิจัย</label
        >

        <froala
          :tag="'textarea'"
          :config="froalaConfig.objective"
          v-model="item.objective"
        ></froala>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="scope" class="required form-label">ขอบเขตของการวิจัย</label>
        <froala
          :tag="'textarea'"
          :config="froalaConfig.scope"
          v-model="item.scope"
        ></froala>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="review_literature" class="required form-label"
          >ผลงานวิจัยที่เกี่ยวข้อง (Review Literature)
          ระบุความเกี่ยวเนื่องสัมพันธ์หรือความแตกต่างของโครงการวิจัยเรื่องนี้กับโครงการวิจัยอื่นทั้งในประเทศและต่างประเทศที่ได้มีการวิจัยไว้แล้ว
          รวมถึงรายละเอียดผลการวิจัยที่เกี่ยวข้อง
          ต้องเขียนแสดงรายละเอียดจากผลการวิจัยเรื่องนั้นๆ
          ไม่ใช่การเขียนเอกสารอ้างอิงหรือบรรณานุกรม</label
        >
        <froala
          :tag="'textarea'"
          :config="froalaConfig.review_literature"
          v-model="item.review_literature"
        ></froala>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="method" class="required form-label"
          >ระเบียบวิธีวิจัย ให้อธิบายขั้นตอนในการดำเนินการทดลอง หรือทดสอบ
          โดยอธิบาย วิธีวิเคราะห์ข้อมูล อย่างละเอียด</label
        >
        <froala
          :tag="'textarea'"
          :config="froalaConfig.method"
          v-model="item.method"
        ></froala>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="benefit" class="required form-label"
          >ประโยชน์ที่คาดว่าจะได้รับ</label
        >
        <froala
          :tag="'textarea'"
          :config="froalaConfig.benefit"
          v-model="item.benefit"
        ></froala>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="location" class="required form-label"
          >สถานที่ทำการทดลอง และ/หรือเก็บข้อมูล</label
        >
        <froala
          :tag="'textarea'"
          :config="froalaConfig.location"
          v-model="item.location"
        ></froala>
      </div>
    </div>
  </tab-content>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, toRefs, onBeforeUnmount } from "vue";
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
// Vue3 Tags
import Vue3TagsInput from "vue3-tags-input";
// import "@wiris/mathtype-froala3/wiris.js"

// Use Composables
import useMasterData from "@/composables/useMasterData";
import useFroalaConfigData from "@/composables/useFroalaConfigData";

export default defineComponent({
  name: "paper-form-tab1",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    vSelect,
    VueDatePicker,
    dayjs,
    TabContent,
    Vue3TagsInput,
  },
  setup(props, { emit }) {
    // Variable
    const { item } = toRefs(props);
    const tags = ref<string[]>([]);

    let froalaConfig: any = {
      abstract: useFroalaConfigData().froala_config,
      history: useFroalaConfigData().froala_config,
      objective: useFroalaConfigData().froala_config,
      review_literature: useFroalaConfigData().froala_config,
      method: useFroalaConfigData().froala_config,
      benefit: useFroalaConfigData().froala_config,
      location: useFroalaConfigData().froala_config,
      scope: useFroalaConfigData().froala_config,
    };

    let textEditor = [
      "abstract",
      "history",
      "objective",
      "review_literature",
      "method",
      "benefit",
      "location",
      "scope",
    ];

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
        //   this.$el.css("font-size", "16px"); // ตั้งค่าขนาดฟอนต์เริ่มต้น
          this.html.insert(item.value[x]);
        },
      };
    });

    const selectOptions = ref({
      departments: <any>[],
      paper_types: <any>[],
      paper_kinds: <any>[],
    });

    // Event
    const onTab1Validate = async () => {
      return true;
    };

    const handleChangeTag = (tags: any) => {
      tags.value = tags;
      item.value.keyword = tags.value.join(",");
    };

    // Mounted
    onMounted(async () => {
      selectOptions.value.departments = await useMasterData().fetchDepartments({
        is_active: 1,
        perPage: 500,
      });

      selectOptions.value.paper_types = await useMasterData().fetchPaperTypes({
        is_active: 1,
        perPage: 500,
      });

      selectOptions.value.paper_kinds = await useMasterData().fetchPaperKinds({
        is_active: 1,
        perPage: 500,
      });

      if (item.value.keyword != null && item.value.keyword != "") {
        tags.value = item.value.keyword.split(",");
      } else {
        tags.value = [];
      }
    });

    onBeforeUnmount(() => {});

    // Return
    return {
      froalaConfig,
      selectOptions,
      tags,
      handleChangeTag,
      onTab1Validate,
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

.v3ti {
  border: 1px solid #ffc600 !important;
}
</style>
