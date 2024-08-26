<template>
  <div>
    <div class="accordion" id="accordionSearch">
      <div class="accordion-item">
        <h6
          class="accordion-header accordion-button p-5"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="false"
          aria-controls="collapseOne"
        >
          <i class="fa fa-search pe-2"></i> ค้นหากรรมการ
        </h6>
        <div
          id="collapseOne"
          class="accordion-collapse collapse hide"
          data-bs-parent="#accordionSearch"
        >
          <div class="accordion-body">
            <div class="row ps-5 pe-5 ps-md-0 pe-md-0">
              <div class="col-12 col-md-6 my-2">
                <label for="">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  id="txt-search-fullname"
                  name="txt-search-fullname"
                  class="form-control"
                  v-model="search.fullname"
                />
              </div>
              <div class="col-12 col-md-6 my-2">
                <label for="">หน่วยงาน</label>
                <input
                  type="text"
                  id="txt-search-organization_name"
                  name="txt-search-organization_name"
                  class="form-control"
                  v-model="search.organization_name"
                />
              </div>
            </div>
            <div class="row pt-5 pe-5 ps-md-0 pe-md-0">
              <div class="col-12 col-md-12 div-btn-search">
                <button class="btn btn-success fw-bold" @click="onSearch()">
                  ค้นหา
                </button>
                <button class="btn btn-danger ms-2 fw-bold" @click="onClear()">
                  ล้าง
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, onMounted } from "vue";

// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

import useMasterData from "@/composables/useMasterData";

export default defineComponent({
  name: "search-paper",
  components: {
    vSelect,
  },
  props: {
    search: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    // Variable
    const { search } = toRefs(props);

    const onSearch = () => {
      emit("search");
    };

    const onClear = () => {
      emit("clear");
    };

    onMounted(async () => {});

    // Watch
    return {
      search,
      onSearch,
      onClear,
    };
  },
});
</script>

<style scoped>
@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
  .div-btn-search {
    text-align: center;
  }
}
</style>
