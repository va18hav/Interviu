import { designChangeTracker } from './DesignChangeTracker.js';

// Reset tracker
designChangeTracker.reset();

// Simulate 5 changes
const changes = [
    { type: 'component_added', component: { id: 'c1', type: 'client', config: {} } },
    { type: 'component_added', component: { id: 'c2', type: 'load_balancer', config: { algorithm: 'Round Robin' } } },
    { type: 'connection_added', fromComponent: 'Client', toComponent: 'Load Balancer', from: 'c1', to: 'c2' },
    { type: 'component_added', component: { id: 'c3', type: 'service', config: { label: 'Auth' } } },
    { type: 'connection_added', fromComponent: 'Load Balancer', toComponent: 'Auth Series', from: 'c2', to: 'c3' }
];

// Replicate TestInterview.jsx logic

changes.forEach((change, i) => {
    const summary = designChangeTracker.recordChange(change);
    const count = designChangeTracker.getUnsyncedCount();

    if (count >= 5) {

        const updates = designChangeTracker.getChangesSinceLastSync();
        const consolidatedSummary = designChangeTracker.generateConsolidatedSummary(updates);

        // Use the components/connections from our mock for context
        // In real app these come from refs, here we construct them loosely for testing context gen
        const mockComponents = [
            { id: 'c1', type: 'client' },
            { id: 'c2', type: 'load_balancer', config: { algorithm: 'Round Robin' } },
            { id: 'c3', type: 'service', config: { label: 'Auth' } }
        ];
        const mockConnections = [
            { from: 'c1', to: 'c2' },
            { from: 'c2', to: 'c3' }
        ];

        const context = designChangeTracker.summarizeState(mockComponents, mockConnections);



        designChangeTracker.markAsSynced();

    }
});
