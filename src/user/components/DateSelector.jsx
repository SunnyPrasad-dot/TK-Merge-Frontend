const DateSelector = ({ selectedDates, setSelectedDates }) => {

  const handleChange = (e) => {
    const date = e.target.value;
    if (!selectedDates.includes(date)) {
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <div>
      <h3>Select Dates</h3>
      <input type="date" onChange={handleChange} />
      
      <ul>
        {selectedDates.map(date => (
          <li key={date}>{date}</li>
        ))}
      </ul>
    </div>
  );
};

export default DateSelector;