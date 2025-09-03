import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/admin';

export default function AnalyticsDashboard() {
	const [summary, setSummary] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				if (adminAPI && adminAPI.getSummary) {
					const data = await adminAPI.getSummary();
					if (mounted) setSummary(data);
				}
			} catch (err) {
				if (mounted) setError(err.message || 'Failed to load analytics');
			}
		})();
		return () => (mounted = false);
	}, []);

	if (error) return <div className="analytics-error">{error}</div>;
	if (!summary) return <div className="analytics-loading">Loading analytics...</div>;

	return (
		<div className="analytics-dashboard">
			<h2>Analytics Summary</h2>
			<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(summary, null, 2)}</pre>
		</div>
	);
}

