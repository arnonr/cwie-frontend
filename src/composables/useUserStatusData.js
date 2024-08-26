export default () => {
  const statuses = [
    {
      id: 1,
      name_th: "ใช้งาน",
      name_en: null,
      bg_color: "#17c653",
      bg_bs_color: "success",
    },
    {
      id: 0,
      name_th: "ปิดการใช้งาน",
      name_en: null,
      bg_color: "#ff0505",
      bg_bs_color: "error",
    },
  ];

  return {
    statuses,
  };
};
