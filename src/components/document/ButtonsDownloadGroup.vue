<template>
  <div>
    <button
      class="btn btn-outline btn-outline-success me-2 pe-sm-3 ps-sm-5 dropdown-toggle"
      type="button"
      id="dropdownMenuButton"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="bi bi-file-earmark-plus-fill fs-4"></i>
      <span class="d-none d-lg-inline-block">ดาวน์โหลดเอกสาร</span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <li>
        <a
          class="dropdown-item cursor-pointer"
          :class="{ disabled: student_profile_item.status_id < 6 }"
          @click="student_profile_item.status_id > 5 && handleDownloadPDF1()"
          >ใบสมัครโครงการ</a
        >
      </li>
      <li>
        <a
          class="dropdown-item cursor-pointer"
          :class="{ disabled: student_profile_item.status_id < 7 }"
          @click="student_profile_item.status_id > 6 && handleDownloadPDF2()"
          >หนังสือขอความอนุเคราะห์</a
        >
      </li>
      <li>
        <a
          class="dropdown-item cursor-pointer"
          :class="{ disabled: student_profile_item.status_id < 10 }"
          @click="student_profile_item.status_id > 9 && handleDownloadPDF3()"
          >หนังสือส่งตัว
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from "vue";
import useDateData from "@/composables/useDateData";
import { fetchAddressAlls } from "@/composables/useFetchSelectionData";

export default defineComponent({
  name: "document-buttons-download-group",
  components: {},
  props: {
    item: {
      type: Object,
      required: true,
    },
    student_profile_item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { item } = toRefs(props);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const selectOptions = ref({
      address_alls: <any>[],
    });
    const fetchAddress = async () => {
      selectOptions.value.address_alls = await fetchAddressAlls({});
    };
    fetchAddress();

    // fetch
    const handleDownloadPDF1 = () => {
        console.log("FREEDOMO")
    };

    const handleDownloadPDF2 = () => {};
    const handleDownloadPDF3 = () => {};
    const handleDownloadPDF4 = () => {};

    const convertAddress = (sub_district_id: any) => {
      let ad = selectOptions.value.address_alls.find((x: any) => {
        return x.sub_district_id == sub_district_id;
      });
      return ad?.province;
    };

    return {
      item,
      handleDownloadPDF1,
      handleDownloadPDF2,
      handleDownloadPDF3,
      handleDownloadPDF4,
      convertDate: useDateData().convertDate,
      userData,
      convertAddress,
    };
  },
});
</script>
