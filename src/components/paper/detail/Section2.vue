<template>
  <div class="row">
    <div>
      <h6 class="py-5 px-5 bg-warning rounded">คณะผู้วิจัย</h6>
      <div class="table-responsive">
        <table class="table table-bordered table-border-black">
          <thead>
            <tr>
              <th class="text-center">ลำดับ</th>
              <th>ชื่อ-นามสกุล</th>
              <th>หน่วยงาน</th>
              <th>เบอร์โทรศัพท์</th>
              <th>ความชำนาญ/ความสนใจพิเศษ</th>
              <th>ประเภท</th>
              <th class="text-center">สัดส่วน (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rc, idx) in researcher" :key="idx">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>
                {{ rc.prefix_name + " " + rc.firstname + " " + rc.surname }}
              </td>
              <td>
                {{
                  rc.department_id ? rc.department_id?.name : rc.department_text
                }}
              </td>
              <td>{{ rc.phone_number }}</td>
              <td>{{ rc.expertise }}</td>
              <td>{{ rc.researcher_type?.name }}</td>
              <td class="text-center">{{ rc.percentage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <hr class="my-6" />
      <h6 class="py-5 px-5 bg-warning rounded">
        ขั้นตอนและระยะเวลาของแผนดำเนินงาน
      </h6>

      <div class="table-responsive">
        <table class="table table-bordered table-border-black">
          <thead>
            <tr>
              <th class="text-center">ลำดับ</th>
              <th>รายละเอียด</th>
              <th>วันที่เริ่ม</th>
              <th>วันที่สิ้นสุด</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ml, idx) in method_list" :key="idx">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>{{ ml.detail }}</td>
              <td>{{ convertDate(ml.start_date) }}</td>
              <td>{{ convertDate(ml.end_date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs } from "vue";

// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

// Composable
import useDateData from "@/composables/useDateData";

export default defineComponent({
  name: "paper-detail-section2",
  props: {
    item: {
      type: Object,
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
  },

  components: {},
  setup(props) {
    // Variable
    const { item } = toRefs(props);

    // Mounted
    onMounted(async () => {});

    const convertDate = (date: any) => {
      return dayjs(date).locale("th").format("DD MMM BBBB");
    };

    // Watch
    // Return
    return {
      item,
      convertDate: useDateData().convertDate,
    };
  },
});
</script>
