<template>
  <div class="card shadow-sm my-5">
    <div class="card-body mx-md-0 mx-5" v-if="item != undefined">
      <div class="col-md-12 px-1 mx-auto">
        <img src="" alt="" />
      </div>
      <div class="col-md-12 px-1">
        <span class="fw-bold">ชื่อ-นามสกุล : </span>
        <span class="fst-italic"
          >{{ item.prefix_name != null ? item.prefix_name : ""
          }}{{ item.firstname + " " + item.surname }}</span
        >
        <div class="separator separator-dotted my-2"></div>
      </div>
      <div class="col-md-12 px-1">
        <span class="fw-bold">รหัสนักศึกษา : </span>
        <span class="fst-italic">{{ item.student_code }}</span>
        <div class="separator separator-dotted my-2"></div>
      </div>
      <div class="col-md-12 px-1">
        <span class="fw-bold">คณะ : </span>
        <span class="fst-italic">{{ item.faculty_detail?.name }}</span>
        <div class="separator separator-dotted my-2"></div>
      </div>
      <div class="col-md-12 px-1">
        <span class="fw-bold">สาขา : </span>
        <span class="fst-italic">{{ item.division_detail?.name }}</span>
        <div class="separator separator-dotted my-2"></div>
      </div>
      <div class="col-md-12 px-1">
        <span class="fw-bold">ชั้นปีที่ : </span>
        <span class="fst-italic">{{ item.class_year }}</span>
        <div class="separator separator-dotted my-2"></div>
      </div>
      <div class="col-md-12 px-1">
        <span class="fw-bold">สถานะใบสมัคร : </span>

        <span
          class="badge p-2 text-white"
          :style="`background-color: ${item.status_detail?.color};`"
          >{{ item.status_detail?.name}}</span
        >
        <div class="separator separator-dotted my-2"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "student-profile-minimal-card",
  props: {
    item: { type: Object },
  },
  components: {},
});
</script>
