/**
 * What one Kubernetes deployment of a component actually runs, as last observed.
 *
 * The counterpart to `Component.activeVersionId`: that is what should run, this is what does.
 * One row per deployment — a component running several version lines has several.
 */
export class ComponentStatus {
    public id: string;
    public componentId: string;

    public namespace: string;
    public deploymentName: string;

    /** Fully-qualified image including the tag, exactly as the container reports it. */
    public image: string;

    public readyReplicas: number;
    public desiredReplicas: number;

    /**
     * Whether enough replicas are ready to serve. **True for a deployment scaled to zero** — with no
     * replicas wanted, the requirement is trivially met. Treat `desiredReplicas > 0 &&
     * readyReplicas < desiredReplicas` as unhealthy rather than trusting this alone.
     */
    public available: boolean;

    /**
     * Reads backwards: false means the last rollout missed its deadline, i.e. the deploy failed.
     * True covers both a settled deployment and one still rolling out. Replica counts cannot
     * substitute — a new pod that never becomes ready leaves the old ones serving, so the counts
     * still look right while the deploy has failed.
     */
    public progressing: boolean;

    /** When the cluster was last read. Stale means nobody has looked, not that all is well. */
    public observedAt: Date;
}
