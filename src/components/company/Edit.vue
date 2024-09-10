<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="company-modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">แบบฟอร์มแแก้ไขข้อมูลสถานประกอบการ</h3>
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
              </template>
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
                  <span class="indicator-label"> บันทึกข้อมูล </span>
                  <span class="indicator-progress">
                    Please wait...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>

                <button
                  @click="onClose({ reload: false })"
                  type="button"
                  class="btn btn-danger ms-2"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
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
} from "vue";

import ApiService from "@/core/services/ApiService";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
// Vee validate
import { useForm } from "vee-validate";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
// Use Composables
import { fetchAddressAlls } from "@/composables/useFetchSelectionData";
// Components
import CustomField from "@/components/field/CustomField.vue";
import useToast from "@/composables/useToast";

export default defineComponent({
  name: "edit-company-form",
  components: {
    CustomField,
  },
  props: {
    id: Number,
  },
  setup(props, { emit }) {
    // UI
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const isLoading = ref(true);

    const item = ref<any>({
      name: "",
      address: "",
      address_all: null,
      phone: "",
      email: "",
      website: "",
    });

    const instance = getCurrentInstance();
    const dayjs = instance?.appContext.config.globalProperties.$dayjs;

    const selectOptions = ref({
      address_alls: <any>[],
    });

    const fields = ref([
      {
        name: "name",
        label: "ชื่อสถานประกอบการ โปรดระบุชื่อเต็ม (ใช้ในการออกหนังสือ)",
        model: "name",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "phone",
        label: "เบอร์โทรศัพท์",
        model: "phone",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "email",
        label: "Email",
        model: "email",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-6",
        disabled: false,
      },
      {
        name: "website",
        label: "Website/Facebook Page",
        model: "website",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "address",
        label: "ที่ตั้งสถานประกอบการ",
        model: "address",
        type: "text",
        options: [],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "address_all",
        label: "จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์",
        model: "address_all",
        select_label: "label",
        type: "v-select",
        options: computed(() => selectOptions.value.address_alls),
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
      {
        name: "blacklist",
        label: "Blacklist",
        model: "blacklist",
        select_label: "name",
        type: "v-select",
        options: [
          { id: 1, type: true, name: "Yes" },
          { id: 2, type: false, name: "No" },
        ],
        placeholder: "",
        colClass: "col-lg-12",
        disabled: false,
      },
    ]);

    const validationSchema = Yup.object().shape({
      name: Yup.string().required().label("ชื่อสถานประกอบการ"),
      phone: Yup.string().required().label("เบอร์โทรศัพท์"),
      email: Yup.string().required().label("เมล"),
      website: Yup.string().required().label("Website"),
      address: Yup.string().required().label("ที่ตั้งสถานประกอบการ"),
      address_all: Yup.object()
        .required()
        .label("จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์"),
    });

    // fetch
    const fetchItem = async () => {
      const { data } = await ApiService.query(`company/${props.id}`, {});

      const {
        phone,
        email,
        website,
        name,
        address,
        province_id,
        province_detail,
        sub_district_id,
        blacklist,
      } = data.data;

      let address_all = selectOptions.value.address_alls.find((x: any) => {
        return x.sub_district_id == sub_district_id;
      });
      item.value = {
        ...data.data,
        blacklist:
          blacklist == true
            ? {
                id: 1,
                type: true,
                name: "Yes",
              }
            : {
                id: 2,
                type: false,
                name: "No",
              },
        address_all: address_all,
      };

      setValues(item.value);
    };

    // Event

    const { handleSubmit, setValues } = useForm({
      validationSchema: validationSchema,
      initialValues: item.value,
    });

    const onSubmit = handleSubmit(async (values) => {
      const { ...otherValues } = values;

      Object.assign(item.value, otherValues);

      const { name, phone, email, website, address, address_all, blacklist } =
        item.value;

      const { province_id, district_id, sub_district_id } = address_all;

      let data_send = {
        name,
        phone,
        email,
        website,
        address,
        province_id,
        district_id,
        sub_district_id,
        blacklist: blacklist?.type,
      };

      console.log(data_send);

      Swal.fire({
        title: "ยืนยันการแก้ไข",
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
          await ApiService.post(`company/${props.id}`, {
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

          useToast("แก้ไขข้อมูลเสร็จสิ้น", "success");
          onClose({ reload: true });
        } else {
        }
      });

      //
    });

    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();

      emit("close-modal");
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );

      isLoading.value = true;

      selectOptions.value.address_alls = await fetchAddressAlls({});
      fetchItem();
      isLoading.value = false;
    });

    onBeforeUnmount(() => {});

    // Return
    return {
      selectOptions,
      mainModalRef,
      onSubmit,
      fields,
      item,
      isLoading,
      onClose,
    };
  },
});
</script>

<style scoped></style>
