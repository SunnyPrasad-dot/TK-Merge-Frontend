import { EVENTS } from "./constants";

const EventSelector = ({ selectedDates, events, toggleEvent }) => {
  return (
    <div>
      <h3>Select Events</h3>

      {selectedDates.map(date => (
        <div key={date}>
          <h4>{date}</h4>

          {EVENTS.map(event => (
            <label key={event} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={(events[date] || []).includes(event)}
                onChange={() => toggleEvent(date, event)}
              />
              {event}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EventSelector;