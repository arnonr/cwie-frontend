<template>
  <div class="mx-md-0 mx-5" v-if="item != undefined">
    <!-- Tab Header-->
    <ul class="nav nav-tabs nav-line-tabs nav-stretch border-0">
      <li class="nav-item">
        <a class="nav-link active" data-bs-toggle="tab" href="#tab1">
          <i class="fas fa-info-circle me-2"></i> ข้อมูลทั่วไป</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#tab2">
          <i class="fas fa-heartbeat me-2"></i> ข้อมูลสุขภาพ</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#tab3">
          <i class="fas fa-file-alt me-2"></i> เอกสาร</a
        >
      </li>
    </ul>
    <div class="separator my-3"></div>

    <!-- Tab Content -->
    <div class="tab-content lh-xl">
      <div class="tab-pane fade show active" id="tab1">
        <div>
          <div class="header-detail my-6">
            <h6><i class="fa fa-book"></i> ข้อมูลการศึกษา</h6>
          </div>
          <div class="content-detail row">
            <div class="col-md-6">
              <span>อาจารย์ที่ปรึกษา : </span>
              <span>{{ item.advisor_fullname }}</span>
            </div>
            <div class="col-md-6">
              <span>เกรดเฉลี่ย : </span>
              <span>{{ item.gpa }}</span>
            </div>
          </div>
          <div class="separator separator-dotted my-2"></div>
        </div>

        <div>
          <div class="header-detail my-6">
            <h6><i class="fas fa-map-marker-alt"></i> ข้อมูลที่อยู่</h6>
          </div>
          <div class="content-detail row">
            <div class="col-md-12">
              <span>ที่อยู่ปัจจุบัน : </span>
              <span>{{ item.address }}</span>
            </div>
            <div class="col-md-4">
              <span>จังหวัด : </span>
              <span>{{ item.province_detail?.name_th }}</span>
            </div>
            <div class="col-md-4">
              <span>อำเภอ : </span>
              <span>{{ item.district_detail?.name_th }}</span>
            </div>
            <div class="col-md-4">
              <span>ตำบล : </span>
              <span>{{ item.sub_district_detail?.name_th }}</span>
            </div>
            <div class="col-md-4">
              <span>รหัสไปรษณีย์ : </span>
              <span> {{ item.sub_district_detail?.zip_code }}</span>
            </div>
            <div class="col-md-4">
              <span>เบอร์โทรศัพท์ : </span>
              <span>{{ item.phone }}</span>
            </div>
            <div class="col-md-4">
              <span>เมล : </span>
              <span>{{ item.email }}</span>
            </div>
          </div>
          <div class="separator separator-dotted my-2"></div>
        </div>

        <div>
          <div class="header-detail my-6">
            <h6><i class="fas fa-address-book"></i> ข้อมูลผู้ที่ติดต่อได้</h6>
          </div>
          <div class="content-detail row">
            <div class="col-md-4">
              <span>บุคคลที่ติดต่อได้ : </span>
              <span>{{ item.contact1_name }}</span>
            </div>
            <div class="col-md-4">
              <span>ความสัมพันธ์ : </span>
              <span>{{ item.contact1_relation }}</span>
            </div>
            <div class="col-md-4">
              <span>โทร : </span>
              <span>{{ item.contact1_phone }}</span>
            </div>

            <div class="col-md-4">
              <span>บุคคลที่ติดต่อได้ : </span>
              <span>{{ item.contact2_name }}</span>
            </div>
            <div class="col-md-4">
              <span>ความสัมพันธ์ : </span>
              <span>{{ item.contact2_relation }}</span>
            </div>
            <div class="col-md-4">
              <span>โทร : </span>
              <span>{{ item.contact2_phone }}</span>
            </div>
          </div>
          <div class="separator separator-dotted my-2"></div>
        </div>
      </div>
      <div class="tab-pane fade" id="tab2">
        <div>
          <div class="header-detail my-6">
            <h6><i class="fas fa-heartbeat"></i> ข้อมูลสุขภาพ</h6>
          </div>
          <div class="content-detail row">
            <div class="col-md-4">
              <span>กลุ่มเลือด : </span>
              <span>{{ item.blood_group }}</span>
            </div>
            <div class="col-md-4">
              <span>ส่วนสูง (ซม.) : </span>
              <span>{{ item.height }}</span>
            </div>
            <div class="col-md-4">
              <span>น้ำหนัก (กก.) : </span>
              <span>{{ item.weight }}</span>
            </div>

            <div class="col-md-12">
              <span>เบอร์โทรศัพท์ฉุกเฉิน : </span>
              <span>{{ item.emergency_phone }}</span>
            </div>
            <div class="col-md-12">
              <span>โรคประจำตัว : </span>
              <span>{{ item.congenital_disease }}</span>
            </div>
            <div class="col-md-12">
              <span>ประวัติการแพ้ยา : </span>
              <span>{{ item.drug_allergy }}</span>
            </div>
          </div>
          <div class="separator separator-dotted my-2"></div>
        </div>
      </div>
      <div class="tab-pane fade" id="tab3">
        <div>
          <div class="header-detail my-6">
            <h6><i class="fas fa-certificate"></i> ประกาศนียบัตร</h6>
          </div>
          <div class="content-detail row">
            <div class="col-md-12">
              <span>1. </span>
              <span>{{ item.blood_group }}</span>
            </div>
          </div>
          <div class="separator separator-dotted my-2"></div>
          <div class="header-detail my-6">
            <h6><i class="fas fa-file-alt"></i> เอกสาร</h6>
          </div>
          <div class="content-detail row">
            <div class="col-md-12 p-2">
              <span>ใบเกรด : </span>
              <button class="btn btn-sm btn-outline btn-outline-primary">
                <i class="fa fa-file"></i> Preview
              </button>
            </div>
            <div class="col-md-12">
              <span class="me-2">เรซูเม่ : </span>
              <button class="btn btn-sm btn-outline btn-outline-primary">
                <i class="fa fa-file"></i> Preview
              </button>
            </div>
            <div class="separator separator-dotted my-2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "student-profile-card",
  props: {
    item: { type: Object },
  },
  components: {},
});
</script>
