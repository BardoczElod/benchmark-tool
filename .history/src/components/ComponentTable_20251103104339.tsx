import { ComponentResult } from '../types/analysis';

interface ComponentTableProps {
  components: { [key: string]: ComponentResult };
}

export const ComponentTable = ({ components }: ComponentTableProps) => {
  const getStatusClass = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower === 'well-tuned') return 'status-well-tuned';
    if (categoryLower === 'partially-optimized' || categoryLower === 'partially optimized')
      return 'status-partially-optimized';
    if (categoryLower === 'misconfigured') return 'status-misconfigured';
    if (categoryLower === 'critical') return 'status-critical';
    return 'status-unknown';
  };

  const formatComponentType = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <table className="component-table">
      <thead>
        <tr>
          <th>Component ID</th>
          <th>Type</th>
          <th>Current Efficiency</th>
          <th>Optimal Efficiency</th>
          <th>Normalized Efficiency Gap</th>
          <th>Savings Potential</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(components).map(([id, component]) => (
          <tr key={id}>
            <td>
              <strong>{component.component_info.component_id}</strong>
            </td>
            <td>{formatComponentType(component.component_info.component_type)}</td>
            <td>{component.efficiency_analysis.current_efficiency.toFixed(1)}%</td>
            <td>{component.efficiency_analysis.optimal_efficiency.toFixed(1)}%</td>
            <td>{(component.efficiency_analysis.efficiency_gap * 100).toFixed(1)}%</td>
            <td>€{Math.round(component.benchmarking.annual_savings_potential_eur)}</td>
            <td>
              <span className={`status-badge ${getStatusClass(component.benchmarking.category)}`}>
                {component.benchmarking.category}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
