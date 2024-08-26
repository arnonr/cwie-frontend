<template>
  <div class="row">
    <div>
      <hr class="my-6" />

      <h6 class="py-5 px-5 rounded">งบประมาณในการดำเนินงานวิจัย</h6>
      <h6 class="mt-10">หมวดค่าตอบแทน เฉพาะค่าจ้างผู้ช่วยวิจัย</h6>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th class="text-center" style="width: 80px">ลำดับที่</th>
              <th>รายละเอียด</th>
              <th class="text-end" style="width: 200px">จำนวนเงิน (บาท)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(bg, idx) in budget" :key="idx">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>{{ bg.detail }}</td>
              <td class="text-end">
                {{
                  Number(bg.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="text-end fw-bold">รวม</td>
              <td class="text-end fw-bold">
                {{ calculateTotal("budget") }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div v-if="budget2.length != 0">
      <h6>
        หมวดค่าใช้สอย เช่น ค่าพาหนะ ค่าจ้างเหมาต่าง ๆ เช่น ค่าจัดทำรูปเล่ม
      </h6>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th class="text-center" style="width: 80px">ลำดับที่</th>
              <th>รายละเอียด</th>
              <th class="text-end" style="width: 200px">จำนวนเงิน (บาท)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(bg, idx) in budget2" :key="idx">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>{{ bg.detail }}</td>
              <td class="text-end">
                {{
                  Number(bg.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="text-end fw-bold">รวม</td>
              <td class="text-end fw-bold">
                {{ calculateTotal("budget2") }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div v-if="budget3.length != 0">
      <h6>หมวดค่าวัสดุ (แจกแจงรายละเอียดราคาต่อหน่วยอย่างชัดเจน)</h6>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th class="text-center" style="width: 80px">ลำดับที่</th>
              <th>รายละเอียด</th>
              <th class="text-end" style="width: 200px">จำนวนเงิน (บาท)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(bg, idx) in budget3" :key="idx">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>{{ bg.detail }}</td>
              <td class="text-end">
                {{
                  Number(bg.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="text-end fw-bold">รวม</td>
              <td class="text-end fw-bold">
                {{ calculateTotal("budget3") }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div class="col-md-12 mt-10 mb-10">
      <div class="d-block d-md-flex align-items-baseline">
        <div class="fw-bold flex-shrink-0 me-5">
          รายการเอกสารอ้างอิงหรือบรรณานุกรม
        </div>
      </div>
      <div v-html="item.references" class="text-justify custom-underline"></div>
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
    file_attach: {
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

    const calculateTotal = (budget_name: string) => {
      const total = props[budget_name].reduce(
        (sum: any, item: any) => sum + Number(item.amount),
        0
      );
      return (
        total.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " บาท"
      );
    };

    // Watch
    // Return
    return {
      item,
      calculateTotal,
    };
  },
});
</script>
