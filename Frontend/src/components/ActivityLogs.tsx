import { ActivityLog } from '../types';

interface ActivityLogsProps {
  logs: ActivityLog[];
}

export const ActivityLogs = ({ logs }: ActivityLogsProps) => {
  if (logs.length === 0) {
    return <p className="no-logs">No activity logs available.</p>;
  }

  return (
    <div className="activity-logs">
      <h4>Activity Logs</h4>
      <ul>
        {logs.map((log) => (
          <li key={log._id} className="log-item">
            <div className="log-change">
              Status changed from <strong>{log.previousStatus}</strong> to <strong>{log.newStatus}</strong>
            </div>
            <span className="log-timestamp">
              {new Date(log.changedAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};