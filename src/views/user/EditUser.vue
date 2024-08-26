<template>
  <div class="modal fade" tabindex="-1" ref="mainModalRef" id="main-modal">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">แก้ไขข้อมูล</h3>
          <button
            @click="onClose"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="container" v-if="item">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <!-- <div class="col-md-12 mb-5">
                    <h4 class="color-primary">สถานะผู้ใช้งาน</h4>
                  </div> -->
                  <!-- <div class="col-md-12 mb-7">
                    <label class="form-label required">สถานะ</label>
                    <v-select
                      label="name"
                      name="status"
                      placeholder="สถานะ"
                      :options="selectOptions.user_statuses"
                      class="form-control form-control-lg"
                      :clearable="false"
                      v-model="item.status"
                    >
                    </v-select>
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="status" />
                      </div>
                    </div>
                  </div> -->

                  <div class="col-md-12 mb-5 mt-5">
                    <h4 class="color-primary">ข้อมูลผู้ใช้งาน</h4>
                  </div>

                  <div class="col-md-4 mb-7">
                    <label class="form-label required">คำนำหน้า</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="คำนำหน้า"
                      aria-label="คำนำหน้า"
                      v-model="item.prefix_name"
                    />

                    <div
                      class="d-block mt-1"
                      v-if="errors.prefix_name.error == 1"
                    >
                      <span role="alert" class="text-danger">{{
                        errors.prefix_name.text
                      }}</span>
                    </div>
                  </div>

                  <div class="col-md-4 mb-7">
                    <label for="firstname" class="required form-label"
                      >ชื่อ</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      placeholder="ชื่อ"
                      aria-label="ชื่อ"
                      v-model="item.firstname"
                    />
                    <div
                      class="d-block mt-1"
                      v-if="errors.firstname.error == 1"
                    >
                      <span role="alert" class="text-danger">{{
                        errors.firstname.text
                      }}</span>
                    </div>
                  </div>

                  <div class="col-md-4 mb-7">
                    <label for="surname" class="required form-label"
                      >นามสกุล</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      placeholder="นามสกุล"
                      aria-label="นามสกุล"
                      v-model="item.surname"
                    />
                    <div class="d-block mt-1" v-if="errors.surname.error == 1">
                      <span role="alert" class="text-danger">{{
                        errors.surname.text
                      }}</span>
                    </div>
                  </div>

                  <div class="col-md-4 mb-7">
                    <label for="email" class="required form-label">อีเมล</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="อีเมล"
                      aria-label="อีเมล"
                      v-model="item.email"
                    />
                    <div class="d-block mt-1" v-if="errors.email.error == 1">
                      <span role="alert" class="text-danger">{{
                        errors.email.text
                      }}</span>
                    </div>
                  </div>

                  <div class="col-md-8 mb-7">
                    <label for="department_id" class="form-label required"
                      >หน่วยงาน</label
                    >
                    <v-select
                      name="department_id"
                      label="name"
                      :options="selectOptions.departments"
                      class="form-control"
                      :clearable="false"
                      v-model="item.department_id"
                    >
                    </v-select>
                    <div
                      class="d-block mt-1"
                      v-if="errors.department_id.error == 1"
                    >
                      <span role="alert" class="text-danger">{{
                        errors.department_id.text
                      }}</span>
                    </div>
                  </div>

                  <div class="col-md-12 mb-7">
                    <button
                      class="finish-button btn text-white btn-success"
                      @click="onValidate()"
                    >
                      บันทึก
                    </button>
                    <button
                      class="btn text-white btn-danger ms-2"
                      @click="onClose"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
import ApiService from "@/core/services/ApiService";

import { ErrorMessage, Field, Form as VForm } from "vee-validate";

// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// Import Datepicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// Import Yup Validate
import * as Yup from "yup";
// Use Toast Composables
import useToast from "@/composables/useToast";

// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

// Use Composables
import useMasterData from "@/composables/useMasterData";

export default defineComponent({
  name: "edit-user",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  components: {
    vSelect,
    VueDatePicker,
    dayjs,
    Field,
    VForm,
    ErrorMessage,
  },
  setup(props, context) {
    // Variable
    const emit = context.emit;
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    const selectOptions = ref({
      departments: [],
    });

    const item = reactive<any>({});
    const errors = ref<any>({
      prefix_name: { error: 0, text: "" },
      firstname: { error: 0, text: "" },
      surname: { error: 0, text: "" },
      department_id: { error: 0, text: "" },
      level: { error: 0, text: "" },
      email: { error: 0, text: "" },
    });

    const validationItemSchema = Yup.object().shape({
      prefix_name: Yup.string()
        .required("${path} จำเป็นต้องระบุ")
        .label("คำนำหน้า"),
      firstname: Yup.string().required("${path} จำเป็นต้องระบุ").label("ชื่อ"),
      surname: Yup.string().required("${path} จำเป็นต้องระบุ").label("นามสกุล"),
      email: Yup.string()
        .email()
        .required("${path} จำเป็นต้องระบุ")
        .label("อีเมล"),
      department_id: Yup.object()
        .required("${path} จำเป็นต้องระบุ")
        .label("หน่วยงาน"),
    });

    // Fetch
    const fetchUser = async () => {
      try {
        const { data } = await ApiService.query("user/" + props.id, {});

        Object.assign(item, {
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

    //Event
    const onClose = () => {
      mainModalObj.value.hide();
      emit("close-modal");
    };

    const onValidate = async () => {
      errors.value = {
        prefix_name: { error: 0, text: "" },
        firstname: { error: 0, text: "" },
        surname: { error: 0, text: "" },
        email: { error: 0, text: "" },
        department_id: { error: 0, text: "" },
      };

      try {
        await validationItemSchema.validate(item, {
          abortEarly: false,
        });
      } catch (err: any) {
        console.log(err);
        err.inner.forEach((error: any) => {
          const fieldName = error.path;
          const errorMessage = error.message;
          errors.value[fieldName].error = 1;
          errors.value[fieldName].text = errorMessage;
        });

        useToast("ระบุข้อมูลไม่ครบถ้วน", "error");
        return false;
      }

      await onSaveUser();
    };

    const onSaveUser = async () => {
      //
      let data_item = {
        prefix_name: item.prefix_name,
        firstname: item.firstname,
        surname: item.surname,
        email: item.email,
        department_id: item.department_id?.id,
      };

      await ApiService.put("user/" + item.id, data_item)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          // Swal
          useToast("แก้ไขข้อมูลเสร็จสิ้น", "success");
          emit("reload");
          emit("close-modal");
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    // Mounted
    onMounted(async () => {
      selectOptions.value.departments = await useMasterData().fetchDepartments({
        is_active: 1,
        perPage: 500,
      });
      await fetchUser();
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
    });

    onUnmounted(() => {
      mainModalObj.value.hide();
      emit("close-modal");
    });

    // Return
    return {
      item,
      errors,
      selectOptions,
      onClose,
      mainModalRef,
      onValidate,
    };
  },
});
</script>

<style>
@media only screen and (max-width: 768px) {
  .card > .card-body {
    padding: 0px;
  }
}

.color-primary {
  color: #800001;
}
</style>
