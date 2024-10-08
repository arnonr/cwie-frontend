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

export const fetchCompanies = async (params: any) => {
  const { data } = await ApiService.query("company", {
    params: params,
  });

  return data.data;
};

export const fetchSemesters = async (params: any) => {
  const { data } = await ApiService.query("semester", {
    params: params,
  });

  return data.data;
};

export const fetchDivisions = async (params: any) => {
  const { data } = await ApiService.query("division", {
    params: params,
  });

  return data.data;
};

export const fetchFaculties = async (params: any) => {
  const { data } = await ApiService.query("faculty", {
    params: params,
  });

  return data.data;
};

export const fetchProvinces = async (params: any) => {
  const { data } = await ApiService.query("province", {
    params: params,
  });

  return data.data;
};

export const fetchFormStatuses = async (params: any) => {
  const { data } = await ApiService.query("form-status", {
    params: params,
  });

  return data.data;
};

export const fetchUserStatuses = async (params: any) => {
  const { data } = await ApiService.query("user-status", {
    params: params,
  });

  return data.data;
};

export const fetchGroups = async (params: any) => {
  const { data } = await ApiService.query("group", {
    params: params,
  });

  return data.data;
};
