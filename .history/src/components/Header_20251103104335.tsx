import { AnalysisData } from '../types/analysis';

interface HeaderProps {
  data: AnalysisData;
}

export const Header = ({ data }: HeaderProps) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="header">
      <div className="header-content">
        <h1>GMB-ECC Energy Efficiency Analysis Report - {data.analysis_metadata.customer_id}</h1>
        <p>
          Customer: {data.analysis_metadata.customer_id} | Analysis Date:{' '}
          {formatDate(data.analysis_metadata.analysis_timestamp)}
        </p>
        <div className="badges">
          <span className="enhanced-badge">GMB-ECC Analysis</span>
          <span className="enhanced-badge">Professional Report</span>
          <span className="enhanced-badge">Component Analysis</span>
          <span className="enhanced-badge">{data.analysis_metadata.framework_version}</span>
        </div>
      </div>
    </div>
  );
};
