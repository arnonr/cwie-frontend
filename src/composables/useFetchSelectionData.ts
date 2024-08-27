import ApiService from "@/core/services/ApiService";

export const fetchTeachers = async (params: any) => {
  const { data } = await ApiService.query("teacher-profile", {
    params: params,
  });

  return data.data;
};

export const fetchAddressAlls = async (params: any) => {
  const { data } = await ApiService.query("province/thailand", {
    params: params,
  });
  return data.addresses;
};
