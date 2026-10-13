# Observation-only Dev

The public root has no DOM/React/renderer imports. `AcceptedFlightObserver`
uses the simulator's immutable accepted observation with runtime/epoch/step,
native seconds, fixed-step duration and numeric state. It exposes only read and
subscribe; views must unsubscribe in their disposer. No native stepping/control
port is available. View factories receive the shared AbortSignal and return one
view/disposer. They allocate no optional resources until the shared gate mounts
them on opening the single Dev tab; late mounts and close/reopen disposal remain
with `@foss-earth/dev`.

The host uses its existing renderer/panel services for the view. This contribution
is additional to the 21 current tabs; it does not rename/delete Debug, start
performance captures or move feature diagnostics into a second home. Exact
public shared artifact adoption and the actual observation UI are pending.
