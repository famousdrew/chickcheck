import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Skeleton,
  TaskItemSkeleton,
  TaskListSkeleton,
  FlockHeaderSkeleton,
  DashboardSkeleton,
} from "./Skeleton";

describe("Skeleton", () => {
  it("renders with default className", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("animate-pulse", "rounded", "bg-gray-200");
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("h-4", "w-32");
  });

  it("has aria-hidden for accessibility", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });
});

describe("TaskItemSkeleton", () => {
  it("renders skeleton structure for a task item", () => {
    const { container } = render(<TaskItemSkeleton />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });
});

describe("TaskListSkeleton", () => {
  it("renders week selector skeleton", () => {
    const { container } = render(<TaskListSkeleton />);
    // 9 week buttons (0-8)
    const weekButtons = container.querySelectorAll(".flex.gap-2 > div");
    expect(weekButtons.length).toBe(9);
  });

  it("renders task item skeletons", () => {
    render(<TaskListSkeleton />);
    // Should have multiple skeleton items
    const skeletons = document.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(10);
  });
});

describe("FlockHeaderSkeleton", () => {
  it("renders flock header structure", () => {
    const { container } = render(<FlockHeaderSkeleton />);
    const card = container.querySelector(".rounded-rustic.shadow-rustic");
    expect(card).toBeInTheDocument();
  });
});

describe("DashboardSkeleton", () => {
  it("renders both flock header and task list skeletons", () => {
    const { container } = render(<DashboardSkeleton />);
    const cards = container.querySelectorAll(".rounded-rustic.shadow-rustic");
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});
