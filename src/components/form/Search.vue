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
          <i class="fa fa-search pe-2"></i> ค้นหาโครงการ
        </h6>
        <div
          id="collapseOne"
          class="accordion-collapse collapse hide"
          data-bs-parent="#accordionSearch"
        >
          <div class="accordion-body">
            <div class="row ps-5 pe-5 ps-md-0 pe-md-0">
              <div class="col-12 col-md-4 my-2">
                <label for="">ปีที่ยื่นเสนอ</label>
                <v-select
                  id="slt-search-year"
                  name="slt-search-year"
                  label="name"
                  placeholder="ปีที่เสนอ"
                  :options="selectOptions.years"
                  v-model="search.year"
                  :reduce="(year: any) => year.value"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div>
              <div class="col-12 col-md-2 my-2">
                <label for="">รหัสโครงการ</label>
                <input
                  type="text"
                  id="txt-search-complain-code"
                  name="txt-search-complain-code"
                  class="form-control"
                  v-model="search.rp_no"
                />
              </div>
              <div class="col-12 col-md-6 my-2">
                <label for="">ชื่อโครงการ</label>
                <input
                  type="text"
                  id="txt-search-complain-title"
                  name="txt-search-complain-title"
                  class="form-control"
                  v-model="search.title_th"
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
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

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
    state_new: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    // Variable
    const { search } = toRefs(props);

    const selectOptions = ref<any>({
      years: [],
      perPage: [
        { title: "20", value: 20 },
        { title: "40", value: 40 },
        { title: "60", value: 60 },
      ],
    });

    const format = (date: any) => {
      const day = dayjs(date).locale("th").format("DD");
      const month = dayjs(date).locale("th").format("MMM");
      const year = date.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    };

    const calYear = () => {
      let year = new Date().getFullYear();
      for (let i = 0; i <= 5; i++) {
        selectOptions.value.years.push({
          name: year - i + 543,
          value: Number(year - i),
        });
      }
      selectOptions.value.years.push({
        name: "ทั้งหมด",
        value: null,
      });
    };
    calYear();

    const onSearch = () => {
      emit("search");
    };

    const onClear = () => {
      emit("clear");
    };

    onMounted(async () => {});

    // Watch
    return {
      selectOptions,
      search,
      onSearch,
      onClear,
      format,
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
