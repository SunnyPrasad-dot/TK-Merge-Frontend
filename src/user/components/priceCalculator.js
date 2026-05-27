import { PACKAGES } from "./constants";

export const calculateTotal = (dates, packages) => {
  let total = 0;

  dates.forEach(date => {
    const pkg = packages[date];
    if (pkg) {

      total += PACKAGES[pkg];

    }
  });

  return total;
};
