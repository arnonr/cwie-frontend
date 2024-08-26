<template>
  <div class="row">
    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">ชื่อโครงการ (ภาษาไทย)</div>
        <div class="custom-underline flex-grow-1">{{ item.title_th }}</div>
      </div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">ชื่อโครงการ (ภาษาอังกฤษ)</div>
        <div class="custom-underline flex-grow-1">{{ item.title_en }}</div>
      </div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <span class="fw-bold flex-shrink-0 me-5">ประเภทงานวิจัย </span>
        <span class="custom-underline flex-grow-1">{{
          item.paper_type_id?.name
        }}</span>
      </div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <span class="fw-bold flex-shrink-0 me-5">ลักษณะงานวิจัย </span>
        <span class="custom-underline flex-grow-1">{{
          item.paper_kind_id?.name
        }}</span>
      </div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">บทคัดย่อ (Abstract)</div>
      </div>
      <div v-html="item.abstract" class="text-justify custom-underline"></div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <span class="fw-bold flex-shrink-0 me-5">คำสำคัญ (Keyword) </span>
        <span class="custom-underline flex-grow-1">{{ item.keyword }}</span>
      </div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <span class="fw-bold flex-shrink-0 me-5">หน่วยงาน </span>
        <span class="custom-underline flex-grow-1">{{
          item.department_id?.name
        }}</span>
      </div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">
          ความเป็นมาและความสำคัญของปัญหาการวิจัยที่ทำ
        </div>
      </div>
      <div v-html="item.history" class="text-justify custom-underline"></div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">
          วัตถุประสงค์ของโครงการวิจัย
        </div>
      </div>
      <div v-html="item.objective" class="text-justify custom-underline"></div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">ขอบเขตของการวิจัย</div>
      </div>
      <div v-html="item.scope" class="text-justify custom-underline"></div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">ผลงานวิจัยที่เกี่ยวข้อง</div>
      </div>
      <div
        v-html="item.review_literature"
        class="text-justify custom-underline"
      ></div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">ระเบียบวิธีวิจัย</div>
      </div>
      <div v-html="item.method" class="text-justify custom-underline"></div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">ประโยชน์ที่คาดว่าจะได้รับ</div>
      </div>
      <div v-html="item.benefit" class="text-justify custom-underline"></div>
    </div>

    <div class="col-md-12 mt-5">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">
          สถานที่ทำการทดลอง และ/หรือเก็บข้อมูล
        </div>
      </div>
      <div v-html="item.location" class="text-justify custom-underline"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs } from "vue";

export default defineComponent({
  name: "paper-detail-section1",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  components: {},
  setup(props) {
    // Variable
    const { item } = toRefs(props);

    // Mounted
    onMounted(async () => {});

    // Watch
    // Return
    return {
      item,
    };
  },
});
</script>
