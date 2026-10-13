import { describe, expect, it } from "vitest";
import { createFlightDevSession, type FlightDevPorts } from "../src/core.js";
function fixture(search: string) {
 let mounts = 0, disposals = 0, tabs = 0, unmounts = 0;
 const ports: FlightDevPorts<string> = { acceptedFlight: { read: () => null, subscribe: () => () => {} }, mountAcceptedFlightView: ({ signal }) => {
  expect(signal.aborted).toBe(false); mounts++; return { view: "accepted observation", dispose() { disposals++; } };
 } };
 const session = createFlightDevSession({ search, ports, host: { registerTab: () => { tabs++; return () => { tabs--; }; }, mount() {}, unmount() { unmounts++; }, status() {}, remove() {} } });
 return { session, counts: () => ({ mounts, disposals, tabs, unmounts }) };
}
describe("flight shared Dev adapter", () => {
 it.each(["", "?dev=0", "?dev=true", "?dev=1&dev=1"])("starts no optional flight view without exact activation %s", async search => {
  const { session, counts } = fixture(search); session.setOpen(true); await session.whenSettled();
  expect(counts()).toEqual({ mounts: 0, disposals: 0, tabs: 0, unmounts: 0 }); session.dispose();
 });
 it("observes lazily, releases on close and mounts a fresh view on reopen", async () => {
  const { session, counts } = fixture("?dev=1"); expect(counts().mounts).toBe(0); expect(counts().tabs).toBe(1);
  session.setOpen(true); await session.whenSettled(); expect(counts().mounts).toBe(1);
  session.setOpen(false); await session.whenSettled(); expect(counts().disposals).toBe(1);
  session.setOpen(true); await session.whenSettled(); expect(counts().mounts).toBe(2);
  session.dispose(); session.dispose(); await session.whenSettled();
  expect(counts()).toEqual({ mounts: 2, disposals: 2, tabs: 0, unmounts: 2 });
 });
});
