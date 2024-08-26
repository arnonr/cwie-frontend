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
        color: "danger",
      },
      {
        id: 1,
        value: 1,
        name: "ใช้งาน",
        color: "success",
      },
    ];
  
    return {
      publishes,
      actives,
      user_statuses,
      types
    };
  };
  