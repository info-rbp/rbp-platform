import { describe, expect, it } from "vitest";
import { createRoutesFromChildren } from "react-router";

describe("frontend test gate", () => {
  it("runs the test environment", () => {
    expect(true).toBe(true);
  });

  it("can import react-router test utilities", () => {
    expect(typeof createRoutesFromChildren).toBe("function");
  });
});
