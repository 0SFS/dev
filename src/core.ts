import { createDevSession, type DevContribution, type DevSessionOptions, type DevViewHandle } from "@foss-earth/dev";
import type { AcceptedFlightObservation } from "@0sfs/simulator/contracts";

/** Read-only existing accepted authority; no stepping, controls or capture ports. */
export interface AcceptedFlightObserver {
  read(): AcceptedFlightObservation | null;
  subscribe(listener: (observation: AcceptedFlightObservation) => void): () => void;
}
export interface FlightDevPorts<View> {
  acceptedFlight: AcceptedFlightObserver;
  mountAcceptedFlightView(context: { acceptedFlight: AcceptedFlightObserver; signal: AbortSignal }): DevViewHandle<View> | Promise<DevViewHandle<View>>;
}
export function createAcceptedFlightContribution<View>(): DevContribution<FlightDevPorts<View>, View> {
  return {
    id: "flight-accepted-state", title: "Accepted flight state", owner: "0sfs/simulator",
    description: "Observe the existing accepted runtime/epoch/step and native time.",
    mount({ ports, signal }) { return ports.mountAcceptedFlightView({ acceptedFlight: ports.acceptedFlight, signal }); },
  };
}

/** The shared package owns the exact ?dev=1 gate, one tab and async disposal. */
export function createFlightDevSession<View>(options: Omit<DevSessionOptions<FlightDevPorts<View>, View>, "contributions">) {
  return createDevSession({ ...options, contributions: [createAcceptedFlightContribution<View>()] });
}
