/**
 * Calculate the recommended brooder temperature for a given week.
 * Week 1: 95°F, decreasing by 5°F each week until room temperature.
 */
export function getRecommendedTemperature(weekNumber: number): number {
  if (weekNumber <= 0) {
    return 95; // Preparation week - target temp for chick arrival
  }
  if (weekNumber >= 6) {
    return 70; // Room temperature - no supplemental heat needed
  }
  // Week 1: 95°F, Week 2: 90°F, Week 3: 85°F, Week 4: 80°F, Week 5: 75°F
  return 95 - (weekNumber - 1) * 5;
}

/**
 * Get behavioral indicators for temperature comfort.
 */
export function getTemperatureGuidance(weekNumber: number): {
  temperature: number;
  tooCold: string;
  tooHot: string;
  justRight: string;
  tip: string;
} {
  const temperature = getRecommendedTemperature(weekNumber);

  return {
    temperature,
    tooCold:
      "Chicks are huddled together under the heat source, piling on top of each other",
    tooHot:
      "Chicks are spread out along the edges of the brooder, panting, wings held away from body",
    justRight:
      "Chicks are scattered comfortably throughout the brooder, moving freely between warm and cool areas",
    tip:
      weekNumber <= 0
        ? "Pre-warm your brooder 24 hours before chicks arrive to ensure stable temperature."
        : weekNumber >= 6
          ? "Your chicks are fully feathered and can regulate their own temperature. Supplemental heat is only needed if room drops below 65°F."
          : `Lower the temperature by 5°F each week by raising your heat plate. Chicks grow more feathers and need less heat as they develop.`,
  };
}
