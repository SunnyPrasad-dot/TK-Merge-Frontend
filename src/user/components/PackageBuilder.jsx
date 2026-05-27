import { usePackageBuilder } from "./usePackageBuilder";
import DateSelector from "./DateSelector";
import EventSelector from "./EventSelector";
import PackageSelector from "./PackageSelector";
import Summary from "./Summary";

const PackageBuilder = () => {
  const data = usePackageBuilder();

  return (
    <div>
      <DateSelector {...data} />
      <EventSelector {...data} />
      <PackageSelector {...data} />
      <Summary {...data} />
    </div>
  );
};

export default PackageBuilder;