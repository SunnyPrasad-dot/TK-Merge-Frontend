import { useState, useEffect } from "react";

const STORAGE_KEY = "wedding_booking";

export const usePackageBuilder = () => {

  const getInitialData = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data
      ? JSON.parse(data)
      : {
          selectedDates: [],
          events: {},
          packages: {}
        };
  };

  const [state, setState] = useState(getInitialData);

  useEffect(() => {
    const data = {
      ...state,
      lastUpdated: new Date()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [state]);

  const setSelectedDates = (dates) => {
    setState(prev => ({ ...prev, selectedDates: dates }));
  };

  const toggleEvent = (date, event) => {
    setState(prev => {
      const current = prev.events[date] || [];

      const updated = current.includes(event)
        ? current.filter(e => e !== event)
        : [...current, event];

      return {
        ...prev,
        events: { ...prev.events, [date]: updated }
      };
    });
  };

  const setPackage = (date, pkg) => {
    setState(prev => ({
      ...prev,
      packages: { ...prev.packages, [date]: pkg }
    }));
  };

  const clearBooking = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      selectedDates: [],
      events: {},
      packages: {}
    });
  };

  return {
    ...state,
    setSelectedDates,
    toggleEvent,
    setPackage,
    clearBooking
  };
};