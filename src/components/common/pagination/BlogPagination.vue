<template>
  <div class="d-flex flex-column flex-md-row justify-content-between">
    <div class="text-muted m-2">
      <input
        class="form-control d-inline"
        type="text"
        style="max-width: 60px"
        v-model="perPage1"
        @input="onChangePerPageHandler"
      />
      <span class="ms-2">รายการ/หน้า</span>
    </div>
    
    <nav aria-label="..." class="py-5">
      <ul class="pagination">
        <li :class="`page-item ${prevBtnClass}`">
          <a class="page-link" @click="onChangePage('prev')">
            <span class="d-none d-md-block">Previous</span>
            <span class="d-block d-md-none">
              <i class="fa fa-arrow-left"></i>
            </span>
          </a>
        </li>
        <li
          v-for="(it, index) in numPage"
          :key="index"
          :class="props.currentPage == it ? 'page-item active' : 'page-item'"
        >
          <a @click="onChangePage(it)" class="page-link">{{ it }}</a>
        </li>
        <li :class="`page-item ${nextBtnClass}`">
          <a class="page-link" @click="onChangePage('next')">
            <span class="d-none d-md-block">Next</span>
            <span class="d-block d-md-none">
              <i class="fa fa-arrow-right"></i>
            </span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="text-muted m-2">
      ทั้งหมด {{ totalPage }} หน้า รวม {{ totalItems }} รายการ
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BlogPagination",
  components: {},
});
</script>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { debounce } from "lodash";

const props = defineProps([
  "currentPage",
  "totalPage",
  "totalItems",
  "perPage",
]);
const emit = defineEmits(["update:currentPage", "update:perPage"]);
const prevBtnClass = ref("");
const nextBtnClass = ref("");
const numPage = ref([1, 2, 3]);

const perPage1 = ref(props.perPage);

// Watch
watch(
  () => [props.currentPage, props.totalPage],
  ([newsCurrentPage, newsTotalPage]) => {
    if (newsCurrentPage == 1) {
      prevBtnClass.value = "page-link-disabled";
    } else {
      prevBtnClass.value = "";
    }
    if (newsCurrentPage == newsTotalPage) {
      nextBtnClass.value = "page-link-disabled";
    } else {
      nextBtnClass.value = "";
    }

    if (newsCurrentPage == 1) {
      if (newsTotalPage == 1) {
        numPage.value = [1];
      } else if (newsTotalPage == 2) {
        numPage.value = [1, 2];
      } else {
        numPage.value = [1, 2, 3];
      }
    } else {
      if (newsTotalPage - newsCurrentPage > 0) {
        numPage.value = [
          newsCurrentPage - 1,
          newsCurrentPage,
          newsCurrentPage + 1,
        ];
      }
    }
  }
);

// Event
const onChangePage = (type: any) => {
  if (type == "prev" && props.currentPage != 1) {
    emit("update:currentPage", props.currentPage - 1);
  }

  if (type == "next" && props.currentPage <= props.totalPage - 1) {
    emit("update:currentPage", props.currentPage + 1);
  }

  if (typeof type === "number") {
    emit("update:currentPage", type);
  }
};

const onChangePerPage = debounce(() => {
  emit("update:perPage", perPage1.value);
}, 1000);

const onChangePerPageHandler = () => {
  onChangePerPage();
};

// Mounted
onMounted(() => {
  if (props.currentPage == 1) {
    prevBtnClass.value = "page-link-disabled";
    if (props.totalPage == 1) {
      numPage.value = [1];
    }

    if (props.totalPage == 2) {
      numPage.value = [1, 2];
    }
  } else {
    prevBtnClass.value = "";
  }
  if (props.currentPage == props.totalPage) {
    nextBtnClass.value = "page-link-disabled";
  } else {
    nextBtnClass.value = "";
  }
});
</script>

<style>
.page-link {
  cursor: pointer;
  border-radius: 5px;
}

.page-link-disabled .page-link:hover {
  color: var(--bs-pagination-color) !important;
  border-radius: 5px;
  background-color: #ccc !important;
  cursor: default;
}

.page-link-disabled {
  border-radius: 5px;
  background-color: #ccc !important;
  cursor: default;
}
</style>
