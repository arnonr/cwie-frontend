<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="main-modal"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">แบบฟอร์มใบสมัครโครงการ CWIE</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading">
          <form @submit.prevent="onSubmit">
            <div class="row">
              <template v-for="field in fields" :key="field.name">
                <CustomField
                  :label="field.label"
                  :select_label="field.select_label"
                  :field="field.model"
                  :component-type="field.type"
                  :colClass="field.colClass"
                  :disabled="field.disabled"
                  :options="field.options"
                />
                <div class="mb-10" v-if="field.name == 'company_id'">
                  <div class="row">
                    <div class="col-12 col-lg-6">
                      <label for="">ที่ตั้ง</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        v-model="company_address"
                      />
                    </div>
                    <div class="col-12 col-lg-6">
                      <label for="">จังหวัด/อำเภอ/ตำบล/ไปรษณีย์</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        :value="company_address_all"
                      />
                    </div>
                  </div>
                  <button
                    class="btn btn-info mt-6"
                    @click="onAddCompany"
                    type="button"
                  >
                    ไม่พบสถานประกอบการ คลิกปุ่ม
                  </button>
                </div>
              </template>
            </div>

            <div class="row">
              <div class="col-12 col-lg-5 mb-10">
                <div style="cursor: pointer">
                  <img
                    v-if="previewPhoto"
                    :src="previewPhoto"
                    class="mt-5"
                    style="width: 200px"
                    @click="openFileInput"
                  />
                  <img
                    v-if="
                      previewPhoto == null && item.namecard_file_old != null
                    "
                    :src="item.namecard_file_old"
                    alt=""
                    class="mt-5"
                    style="width: 200px"
                    @click="openFileInput"
                  />

                  <img
                    src="/media/avatars/name_card_blank.png"
                    v-if="
                      previewPhoto == null && item.namecard_file_old == null
                    "
                    alt=""
                    class="mt-5"
                    style="width: 400px"
                    @click="openFileInput"
                  />
                </div>
              </div>
              <div class="col-12 col-lg-7">
                <div class="mb-7 mt-lg-20">
                  <label for="namecard_file" class="required form-label"
                    >อัพโหลดนามบัตรผู้ประสานงาน <br />ไฟล์รูปภาพ PNG, JPG</label
                  >
                  <input
                    type="file"
                    id="formFile"
                    name="namecard_file"
                    accept="image/*"
                    @change="onPhotoFileChange"
                    ref="photoFile"
                    style="display: none"
                    :class="['form-control', { 'is-invalid': '' }]"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 text-center mb-5 mt-5">
                <span class="text-danger"
                  >**ตรวจสอบข้อมูลให้ถูกต้องก่อนกดปุ่มส่งข้อมูล**
                </span>
              </div>
              <div class="col-12 text-center">
                <button
                  ref="submitButtonRef"
                  type="submit"
                  id="kt_modal_new_address_submit"
                  class="btn btn-success"
                >
                  <span class="indicator-label"> ส่งข้อมูล </span>
                  <span class="indicator-progress">
                    Please wait...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Company Modal -->
    <div id="add-company-modal">
      <AddCompanyPage
        v-if="openAddCompanyModal == true"
        @close-modal="
          () => {
            openAddCompanyModal = false;
            mainModalRef.style.height = '';
            fetchCompanies2();
          }
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  toRefs,
  onBeforeUnmount,
  getCurrentInstance,
  computed,
  watch,
} from "vue";

import ApiService from "@/core/services/ApiService";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
// Vee validate
import { useForm } from "vee-validate";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
// Use Composables
import {
  fetchTeachers,
  fetchAddressAlls,
  fetchCompanies,
  fetchSemesters,
} from "@/composables/useFetchSelectionData";
// Components
import CustomField from "@/Components/field/CustomField.vue";
import useToast from "@/composables/useToast";

import AddCompanyPage from "@/views/company/Add.vue";

export default defineComponent({
  name: "add-form",
  components: {
    CustomField,
    AddCompanyPage,
  },
  props: {
    student_profile: {
      type: Object,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    // UI
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);
    const openAddCompanyModal = ref<any>(false);

    // Variable
    const { student_profile } = toRefs(props);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const isLoading = ref(true);
    const photoFile = ref<any>(null);
    const previewPhoto = ref<any>(null);

    const company_address = ref("");
    const company_address_all = ref("");
    const item = ref<any>({
      semester_id: null,
      start_date: null,
      end_date: null,
      division_head_id: null,
      faculty_head_id: null,
      company_id: null,
      co_name: "",
      co_position: "",
      co_phone: "",
      co_email: "",
      request_name: "",
      request_position: "",
      namecard_file: [],
    });

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const selectOptions = ref({
      address_alls: <any>[],
      visitors: <any>[],
      semesters: <any>[],
      companies: <any>[],
      division_heads: <any>[],
      faculty_heads: <any>[],
    });

    const fields = ref([
      {
        name: "semester_id",
        label: "ปีการศึกษา",
        model: "semester_id",
        type: "v-select",
        options: computed(() => selectOptions.value.semesters),
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "start_date",
        label: "วันที่ปฏิบัติสหกิจศึกษา",
        model: "start_date",
        type: "datepicker",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "start_date",
        label: "วันที่จบสหกิจศึกษา",
        model: "end_date",
        type: "datepicker",
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },

      {
        name: "division_head_id",
        label: "ประธานอาจารย์นิเทศประจำสาขาวิชา",
        model: "division_head_id",
        select_label: "fullname",
        type: "v-select",
        options: computed(() => selectOptions.value.division_heads),
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "faculty_head_id",
        label: "ประธานหลักสูตรสหกิจศึกษาของคณะ",
        model: "faculty_head_id",
        select_label: "fullname",
        type: "v-select",
        options: computed(() => selectOptions.value.faculty_heads),
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },

      {
        name: "company_id",
        label: "เลือกสถานประกอบการ",
        model: "company_id",
        select_label: "name",
        type: "v-select",
        options: computed(() => selectOptions.value.companies),
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "co_name",
        label: "คำนำหน้า ชื่อ-สกุล ผู้ประสานงาน",
        model: "co_name",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "co_position",
        label: "ตำแหน่ง ผู้ประสานงาน",
        model: "co_position",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "co_phone",
        label: "เบอร์โทรศัพท์ ผู้ประสานงาน",
        model: "co_phone",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "co_email",
        label: "Email ผู้ประสานงาน",
        model: "co_email",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },

      {
        name: "request_name",
        label: "คำนำหน้า ชื่อ-สกุล ผู้เรียนถึง (ใช้ในการออกหนังสือ)",
        model: "request_name",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "request_position",
        label: "ตำแหน่งผู้เรียนถึง (ใช้ในการออกหนังสือ)",
        model: "request_position",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
    ]);

    const validationSchema = Yup.object().shape({
      semester_id: Yup.object().required().label("ปีการศึกษา"),
      start_date: Yup.string().required().label("วันที่ปฏิบัติสหกิจศึกษา"),
      end_date: Yup.string().required().label("วันที่จบสหกิจศึกษา"),
      division_head_id: Yup.object()
        .required()
        .label("ประธานอาจารย์นิเทศประจำสาขาวิชา"),
      faculty_head_id: Yup.object()
        .required()
        .label("ประธานหลักสูตรสหกิจศึกษาของคณะ"),
      company_id: Yup.object().required().label("สถานประกอบการ"),
      co_name: Yup.string().required().label("คำนำหน้า ชื่อ-สกุล ผู้ประสานงาน"),
      co_position: Yup.string().required().label("ตำแหน่ง ผู้ประสานงาน"),
      co_phone: Yup.string().required().label("เบอร์โทรศัพท์ ผู้ประสานงาน"),
      co_email: Yup.string().required().label("Email ผู้ประสานงาน"),
      request_name: Yup.string().required().label("คำนำหน้า ชื่อ-สกุล"),
      request_position: Yup.string().required().label("ตำแหน่งผู้เรียนถึง"),
      namecard_file: Yup.mixed().nullable().label("รูปภาพนักศึกษา"),
    });

    // Fetch
    const fetchItem = async () => {
      isLoading.value = true;
      const { data } = await ApiService.query(`form/${props.id}`, {});

      item.value = data.data;

      item.value.semester_id = {
        id: data.data.semester_id,
        name:
          data.data.semester_detail.term + "/" + data.data.semester_detail.year,
      };

      item.value.semester_id = {
        id: data.data.semester_id,
        name:
          data.data.semester_detail.term + "/" + data.data.semester_detail.year,
      };

      item.value.division_head_id = {
        id: data.data.division_head_id,
        fullname:
          data.data.division_head_detail.prefix +
          data.data.division_head_detail.firstname +
          " " +
          data.data.division_head_detail.surname,
      };

      item.value.faculty_head_id = {
        id: data.data.faculty_head_id,
        fullname:
          data.data.faculty_head_detail.prefix +
          data.data.faculty_head_detail.firstname +
          " " +
          data.data.faculty_head_detail.surname,
      };

      item.value.company_id = {
        id: data.data.company_id,
        name: data.data.company_detail.name,
      };

      company_address.value = data.data.company_detail.address;

      item.value.namecard_file_old = data.data.namecard_file;

      resetToInitial();

      isLoading.value = false;
    };
    fetchItem();

    // Event
    const openFileInput = () => {
      photoFile.value.click();
    };

    const onPhotoFileChange = (event: any) => {
      item.value.namecard_file = event.target.files[0];
      if (item.value.namecard_file) {
        previewPhoto.value = URL.createObjectURL(item.value.namecard_file);
      } else {
        previewPhoto.value = null;
      }
    };

    const { handleSubmit, setValues, values } = useForm({
      validationSchema: validationSchema,
      initialValues: item.value,
    });

    const resetToInitial = () => {
      setValues(item.value);
    };

    const onSubmit = handleSubmit(async (values) => {
      const { namecard_file, ...otherValues } = values;

      Object.assign(item.value, otherValues);
      if (namecard_file instanceof File) {
        item.value.namecard_file = namecard_file;
      }

      if (
        item.value.namecard_file_old == null &&
        item.value.namecard_file.length == 0
      ) {
        useToast("รูปภาพนามบัตร จำเป็นต้องอัพโหลด", "error");
        return;
      }

      const {
        semester_id,
        start_date,
        end_date,
        division_head_id,
        faculty_head_id,
        company_id,
        co_name,
        co_position,
        co_phone,
        co_email,
        request_name,
        request_position,
      } = item.value;

      let data_send = {
        semester_id: semester_id?.id,
        start_date: dayjs(start_date).format("YYYY-MM-DD"),
        end_date: dayjs(end_date).format("YYYY-MM-DD"),
        division_head_id: division_head_id?.id,
        faculty_head_id: faculty_head_id?.id,
        company_id: company_id?.id,
        co_name,
        co_position,
        co_phone,
        co_email,
        request_name,
        request_position,
        namecard_file:
          item.value.namecard_file.length != 0
            ? item.value.namecard_file
            : undefined,
        send_at: dayjs().format("YYYY-MM-DD"),
        student_id: student_profile.value.id,
        form_status_id: item.value.reject_status_detail.form_status_id,
      };

      //   form_status_id: item.value.reject_status_detail.form_status_id,
      
      //   form_status_id ต้องย้อนกลับไปที่เดิม
      Swal.fire({
        title: "ยืนยันการแก้ไขใบสมัครโครงการสหกิจศึกษา",
        text: "เมื่อส่งใบสมัครแล้วจะไม่สามารถแก้ไขข้อมูลได้",
        icon: "warning",
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        heightAuto: false,
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-info",
        },
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          await ApiService.postFormData(`form/${item.value.id}`, {
            ...data_send,
          })
            .then(({ status }) => {
              if (status != 200) {
                throw new Error("ERROR");
              }
            })
            .catch(({ response }) => {
              console.log(response);
            });

          await ApiService.post(`student-profile/${student_profile.value.id}`, {
            status_id: data_send.form_status_id,
          })
            .then(({ status }) => {
              if (status != 200) {
                throw new Error("ERROR");
              }
            })
            .catch(({ response }) => {
              console.log(response);
            });

          useToast("ส่งข้อมูลเสร็จสิ้น", "success");
          onClose({ reload: true });
        } else {
        }
      });

      //
    });

    const onAddCompany = () => {
      mainModalRef.value.style.height = "0px";
      openAddCompanyModal.value = true;
    };

    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    const fetchCompanies2 = async () => {
      selectOptions.value.companies = await fetchCompanies({
        is_active: true,
      });
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );

      isLoading.value = true;

      selectOptions.value.semesters = await fetchSemesters({
        is_active: true,
      });

      selectOptions.value.semesters = selectOptions.value.semesters.map(
        (x: any) => {
          x.name = `${x.term}/${x.year}`;
          return x;
        }
      );

      selectOptions.value.division_heads = await fetchTeachers({
        department_id: student_profile.value.department_id,
        is_active: true,
        selectField: JSON.stringify({
          id: true,
          fullname: true,
        }),
      });

      selectOptions.value.faculty_heads = await fetchTeachers({
        faculty_id: student_profile.value.faculty_id,
        is_active: true,
        selectField: JSON.stringify({
          id: true,
          fullname: true,
        }),
      });

      await fetchCompanies2();

      selectOptions.value.address_alls = await fetchAddressAlls({});

      let caa = selectOptions.value.address_alls.find((x: any) => {
        return x.sub_district_id == item.value.company_detail.sub_district_id;
      });

      company_address_all.value = caa.label;
      isLoading.value = false;
    });

    onBeforeUnmount(() => {});

    // Return
    return {
      selectOptions,
      mainModalRef,
      onSubmit,
      onAddCompany,
      fields,
      item,
      isLoading,
      openFileInput,
      photoFile,
      previewPhoto,
      onPhotoFileChange,
      onClose,
      openAddCompanyModal,
      fetchCompanies2,
      values,
      company_address,
      company_address_all,
    };
  },
});
</script>

<style scoped></style>
