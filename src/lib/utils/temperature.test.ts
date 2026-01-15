import { describe, it, expect } from "vitest";
import {
  getRecommendedTemperature,
  getTemperatureGuidance,
} from "./temperature";

describe("getRecommendedTemperature", () => {
  it("returns 95°F for week 0 (preparation)", () => {
    expect(getRecommendedTemperature(0)).toBe(95);
  });

  it("returns 95°F for week 1", () => {
    expect(getRecommendedTemperature(1)).toBe(95);
  });

  it("returns 90°F for week 2", () => {
    expect(getRecommendedTemperature(2)).toBe(90);
  });

  it("returns 85°F for week 3", () => {
    expect(getRecommendedTemperature(3)).toBe(85);
  });

  it("returns 80°F for week 4", () => {
    expect(getRecommendedTemperature(4)).toBe(80);
  });

  it("returns 75°F for week 5", () => {
    expect(getRecommendedTemperature(5)).toBe(75);
  });

  it("returns 70°F (room temp) for week 6+", () => {
    expect(getRecommendedTemperature(6)).toBe(70);
    expect(getRecommendedTemperature(7)).toBe(70);
    expect(getRecommendedTemperature(8)).toBe(70);
  });
});

describe("getTemperatureGuidance", () => {
  it("returns guidance with correct temperature", () => {
    const guidance = getTemperatureGuidance(2);
    expect(guidance.temperature).toBe(90);
  });

  it("includes behavioral indicators", () => {
    const guidance = getTemperatureGuidance(1);
    expect(guidance.tooCold).toContain("huddled");
    expect(guidance.tooHot).toContain("panting");
    expect(guidance.justRight).toContain("scattered");
  });

  it("returns pre-warm tip for week 0", () => {
    const guidance = getTemperatureGuidance(0);
    expect(guidance.tip).toContain("Pre-warm");
  });

  it("returns heat reduction tip for active weeks", () => {
    const guidance = getTemperatureGuidance(3);
    expect(guidance.tip).toContain("5°F");
  });

  it("returns room temperature tip for week 6+", () => {
    const guidance = getTemperatureGuidance(6);
    expect(guidance.tip).toContain("fully feathered");
  });
});
