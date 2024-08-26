export default () => {
  const types = [
    {
      id: 1,
      value: 1,
      name: "Report",
    },
    {
      id: 2,
      value: 2,
      name: "Certificate",
    },
  ];

  const publishes = [
    {
      id: 0,
      value: 0,
      name: "none",
      color: "warning",
    },
    {
      id: 1,
      value: 1,
      name: "publish",
      color: "success",
    },
  ];
  const actives = [
    {
      id: 0,
      value: 0,
      name: "none",
      color: "warning",
    },
    {
      id: 1,
      value: 1,
      name: "active",
      color: "success",
    },
  ];

  const user_statuses = [
    {
      id: 0,
      value: 0,
      name: "ปิดการใช้งาน",
      color: "secondary",
    },
    {
      id: 1,
      value: 1,
      name: "ใช้งาน",
      color: "success",
    },
    {
      id: 2,
      value: 2,
      name: "รออนุมัติ",
      color: "warning",
    },
    {
      id: 3,
      value: 3,
      name: "ระงับการใช้งาน",
      color: "danger",
    },
  ];

  const day_times = [
    {
      name: "กลางวัน",
      value: 1,
    },
    { name: "กลางคืน", value: 2 },
  ];

  const is_anonymouses = [
    { name: "ระบุตัวตน", value: 1 },
    { name: "ไม่ระบุตัวตน", value: 2 },
  ];

  const card_types = [
    {
      name: "หมายเลขบัตรประชาชน",
      value: 1,
    },
    {
      name: "หนังสือเดินทาง",
      value: 2,
    },
  ];

  const receive_statuses = [
    {
      name: "รับเรื่อง",
      value: 1,
      state_id: 3,
    },
    {
      name: "ข้อมูลไม่ครบถ้วน",
      value: 2,
      state_id: 18,
    },
    {
      name: "เป็นการร้องทุกข์ กล่าวโทษคดีอาญา",
      value: 3,
      state_id: 18,
    },
  ];
  const orders = [
    {
      value: 1,
      name: "พิจารณาดำเนินการตามอำนาจหน้าที่",
    },
    {
      value: 2,
      name: "เป็นข้อมูลในการปฏิบัติราชการ",
    },
    {
      value: 3,
      name: "เร่งรัดติตตามผล",
    },
  ];

  const sections = [
    {
      value: 1,
      name_th: "การป้องกันและปราบปราม",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 2,
      name_th: "อำนวยการ",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 3,
      name_th: "บริหาร",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 4,
      name_th: "สืบสวน",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 5,
      name_th: "สอบสวน",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 6,
      name_th: "จราจร",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 7,
      name_th: "ป้องกันปราบปรามยาเสพติด",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 8,
      name_th: "กิจการพิเศษ",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 9,
      name_th: "ธุรการ",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 10,
      name_th: "ปฎิบัติการพิเศษ",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 11,
      name_th: "นิติกร",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 14,
      name_th: "ไม่ระบุ",
      name_th_abbr: null,
      name_en: null,
      name_en_abbr: null,
    },
  ];

  const positions = [
    {
      value: 12,
      name_th: "รองสารวัตร",
      name_th_abbr: "รอง สว.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 22,
      name_th: "อาจารย์ (สบ.5)",
      name_th_abbr: "อจ.สบ.5",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 21,
      name_th: "อาจารย์ (สบ.1)",
      name_th_abbr: "อจ.สบ.1",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 20,
      name_th: "พนักงานสอบสวน",
      name_th_abbr: "รอง สว.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 19,
      name_th: "พนักงานสอบสวนผู้ชำนาญ",
      name_th_abbr: "สว.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 18,
      name_th: "พนักงานสอบสวนผู้ชำนาญการพิเศษ",
      name_th_abbr: "รอง ผกก.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 17,
      name_th: "พนักงานสอบสวนผู้ทรงคุณวุฒิ",
      name_th_abbr: "ผกก.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 16,
      name_th: "พนักงานสอบสวนผู้เชี่ยวชาญ",
      name_th_abbr: "รอง ผบก.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 15,
      name_th: "พนักงานสอบสวนผู้เชี่ยวชาญพิเศษ",
      name_th_abbr: "ผบก.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 14,
      name_th: "รองผู้บังคับหมู่",
      name_th_abbr: "รอง ผบ.หมู่",
      name_en: null,
      name_en_abbr: null,
    },
    {
      id: 13,
      name_th: "ผู้บังคับหมู่",
      name_th_abbr: "ผบ.หมู่",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 1,
      name_th: "ผู้บัญชาการตำรวจแห่งชาติ ",
      name_th_abbr: "ผบ.ตร.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 11,
      name_th: "สารวัตร",
      name_th_abbr: "สว.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 10,
      name_th: "รองผู้กำกับการ",
      name_th_abbr: "รอง ผกก.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 9,
      name_th: "ผู้กำกับการ",
      name_th_abbr: "ผกก.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 8,
      name_th: "รองผู้บังคับการ",
      name_th_abbr: "รอง ผบก.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 7,
      name_th: "ผู้บังคับการ",
      name_th_abbr: "ผบก.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 6,
      name_th: "รองผู้บัญชาการ",
      name_th_abbr: "รอง ผบช.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 5,
      name_th: "ผู้บัญชาการ",
      name_th_abbr: "ผบช.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 4,
      name_th: "ผู้ช่วยผู้บัญชาการตำรวจแห่งชาติ",
      name_th_abbr: "ผู้ช่วย ผบ.ตร.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 3,
      name_th: "รองผู้บัญชาตำรวจแห่งชาติ",
      name_th_abbr: "รอง ผบ.ตร.",
      name_en: null,
      name_en_abbr: null,
    },
    {
      value: 2,
      name_th: "จเรตำรวจแห่งชาติ",
      name_th_abbr: "จตช.",
      name_en: null,
      name_en_abbr: null,
    },
  ];

  const proceed_statuses = [
    {
      value: 9,
      name_th: "พบการกระทำผิด ดำเนินเรื่องตามกฎหมายแล้ว",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 22,
      name_th: "รายงานตร.ตามหนังสือ",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 21,
      name_th: "ยุติเรื่องทางวินัย",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 20,
      name_th: "ว่ากล่าวตักเตือน",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 19,
      name_th: "ภาคฑัณ",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 18,
      name_th: "ฑัณตกรรม",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 17,
      name_th: "กักยาม",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 16,
      name_th: "กักขัง",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 15,
      name_th: "ตัดเงินเดือน",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 14,
      name_th: "ปลดออก",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      id: 13,
      name_th: "ไล่ออก",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 12,
      name_th: "ลงโทษทางวินัย",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 11,
      name_th: "แต่งตั้งคณะกรรมการสืบสวนข้อเท็จจริง",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
    {
      value: 10,
      name_th: "ไม่พบการกระทำผิด",
      name_en: null,
      state_id: null,
      complaint_type_id: null,
    },
  ];

  const researcher_types = [
    {
      id: 1,
      name: "หัวหน้าโครงการ",
    },
    {
      id: 2,
      name: "ที่ปรึกษา",
    },
    {
      id: 3,
      name: "ผู้ร่วมวิจัย",
    },
  ];

  return {
    publishes,
    actives,
    user_statuses,
    types,
    day_times,
    is_anonymouses,
    card_types,
    receive_statuses,
    orders,
    sections,
    positions,
    proceed_statuses,
    researcher_types
  };
};
