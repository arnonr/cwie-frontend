<template>
  <div>
    <div class="card" v-if="item.id != null">
      <div class="card-body">
        <div class="row">
          <div class="mb-7 col-12 col-lg-12">
            <label for="paper_type_id" class="required form-label"
              >หัวข้อ</label
            >
            <input
              type="text"
              class="form-control"
              :placeholder="`หัวข้อ`"
              :aria-label="`หัวข้อ`"
              v-model="item.title"
            />
          </div>
          <div class="mb-7 col-12 col-lg-12">
            <label for="paper_type_id" class="required form-label"
              >รายละเอียด</label
            >
            <froala
              :tag="'textarea'"
              :config="froalaConfig.detail"
              v-model="item.detail"
            ></froala>
          </div>

          <div class="mb-7 col-12 col-lg-12 text-center">
            <button
              @click="onSubmit"
              class="btn btn-primary text-white"
              :disabled="isLoading"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
      <Preloader
        :isLoading="isLoading != undefined ? isLoading : false"
        :position="'fix'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from "vue";
import ApiService from "@/core/services/ApiService";

// Use Toast Composables
import useToast from "@/composables/useToast";
import { useRouter, useRoute } from "vue-router";

// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(buddhistEra);
dayjs.extend(customParseFormat);

// Import Component
import Preloader from "@/components/preloader/Preloader.vue";

// Use Composables
import useFroalaConfigData from "@/composables/useFroalaConfigData";

// Import Yup Validate
import * as Yup from "yup";

export default defineComponent({
  name: "edit-home",
  components: {
    Preloader,
  },
  setup() {
    // UI Variable
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref<any>(false);

    const item = ref<any>({ detail: "" });

    let froalaConfig: any = {
      detail: useFroalaConfigData().froala_config,
    };

    let textEditor = ["detail"];

    textEditor.forEach((x: any) => {
      froalaConfig[x]["events"] = {
        keyup: function (inputEvent: any) {
          item.value[x] = this.html.get();
        },
        click: function (clickEvent: any) {
          item.value[x] = this.html.get();
        },
        "commands.after": function (cmd: any, param1: any, param2: any) {
          item.value[x] = this.html.get();
        },
        "paste.after": function (pasteEvent: any) {
          item.value[x] = this.html.get();
        },
        initialized: function () {
          this.html.insert(item.value[x]);
        },
      };
    });

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    // Item Variable
    // Validate Schema
    // errors

    //Fetch
    const fetchItem = async () => {
      try {
        isLoading.value = true;
        const { data } = await ApiService.query("about/1", {});

        item.value = data.data;

        isLoading.value = false;
      } catch (error) {
        isLoading.value = false;
        console.log(error);
      }
    };

    // Save Event
    const onSubmit = async () => {
      let data_item: any = {
        title: item.value.title,
        detail: item.value.detail,
      };

      await ApiService.put("about/1", data_item)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }

          useToast("บันทึกข้อมูลเสร็จสิ้น");
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    onMounted(async () => {
      await fetchItem();
    });

    onUnmounted(() => {});

    // Watch

    watch(
      () => route.params.id,
      () => {
        fetchItem();
      }
    );

    // Return
    return {
      isLoading,
      item,
      onSubmit,
      froalaConfig,
    };
  },
});
</script>

<style>
.vs--searchable .vs__dropdown-toggle {
  border: none;
}
</style>
