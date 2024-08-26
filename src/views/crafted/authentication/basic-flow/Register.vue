<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmit"
      :validation-schema="register"
      :initial-values="{ username: 'arnonr', password: 'demo' }"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h4 class="text-gray-900 mb-3">ระบบ CWIE <br />อุทยานเทคโนโลยี มจพ.</h4>
        <!--end::Title-->
      </div>
      <!--begin::Heading-->

      <div class="mb-10 bg-light-warning p-4 rounded">
        <div class="text-dark">สมัครเข้าใช้งานด้วย ICIT Account</div>
      </div>

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-gray-900"
          >ICIT Account</label
        >
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="username"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0"
            >Password</label
          >
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-gray-900"
          >ประเภทผู้ใช้งาน</label
        >
        <!--end::Label-->

        <!--begin::Input-->
        <!-- <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="group_id"
          autocomplete="off"
        /> -->

        <Field
          name="group_id"
          as="select"
          class="form-control form-control-lg form-control-solid"
        >
          <option
            v-for="(it, idx) in selectOptions.groups"
            :key="idx"
            :value="it.id"
          >
            {{ it.name }}
          </option>
        </Field>
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="ประเภทผู้ใช้งาน" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0"
            >Email</label
          >
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="email"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0"
            >เบอร์โทรศัพท์</label
          >
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="phone"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="phone" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label fw-bold"> Continue </span>

          <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Submit button-->
      </div>
      <!--end::Actions-->

      <div class="text-start d-flex justify-content-between">
        <router-link to="/home" class="link-primary fs-6 fw-bold">
          กลับหน้าหลัก
        </router-link>
        <router-link to="/sign-in" class="link-primary fs-6 fw-bold">
          หน้าเข้าสู่ระบบ
        </router-link>
      </div>
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import ApiService from "@/core/services/ApiService";
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import useToast from "@/composables/useToast";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();
    // UI
    const isLoading = ref<any>(true);

    const selectOptions = ref<any>({
      groups: <any>[],
    });

    const submitButton = ref<HTMLButtonElement | null>(null);

    //Create form validation object
    const register = Yup.object().shape({
      username: Yup.string().required().label("ICIT Account"),
      password: Yup.string().min(4).required().label("Password"),
      email: Yup.string().required().label("Email"),
      phone: Yup.string().required().label("Phone"),
    });

    // fetchItems
    const fetchGroups = async () => {
      await ApiService.query("group", {})
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          selectOptions.value.groups = data.data;
          console.log(selectOptions.value.groups);
        })
        .catch(({ response }) => {
          isLoading.value = false;
          console.log(response);
        });
    };
    fetchGroups();

    //Form submit function
    const onSubmit = async (values: any) => {
      values = values as User;

      if (submitButton.value) {
        // eslint-disable-next-line
        submitButton.value!.disabled = true;
        // Activate indicator
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      console.log(values);
      isLoading.value = true;

      let data_item: any = {
        ...values,
        type_id: values.group_id,
      };

      await ApiService.post("auth/register", data_item)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          isLoading.value = false;

          if (data.group_id != 7) {
            Swal.fire({
              text: "ได้รัับข้อมูลของท่านแล้ว โปรดรอการอนุมัติการเข้าใช้งาน",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn fw-semibold btn-light-primary",
              },
            }).then(() => {
              // Go to page after successfully login
              useToast("บันทึกข้อมูลเสร็จสิ้น");
              router.push({ name: "sign-in" });
            });
          } else {
            useToast("บันทึกข้อมูลเสร็จสิ้น");
            router.push({ name: "sign-in" });
          }
        })
        .catch(({ response }) => {
          isLoading.value = false;
          console.log(response);
        });

      //Deactivate indicator
      submitButton.value?.removeAttribute("data-kt-indicator");
      // eslint-disable-next-line
      submitButton.value!.disabled = false;
    };

    return {
      onSubmit,
      register,
      submitButton,
      getAssetPath,
      selectOptions,
    };
  },
});
</script>
