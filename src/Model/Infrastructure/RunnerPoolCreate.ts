// Create payload for a runner pool. Identifiers are derived server-side; config is set afterwards
// via the configuration endpoint (scope `rpl_<id>`).
export interface RunnerPoolCreate {
    name: string;
}
