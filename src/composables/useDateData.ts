// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

export default () => {
  const convertDate = (date: any) => {
    if (!date) return "";
    return dayjs(date).locale("th").format("DD MMM BB");
  };

  return {
    convertDate,
  };
};
