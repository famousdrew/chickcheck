import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnlineStatus } from "./useOnlineStatus";

describe("useOnlineStatus", () => {
  const originalNavigator = global.navigator;

  beforeEach(() => {
    // Mock navigator.onLine
    Object.defineProperty(global, "navigator", {
      value: { onLine: true },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it("returns true when online", () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it("returns false when offline", () => {
    Object.defineProperty(global, "navigator", {
      value: { onLine: false },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(false);
  });

  it("updates when going offline", () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      Object.defineProperty(global, "navigator", {
        value: { onLine: false },
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);
  });

  it("updates when going online", () => {
    Object.defineProperty(global, "navigator", {
      value: { onLine: false },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      Object.defineProperty(global, "navigator", {
        value: { onLine: true },
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(true);
  });
});
