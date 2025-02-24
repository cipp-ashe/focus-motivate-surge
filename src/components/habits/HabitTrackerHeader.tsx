
import React from 'react';

const HabitTrackerHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-lg font-semibold">Habit Tracker</h2>
    </div>
  );
};

export default HabitTrackerHeader;
