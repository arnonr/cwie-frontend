import ApiService from "@/core/services/ApiService";

export default () => {
  const fetchPrefixName = async (params: any) => {
    const { data } = await ApiService.query("prefix-name", {
      params: params,
    });

    return data.data;
  };

  const fetchState = async (params: any) => {
    const { data } = await ApiService.query("state", {
      params: params,
    });
    return data.data.filter((x: any) => {
      return x.id == 1 || x.id == 18;
    });
  };

  const fetchDepartments = async (params: any) => {
    const { data } = await ApiService.query("department", {
      params: params,
    });

    return data.data;
  };

  const fetchPaperTypes = async (params: any) => {
    const { data } = await ApiService.query("paper-type", {
      params: params,
    });

    return data.data;
  };

  const fetchPaperKinds = async (params: any) => {
    const { data } = await ApiService.query("paper-kind", {
      params: params,
    });

    return data.data;
  };

  const fetchTeachers = async (params: any) => {
    const { data } = await ApiService.query("teacher", {
      params: params,
    });

    return data.data;
  };

  return {
    fetchPrefixName,
    fetchState,
    fetchDepartments,
    fetchPaperTypes,
    fetchPaperKinds,
    fetchTeachers,
  };
};
