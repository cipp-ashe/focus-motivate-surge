
/**
 * Determines the completion status based on planned vs actual duration
 * @param plannedDuration Planned duration in seconds
 * @param actualDuration Actual duration in seconds
 * @returns Completion status string
 */
export const determineCompletionStatus = (plannedDuration: number, actualDuration: number): string => {
  if (!plannedDuration || !actualDuration) return "Completed";
  
  // If completed in less than 95% of the planned time
  if (actualDuration < plannedDuration * 0.95) {
    return "Completed Early";
  }
  
  // If completed within 5% of the planned time
  if (actualDuration <= plannedDuration * 1.05) {
    return "Completed On Time";
  }
  
  // If completed in more than 105% of the planned time
  return "Completed Late";
};

/**
 * Calculates the efficiency ratio
 * @param plannedDuration Planned duration in seconds
 * @param actualDuration Actual duration in seconds
 * @returns Efficiency ratio (planned/actual)
 */
export const calculateEfficiencyRatio = (plannedDuration: number, actualDuration: number): number => {
  if (!plannedDuration || !actualDuration) return 1;
  
  return plannedDuration / actualDuration;
};
