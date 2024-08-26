export default () => {
  const statuses = [
    {
      id: 1,
      name_th: "ร่าง",
      name_en: null,
      bg_color: "#f8285a",
      bg_bs_color: "error",
    },
    {
      id: 2,
      name_th: "อยู่ระหว่างการพิจารณา",
      name_en: null,
      bg_color: "#ffc107",
      bg_bs_color: "warning",
    },
    {
      id: 3,
      name_th: "แก้ไขข้อเสนอโครงการ",
      name_en: null,
      bg_color: "#FFC0CB",
      bg_bs_color: "error",
    },
    {
      id: 4,
      name_th: "ตอบรับข้อเสนอโครงการ",
      name_en: null,
      bg_color: "#17c653",
      bg_bs_color: "success",
    },
    {
      id: 5,
      name_th: "ยกเลิก",
      name_en: null,
      bg_color: "#ff0505",
      bg_bs_color: "error",
    },
  ];

  return {
    statuses,
  };
};
