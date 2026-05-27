import { PACKAGES } from "./constants";

const PackageSelector = ({ selectedDates, setPackage }) => {
  return (
    <div>
      <h3>Select Package</h3>

      {selectedDates.map(date => (
        <div key={date}>
          <h4>{date}</h4>

          {Object.keys(PACKAGES).map(pkg => (
            <button
              key={pkg}
              onClick={() => setPackage(date, pkg)}
              style={{ marginRight: "10px" }}
            >
              {pkg}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PackageSelector;