import { format } from "date-fns";

const millisToDate = (millis) => {
  if (!millis) return "NaN";
  const m = new Date(parseInt(millis));
  return format(m, "P");
};

export default millisToDate;