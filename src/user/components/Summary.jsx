import { calculateTotal } from "./priceCalculator";

const Summary = ({ selectedDates, packages, clearBooking }) => {

  const total = calculateTotal(selectedDates, packages);

  return (
    <div>
      <h3>Summary</h3>

      {selectedDates.map(date => (
        <div key={date}>
          {date} → {packages[date] || "No package"}
        </div>
      ))}

      <h2>Total: ₹{total}</h2>

      <button onClick={clearBooking}>Reset</button>
    </div>
  );
};

export default Summary;