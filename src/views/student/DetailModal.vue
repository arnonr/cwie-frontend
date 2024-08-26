<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="main-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">ข้อมูลสาระสำคัญของโครงการ</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading">
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

            <div class="mx-auto text-center mt-5">
              <button
                @click="generatePDF"
                type="button"
                class="btn btn-success"
                :disabled="true"
                v-if="item.status_id != 1"
              >
                พิมพ์ข้อมูล
              </button>

              <button
                @click="generatePDF1"
                type="button"
                class="btn btn-primary ms-2"
                :disabled="true"
                v-if="item.status_id != 1"
              >
                พิมพ์บันทึกข้อความ
              </button>
            </div>
          </div>
        </div>
        <Preloader :isLoading="isLoading" :position="'absolute'" />
        <Preloader :isLoading="isLoading1" :position="'absolute'" />
      </div>
    </div>

    <!-- PDF -->
    <!-- <vue3-html2pdf
      filename="rp_data"
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a4"
      pdf-orientation="portrait"
      :paginate-elements-by-height="1400"
      :margin="{ top: '50px', bottom: '50px', left: '20px', right: '20px' }"
      :pdf-content-selector="'.generate-pdf'"
      ref="html2Pdf"
      :page-break-before="false"
      :insert-page-break="true"
    >
      <template v-slot:pdf-content>
        <div class="generate-pdf">
          <div class="pdf-section">
            <SectionPDF1 :item="item" />
          </div>

          <div class="pdf-section page-break">
            <SectionPDF2
              :item="item"
              :researcher="researcher"
              :method_list="method_list"
            />
          </div>

          <div class="pdf-section page-break">
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
    </vue3-html2pdf> -->

    <div ref="htmlPdf">
      <!-- <div class="generate-pdf">
        <div class="pdf-section">
          <SectionPDF1 :item="item" />
        </div>

        <div class="pdf-section">
          <SectionPDF2
            :item="item"
            :researcher="researcher"
            :method_list="method_list"
          />
        </div>

        <div class="pdf-section">
          <SectionPDF3
            :item="item"
            :budget="budget"
            :budget2="budget2"
            :budget3="budget3"
            :file_attach="file_attach"
          />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
// PDF
import { jsPDF } from "jspdf";
// import Vue3Html2pdf from "vue3-html2pdf";
// import html2pdf from "html2pdf.js";
//

import pdfMake from "pdfmake/build/pdfmake";
import { pdfMake as pdfFonts } from "pdfmake/build/vfs_fonts";
import thSarabunNew from "@/assets/fonts/THSarabunNew.js";
import htmlToPdfMake from "html-to-pdfmake";

// if (!pdfMake.vfs) {
//   pdfMake.vfs = pdfFonts.pdfMake.vfs;
// }

// pdfMake.vfs["THSarabunNew.ttf"] = thSarabunNew;

pdfMake.fonts = {
  THSarabunNew: {
    normal: "THSarabunNew.ttf",
    bold: "THSarabunNew-Bold.ttf",
    italics: "THSarabunNew-Italic.ttf",
    bolditalics: "THSarabunNew-BoldItalic.ttf",
  },
};

// กำหนดฟอนต์ภาษาไทย (ต้องมีไฟล์ฟอนต์ที่รองรับภาษาไทย)
// import thSarabunNew from "@/assets/fonts/THSarabunNew-Italic.ttf";
// import thSarabunNew from "@/assets/fonts/THSarabunNew-Bold.ttf";
// import thSarabunNew from "@/assets/fonts/THSarabunNew-BoldItalic.ttf";

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
  name: "paper-detail-modal",
  props: {
    paper_id: {
      type: Number,
      required: true,
    },
  },
  components: {
    dayjs,
    Preloader,
    jsPDF,
    // Vue3Html2pdf,
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
    const isLoading1 = ref<any>(false);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);
    const htmlPdf = ref<any>(null);

    const margin = {
      top: "20cm",
      bottom: "20cm",
      left: "0cm",
      right: "0cm",
    };

    // Variable
    const selectOptions = ref({});
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

    const generatePDF = async () => {
      const html = htmlPdf.value;

      let content: any;
      try {
        content = htmlToPdfMake(html);
      } catch (error) {
        console.error("Error converting HTML to pdfMake:", error);
        return; // หรือจัดการกับข้อผิดพลาดตามที่คุณต้องการ
      }

      const documentDefinition = {
        pageSize: "A4",
        pageMargins: [72, 72, 72, 72], // 1 inch margins

        defaultStyle: {
          font: "THSarabunNew",
          fontSize: 16,
          lineHeight: 1.5,
        },

        content: { ...content },
      };

      pdfMake.createPdf(documentDefinition).download("output.pdf");
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
          paper_kind_id:
            data.data.paper_kind_id != null
              ? {
                  name: data.data.paper_kind.name,
                  id: data.data.paper_kind_id,
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
      mainModalObj.value.hide();
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );

      await fetchUser();
      await fetchItem();
      await fetchFileAttach();
      isLoading.value = false;
    });

    onUnmounted(() => {
      if (mainModalRef.value) {
        mainModalRef.value.addEventListener("hidden.bs.modal", () =>
          onClose({ reload: false })
        );
      }
      mainModalObj.value.hide();
      emit("close-modal");
    });

    const generatePDF1 = () => {
      const documentDefinition = {
        pageSize: "A4",
        pageMargins: [72, 72, 72, 72], // 1 inch margins

        defaultStyle: {
          font: "THSarabunNew",
          fontSize: 16,
          lineHeight: 1.5,
        },

        content: [
          { text: "ที่ ศธ 0506(5)/ว569", alignment: "right" },
          "\n\n",
          {
            columns: [
              {
                width: "*",
                text: "กระทรวงศึกษาธิการ\nกทม. 10300",
              },
              {
                width: "auto",
                text: "15 พฤษภาคม 2566",
              },
            ],
          },
          "\n\n",
          { text: "เรื่อง   ขอเชิญประชุม", marginBottom: 10 },
          { text: "เรียน   อธิการบดีมหาวิทยาลัยราชภัฏ", marginBottom: 10 },
          {
            text: "สิ่งที่ส่งมาด้วย   1. ระเบียบวาระการประชุม   จำนวน 1 ฉบับ",
            marginBottom: 10,
          },
          {
            text: [
              { text: "                    ด้วย", marginBottom: 10 },
              "สำนักงานปลัดกระทรวงศึกษาธิการ กำหนดจัดประชุมคณะกรรมการการอุดมศึกษา ครั้งที่ 5/2566 ในวันพุธที่ 24 พฤษภาคม 2566 เวลา 13.30 น. ณ ห้องประชุมศาสตราจารย์วิจิตร ศรีสอ้าน ชั้น 5 สำนักงานปลัดกระทรวงศึกษาธิการ",
            ],
            marginBottom: 10,
          },
          {
            text: "                    จึงเรียนมาเพื่อโปรดทราบและเข้าร่วมประชุมตามวัน เวลา และสถานที่ดังกล่าว",
            marginBottom: 20,
          },
          {
            text: "ขอแสดงความนับถือ",
            alignment: "center",
            marginBottom: 50,
          },
          {
            text: "(นายวีระ แข็งกสิการ)\nปลัดกระทรวงศึกษาธิการ",
            alignment: "center",
          },
        ],
      };

      pdfMake.createPdf(documentDefinition).download("หนังสือราชการ.pdf");
    };
    // Return
    return {
      isLoading,
      isLoading1,
      mainModalRef,
      convertDate: useDateData().convertDate,
      item,
      file_attach,
      onClose,
      generatePDF,
      htmlPdf,
      researcher,
      method_list,
      budget,
      budget2,
      budget3,
      generatePDF1,
      margin,
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

.pdf-section {
  margin: 50px 20px;
  page-break-after: always;
  min-height: 297mm; /* A4 height */
  box-sizing: border-box;
  padding-bottom: 50px; /* เพิ่ม padding ด้านล่างเพื่อให้แน่ใจว่ามี space */
  position: relative;
}

/* จัดการ overflow content */
.pdf-section::after {
  content: "";
  display: block;
  height: 50px; /* ความสูงเท่ากับ bottom margin */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white; /* หรือสีพื้นหลังของคุณ */
}

@media print {
  .pdf-section {
    margin: 0;
    padding: 50px 20px;
  }
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

.page-break {
  page-break-before: always;
}

/* @media print {
  .pdf-section {
    margin-bottom: 50px; 
  }
} */
</style>
