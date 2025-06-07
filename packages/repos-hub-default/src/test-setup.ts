/**
 * Test setup file for repos-hub-default package
 * Configures testing environment with necessary polyfills and mocks
 */

import "@testing-library/jest-dom/vitest";
import { beforeAll, vi } from "vitest";

// Mock fetch globally for all tests
globalThis.fetch = vi.fn();

// Mock IntersectionObserver for testing components that might use it
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver for testing components that might use it
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia for responsive components
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup DOM environment
beforeAll(() => {
  // Mock window.location
  Object.defineProperty(globalThis, "location", {
    value: {
      href: "http://localhost:3000",
      hostname: "localhost",
      port: "3000",
      protocol: "http:",
    },
    writable: true,
  });
});
