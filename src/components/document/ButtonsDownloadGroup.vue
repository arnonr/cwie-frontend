<template>
  <div>
    <div v-if="userData.group_id == 7">
      <button
        class="btn btn-outline btn-outline-info me-2 pe-sm-3 ps-sm-5 dropdown-toggle"
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
            :class="{ disabled: student_profile_item.status_id < 5 }"
            @click="student_profile_item.status_id > 5 && handleDownloadPDF1()"
            >ใบสมัครโครงการ</a
          >
        </li>
        <li>
          <a
            class="dropdown-item cursor-pointer"
            :class="{ disabled: student_profile_item.status_id < 7 }"
            n
            @click="student_profile_item.status_id > 6 && handleDownloadPDF2()"
            >หนังสือขอความอนุเคราะห์</a
          >
        </li>
        <li>
          <a
            class="dropdown-item cursor-pointer"
            :class="{ disabled: student_profile_item.status_id < 11 }"
            @click="student_profile_item.status_id > 10 && handleDownloadPDF3()"
            >หนังสือส่งตัว
          </a>
        </li>
      </ul>
    </div>
    <div v-if="userData.group_id != 7">
      <button
        class="btn btn-outline btn-outline-info me-2 pe-sm-3 ps-sm-5 dropdown-toggle"
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
            :class="{ disabled: student_profile_item.status_id < 2 }"
            @click="student_profile_item.status_id > 1 && handleDownloadPDF1()"
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
            :class="{ disabled: student_profile_item.status_id < 11 }"
            @click="student_profile_item.status_id > 10 && handleDownloadPDF3()"
            >หนังสือส่งตัว
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from "vue";
import useDateData from "@/composables/useDateData";
import { fetchAddressAlls } from "@/composables/useFetchSelectionData";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import thSarabunNewTTf from "@/assets/fonts/THSarabunNew.ttf";
import thSarabunNewBold from "@/assets/fonts/THSarabunNew-Bold.ttf";
import registerBook from "@/assets/books/register_book_template.pdf";
import requestBook from "@/assets/books/request_book_template.pdf";

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
    const { student_profile_item, item } = toRefs(props);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const selectOptions = ref({
      address_alls: <any>[],
    });
    const fetchAddress = async () => {
      selectOptions.value.address_alls = await fetchAddressAlls({});
    };
    fetchAddress();

    // fetch

    const handleDownloadPDF1 = async () => {
      const urlFont = thSarabunNewTTf;
      const urlFontBold = thSarabunNewBold;
      const fontBytes = await fetch(urlFont).then((res) => res.arrayBuffer());
      const fontBytesBold = await fetch(urlFontBold).then((res) =>
        res.arrayBuffer()
      );
      let url = "";
      url = registerBook;

      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );
      const pdfTemplate = await PDFDocument.load(existingPdfBytes);

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const sarabunFont = await pdfDoc.embedFont(fontBytes);
      const sarabunBoldFont = await pdfDoc.embedFont(fontBytesBold);

      const defaultSize = {
        size: 16,
        font: sarabunFont,
        color: rgb(0, 0, 0),
      };

      const [existingPage] = await pdfDoc.copyPages(pdfTemplate, [0]);
      pdfDoc.addPage(existingPage);

      const { width, height } = existingPage.getSize();
      const fontSize = 16;

      existingPage.drawText(item.value.semester_detail.term.toString(), {
        x: 325, //คอลัมน์ ซ้ายไปขวา
        y: 666, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      existingPage.drawText(item.value.semester_detail.year.toString(), {
        x: 350, //คอลัมน์ ซ้ายไปขวา
        y: 666, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      const getImageOrFallback = (path: any, fallback: any) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = path;
          img.onload = () => resolve(path);
          img.onerror = () => resolve(fallback);
        });
      };
      const photoUrl = student_profile_item.value.photo_file;

      if (photoUrl) {
        const link = await getImageOrFallback(photoUrl, "").then(
          (result: any) => {
            console.log(result);
            return result;
          }
        );

        if (link != "") {
          const photoImageBytes = await fetch(photoUrl).then((res) =>
            res.arrayBuffer()
          );

          let photoImage: any;
          try {
            photoImage = await pdfDoc.embedPng(photoImageBytes);
          } catch (error) {
            photoImage = await pdfDoc.embedJpg(photoImageBytes);
          }

          existingPage.drawImage(photoImage, {
            x: 473,
            y: 682,
            width: 70,
            height: 90,
          });
        }
      }

      existingPage.drawText(
        student_profile_item.value.prefix +
          student_profile_item.value.firstname +
          " " +
          student_profile_item.value.surname,
        {
          x: 210,
          y: 632,
          ...defaultSize,
        }
      );
      existingPage.drawText(student_profile_item.value.student_code, {
        x: 180,
        y: 612,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.class_year.toString(), {
        x: 430,
        y: 612,
        ...defaultSize,
      });

      existingPage.drawText(
        student_profile_item.value.advisor_detail.prefix +
          student_profile_item.value.advisor_detail.firstname +
          " " +
          student_profile_item.value.advisor_detail.surname,
        {
          x: 150,
          y: 591,
          ...defaultSize,
        }
      );

      existingPage.drawText(
        student_profile_item.value.faculty_detail.name.replace("คณะ", ""),
        {
          x: 382, //คอลัมน์ ซ้ายไปขวา
          y: 591,
          ...defaultSize,
        }
      );

      existingPage.drawText(student_profile_item.value.department_detail.name, {
        x: 110,
        y: 570, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.division_detail.name, {
        x: 370,
        y: 570, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.phone, {
        x: 140,
        y: 549,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.email, {
        x: 282,
        y: 549,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.gpa.toString(), {
        x: 502,
        y: 549,
        ...defaultSize,
      });

      existingPage.drawText(item.value.semester_detail.term.toString(), {
        x: 360,
        y: 528,
        ...defaultSize,
      });

      existingPage.drawText(item.value.semester_detail.year.toString(), {
        x: 382,
        y: 528,
        ...defaultSize,
      });

      existingPage.drawText(
        useDateData().convertFullDate(item.value.start_date),
        {
          x: 460,
          y: 528,
          ...defaultSize,
        }
      );

      existingPage.drawText(
        useDateData().convertFullDate(item.value.end_date),
        {
          x: 105,
          y: 507,
          ...defaultSize,
        }
      );

      existingPage.drawText(item.value.company_detail.name, {
        x: 190,
        y: 476,
        ...defaultSize,
      });

      existingPage.drawText(item.value.company_detail.address, {
        x: 95,
        y: 455,
        ...defaultSize,
      });

      existingPage.drawText(
        convertAddress(item.value.company_detail.sub_district_id),
        {
          x: 170,
          y: 414,
          ...defaultSize,
        }
      );

      existingPage.drawText(
        item.value.company_detail.phone == null
          ? ""
          : item.value.company_detail.phone,
        {
          x: 100,
          y: 394,
          ...defaultSize,
        }
      );

      existingPage.drawText(
        item.value.company_detail.email == null
          ? ""
          : item.value.company_detail.email,
        {
          x: 310,
          y: 394,
          ...defaultSize,
        }
      );

      existingPage.drawText(student_profile_item.value.contact1_name, {
        x: 250,
        y: 359,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.contact1_relation, {
        x: 135,
        y: 338,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.contact1_phone, {
        x: 275,
        y: 338,
        ...defaultSize,
      });

      existingPage.drawText(item.value.request_name, {
        x: 120,
        y: 283,
        ...defaultSize,
      });

      existingPage.drawText(item.value.request_position, {
        x: 400,
        y: 283,
        ...defaultSize,
      });

      existingPage.drawText(
        student_profile_item.value.firstname +
          " " +
          student_profile_item.value.surname,
        {
          x: 365,
          y: 172,
          ...defaultSize,
        }
      );

      existingPage.drawText(
        useDateData().convertFullDate(item.value.division_head_approved_at),
        {
          x: 388,
          y: 148,
          ...defaultSize,
        }
      );

      const [existingPage2] = await pdfDoc.copyPages(pdfTemplate, [1]);
      pdfDoc.addPage(existingPage2);
      existingPage2.drawText(
        student_profile_item.value.advisor_detail.prefix +
          student_profile_item.value.advisor_detail.firstname +
          " " +
          student_profile_item.value.advisor_detail.surname,
        {
          x: 249,
          y: 465,
          ...defaultSize,
        }
      );

      existingPage2.drawText(
        useDateData().convertFullDate(item.value.advisor_verified_at),
        {
          x: 260,
          y: 443,
          ...defaultSize,
        }
      );

      existingPage2.drawText(
        item.value.division_head_detail.prefix +
          item.value.division_head_detail.firstname +
          " " +
          item.value.division_head_detail.surname,
        {
          x: 250,
          y: 256,
          ...defaultSize,
        }
      );

      existingPage2.drawText(
        useDateData().convertFullDate(item.value.division_head_approved_at),
        {
          x: 260,
          y: 235,
          ...defaultSize,
        }
      );

      const pdfBytes = await pdfDoc.save();
      let objectPdf = URL.createObjectURL(
        new Blob([pdfBytes.buffer], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = objectPdf;
      link.download = "register_book.pdf";
      link.click();
    };

    const handleDownloadPDF2 = async () => {
      const urlFont = thSarabunNewTTf; //window.location.origin + "/storage/THSarabunNew.ttf";
      const urlFontBold = thSarabunNewBold;
      // window.location.origin + "/storage/THSarabunNewBold.ttf";
      const fontBytes = await fetch(urlFont).then((res) => res.arrayBuffer());
      const fontBytesBold = await fetch(urlFontBold).then((res) =>
        res.arrayBuffer()
      );
      let url = "";
      url = requestBook;

      //   window.location.origin + "/storage/pdf/register_book.pdf";

      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );
      const pdfTemplate = await PDFDocument.load(existingPdfBytes);

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      //   const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const sarabunFont = await pdfDoc.embedFont(fontBytes);
      const sarabunBoldFont = await pdfDoc.embedFont(fontBytesBold);

      const defaultSize = {
        size: 16,
        font: sarabunFont,
        color: rgb(0, 0, 0),
      };

      const [existingPage] = await pdfDoc.copyPages(pdfTemplate, [0]);
      pdfDoc.addPage(existingPage);

      const { width, height } = existingPage.getSize();
      const fontSize = 16;

      existingPage.drawText(item.value.request_document_number.toString(), {
        x: 150, //คอลัมน์ ซ้ายไปขวา
        y: 757, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      existingPage.drawText(
        useDateData().convertFullDate(item.value.request_document_date),
        {
          x: 300,
          y: 660,
          ...defaultSize,
        }
      );

      let request_name = "";
      if (item.value.request_name == "-") {
        request_name = item.value.request_position;
      } else {
        request_name =
          item.value.request_name + " (" + item.value.request_position + ")";
      }

      existingPage.drawText(request_name, {
        x: 105,
        y: 585,
        ...defaultSize,
      });

      existingPage.drawText(item.value.company_detail.name, {
        x: 105, //คอลัมน์ ซ้ายไปขวา
        y: 560, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      existingPage.drawText(
        student_profile_item.value.faculty_detail.name.replace("คณะ", ""),
        {
          x: 250, //คอลัมน์ ซ้ายไปขวา
          y: 403, //แถว ยิ่งมากยิ่งอยู่ด้านบน
          ...defaultSize,
        }
      );

      existingPage.drawText(student_profile_item.value.division_detail.name, {
        x: 120, //คอลัมน์ ซ้ายไปขวา
        y: 379, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      //   existingPage.drawText(item.value.semester_detail.term.toString(), {
      //     x: 291,
      //     y: 345,
      //     ...defaultSize,
      //   });

      //   existingPage.drawText(item.value.semester_detail.year.toString(), {
      //     x: 358,
      //     y: 345,
      //     ...defaultSize,
      //   });

      existingPage.drawText(
        useDateData().convertFullDate(item.value.start_date),
        {
          x: 210,
          y: 355,
          ...defaultSize,
        }
      );

      existingPage.drawText(
        useDateData().convertFullDate(item.value.end_date),
        {
          x: 332,
          y: 355,
          ...defaultSize,
        }
      );

      existingPage.drawText(student_profile_item.value.firstname, {
        x: 104,
        y: 321,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.surname, {
        x: 248,
        y: 321,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.class_year.toString(), {
        x: 390,
        y: 321,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.student_code, {
        x: 465,
        y: 321,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.email, {
        x: 160,
        y: 300,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.phone, {
        x: 410,
        y: 300,
        ...defaultSize,
      });

      //   const sigUrl = chairman.value.signature_file;
      //   const sigImageBytes = await fetch(sigUrl).then((res) =>
      //     res.arrayBuffer()
      //   );

      //   let sigImage;
      //   try {
      //     sigImage = await pdfDoc.embedPng(sigImageBytes);
      //   } catch (error) {
      //     sigImage = await pdfDoc.embedJpg(sigImageBytes);
      //   }

      //   existingPage.drawImage(sigImage, {
      //     x: 310,
      //     y: 120,
      //     width: 100,
      //     height: 50,
      //   });

      //   existingPage.drawText(
      //     chairman.value.prefix +
      //       " " +
      //       chairman.value.firstname +
      //       " " +
      //       chairman.value.surname,
      //     {
      //       x: 300,
      //       y: 117,
      //       ...defaultSize,
      //     }
      //   );

      //   existingPage.drawText(chairman.value.executive_position, {
      //     x: 275,
      //     y: 96,
      //     ...defaultSize,
      //   });

      const pdfBytes = await pdfDoc.save();
      let objectPdf = URL.createObjectURL(
        new Blob([pdfBytes.buffer], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = objectPdf;
      link.download =
        "request_book_" + student_profile_item.value.student_code + ".pdf";
      link.click();
    };

    const handleDownloadPDF3 = async () => {
      const urlFont = thSarabunNewTTf; //window.location.origin + "/storage/THSarabunNew.ttf";
      const urlFontBold = thSarabunNewBold;
      // window.location.origin + "/storage/THSarabunNewBold.ttf";
      const fontBytes = await fetch(urlFont).then((res) => res.arrayBuffer());
      const fontBytesBold = await fetch(urlFontBold).then((res) =>
        res.arrayBuffer()
      );
      let url = "";
      url = requestBook;

      //   window.location.origin + "/storage/pdf/register_book.pdf";

      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );
      const pdfTemplate = await PDFDocument.load(existingPdfBytes);

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      //   const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const sarabunFont = await pdfDoc.embedFont(fontBytes);
      const sarabunBoldFont = await pdfDoc.embedFont(fontBytesBold);

      const defaultSize = {
        size: 16,
        font: sarabunFont,
        color: rgb(0, 0, 0),
      };

      const [existingPage] = await pdfDoc.copyPages(pdfTemplate, [0]);
      pdfDoc.addPage(existingPage);

      const { width, height } = existingPage.getSize();
      const fontSize = 16;

      existingPage.drawText(item.value.send_document_number.toString(), {
        x: 150, //คอลัมน์ ซ้ายไปขวา
        y: 757, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      existingPage.drawText(
        useDateData().convertFullDate(item.value.send_document_date),
        {
          x: 300,
          y: 660,
          ...defaultSize,
        }
      );

      let request_name = "";
      if (item.value.request_name == "-") {
        request_name = item.value.request_position;
      } else {
        request_name =
          item.value.request_name + " (" + item.value.request_position + ")";
      }

      existingPage.drawText(request_name, {
        x: 105,
        y: 585,
        ...defaultSize,
      });

      existingPage.drawText(item.value.company_detail.name, {
        x: 105, //คอลัมน์ ซ้ายไปขวา
        y: 560, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      existingPage.drawText(
        student_profile_item.value.faculty_detail.name.replace("คณะ", ""),
        {
          x: 250, //คอลัมน์ ซ้ายไปขวา
          y: 403, //แถว ยิ่งมากยิ่งอยู่ด้านบน
          ...defaultSize,
        }
      );

      existingPage.drawText(student_profile_item.value.division_detail.name, {
        x: 120, //คอลัมน์ ซ้ายไปขวา
        y: 379, //แถว ยิ่งมากยิ่งอยู่ด้านบน
        ...defaultSize,
      });

      existingPage.drawText(
        useDateData().convertFullDate(item.value.start_date),
        {
          x: 210,
          y: 355,
          ...defaultSize,
        }
      );

      existingPage.drawText(
        useDateData().convertFullDate(item.value.end_date),
        {
          x: 330,
          y: 355,
          ...defaultSize,
        }
      );

      existingPage.drawText(student_profile_item.value.firstname, {
        x: 104,
        y: 320,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.surname, {
        x: 248,
        y: 320,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.class_year.toString(), {
        x: 390,
        y: 320,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.student_code, {
        x: 460,
        y: 320,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.email, {
        x: 170,
        y: 300,
        ...defaultSize,
      });

      existingPage.drawText(student_profile_item.value.phone, {
        x: 410,
        y: 300,
        ...defaultSize,
      });

      //   const sigUrl = chairman.value.signature_file;
      //   const sigImageBytes = await fetch(sigUrl).then((res) =>
      //     res.arrayBuffer()
      //   );

      //   let sigImage;
      //   try {
      //     sigImage = await pdfDoc.embedPng(sigImageBytes);
      //   } catch (error) {
      //     sigImage = await pdfDoc.embedJpg(sigImageBytes);
      //   }

      //   existingPage.drawImage(sigImage, {
      //     x: 310,
      //     y: 120,
      //     width: 100,
      //     height: 50,
      //   });

      //   existingPage.drawText(
      //     chairman.value.prefix +
      //       " " +
      //       chairman.value.firstname +
      //       " " +
      //       chairman.value.surname,
      //     {
      //       x: 300,
      //       y: 117,
      //       ...defaultSize,
      //     }
      //   );

      //   existingPage.drawText(chairman.value.executive_position, {
      //     x: 275,
      //     y: 96,
      //     ...defaultSize,
      //   });

      const pdfBytes = await pdfDoc.save();
      let objectPdf = URL.createObjectURL(
        new Blob([pdfBytes.buffer], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = objectPdf;
      link.download =
        "sent_book_" + student_profile_item.value.student_code + ".pdf";
      link.click();
    };

    const convertAddress = (sub_district_id: any) => {
      if (sub_district_id == null) return "";
      let ad = selectOptions.value.address_alls.find((x: any) => {
        return x.sub_district_id == sub_district_id;
      });
      return `${ad?.province} > ${ad?.district} > ${ad?.sub_district} > ${ad?.post_code}`;
    };

    return {
      item,
      handleDownloadPDF1,
      handleDownloadPDF2,
      handleDownloadPDF3,
      convertFullDate: useDateData().convertFullDate,
      userData,
      convertAddress,
    };
  },
});
</script>
