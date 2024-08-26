<template>
  <div class="">
    <div class="body" v-if="!isLoading">
      <div class="row">
        <Section1 v-if="item.id != null" :item="item" />

        <Section2
          v-if="item.id != null"
          :item="item"
          :researcher="researcher"
          :method_list="method_list"
        />

        <Section3
          v-if="item.id != null"
          :item="item"
          :budget="budget"
          :budget2="budget2"
          :budget3="budget3"
          :file_attach="file_attach"
        />

        <!-- <div class="mx-auto text-center mt-5">
          <button
            @click="generatePDF"
            type="button"
            class="btn btn-success"
            v-if="item.status_id != 1"
          >
            พิมพ์ข้อมูล
          </button>
        </div> -->
      </div>
    </div>
    <Preloader :isLoading="isLoading" :position="'absolute'" />
    <vue3-html2pdf
      :show-layout="false"
      :float-layout="true"
      filename="rp_data"
      :enable-download="true"
      :preview-modal="true"
      pdf-format="a4"
      :pdf-quality="2"
      pdf-orientation="portrait"
      :pdf-content-selector="'.generate-pdf'"
      :margin="[10, 10, 60, 10]"
      :manual-pagination="true"
      ref="html2Pdf"
    >
      <template v-slot:pdf-content id="pdf">
        <div class="generate-pdf">
          <div class="pdf-section">
            <SectionPDF1 :item="item" />
          </div>

          <!-- <div class="html2pdf__page-break"></div> -->

          <div class="pdf-section">
            <SectionPDF2
              :item="item"
              :researcher="researcher"
              :method_list="method_list"
            />
          </div>

          <!-- <div class="html2pdf__page-break"></div> -->

          <div class="pdf-section">
            <SectionPDF3
              :item="item"
              :budget="budget"
              :budget2="budget2"
              :budget3="budget3"
              :file_attach="file_attach"
            />
          </div>
        </div>
      </template>
    </vue3-html2pdf>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";

// PDF
import { jsPDF } from "jspdf";
import Vue3Html2pdf from "vue3-html2pdf";

// Use Composables
import useBasicData from "@/composables/useBasicData";
import Preloader from "@/components/preloader/Preloader.vue";
import useDateData from "@/composables/useDateData";

// Import Component
import Section1 from "@/components/paper/detail/Section1.vue";
import Section2 from "@/components/paper/detail/Section2.vue";
import Section3 from "@/components/paper/detail/Section3.vue";
import SectionPDF1 from "@/components/paper/pdf/SectionPDF1.vue";
import SectionPDF2 from "@/components/paper/pdf/SectionPDF2.vue";
import SectionPDF3 from "@/components/paper/pdf/SectionPDF3.vue";

export default defineComponent({
  name: "paper-detail",
  props: {
    paper_id: {
      type: Number,
      required: true,
    },
  },
  components: {
    Preloader,
    Vue3Html2pdf,
    jsPDF,
    Section1,
    Section2,
    Section3,
    SectionPDF1,
    SectionPDF2,
    SectionPDF3,
  },
  setup(props, { emit }) {
    // UI
    const isLoading = ref<any>(true);
    const html2Pdf = ref<any>(null);

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const item = reactive<any>({});
    const user_item = reactive<any>({});
    const researcher_types = useBasicData().researcher_types;
    const budget = reactive<any[]>([] as any[]);
    const budget2 = reactive<any[]>([] as any[]);
    const budget3 = reactive<any[]>([] as any[]);
    const researcher = reactive<any[]>([] as any[]);
    const method_list = reactive<any[]>([] as any[]);
    const file_attach = reactive<any[]>([] as any[]);

    const generatePDF = () => {
      html2Pdf.value.generatePdf();
    };

    //Fetch
    const fetchUser = async () => {
      try {
        const { data } = await ApiService.query("user/" + userData.id, {});
        Object.assign(user_item, {
          ...data.data,
          department_id:
            data.data.department_id != null
              ? {
                  name: data.data.department.name,
                  id: data.data.department_id,
                }
              : null,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchItem = async () => {
      try {
        const { data } = await ApiService.query("paper/" + props.paper_id, {});
        Object.assign(item, {
          ...data.data,
          department_id:
            data.data.department_id != null
              ? {
                  name: data.data.department.name,
                  id: data.data.department_id,
                }
              : null,
          paper_type_id:
            data.data.paper_type_id != null
              ? {
                  name: data.data.paper_type.name,
                  id: data.data.paper_type_id,
                }
              : null,
        });

        budget.length = 0;
        Object.assign(budget, data.data.budget);

        budget2.length = 0;
        Object.assign(budget2, data.data.budget2);

        budget3.length = 0;
        Object.assign(budget3, data.data.budget3);

        method_list.length = 0;
        Object.assign(method_list, data.data.method_list);

        researcher.length = 0;
        let new_rs = data.data.researcher.map((el: any) => {
          if (el.department_id != null) {
            el.department_id = {
              id: el.department_id,
              name: el.department.name,
            };
          }

          if (el.researcher_type != null) {
            el.researcher_type = researcher_types.find((x: any) => {
              return x.id == el.researcher_type;
            });
          }

          return el;
        });
        Object.assign(researcher, new_rs);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFileAttach = async () => {
      try {
        let params = { paper_id: props.paper_id };

        const { data } = await ApiService.query("file-attach/", {
          params: { ...params },
        });
        Object.assign(file_attach, data.data);
      } catch (error) {
        console.log(error);
      }
    };

    // Event
    const onClose = ({ reload = false }: { reload?: boolean }) => {
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    // Mounted
    onMounted(async () => {
      await fetchUser();
      await fetchItem();
      await fetchFileAttach();
      isLoading.value = false;
    });

    onUnmounted(() => {});

  
    // Return
    return {
      isLoading,
      convertDate: useDateData().convertDate,
      item,
      file_attach,
      onClose,
      generatePDF,
      html2Pdf,
      researcher,
      method_list,
      budget,
      budget2,
      budget3,
    };
  },
});
</script>

<style scoped>
/* @import "https://fonts.googleapis.com/css2?family=Sarabun&display=swap"; */
.generate-pdf {
  font-family: Sarabun, sans-serif;
}

.separator.separator-dotted {
  border-bottom-color: #ccc;
}
</style>

<style>
.generate-pdf {
  padding: 0mm 10mm 0mm 10mm;
}

.html2pdf__page-break {
  page-break-before: always; /* บังคับให้เริ่มหน้าใหม่ */
  height: 0; /* ซ่อนเส้นแบ่งหน้า */
}
</style>
