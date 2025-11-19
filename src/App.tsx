import { useState, useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { ComponentTable } from './components/ComponentTable';
import type { AnalysisData } from './types/analysis';

function App() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the JSON data
    fetch('/test_customer_analysis_20251006_123658.json')
      .then((response) => response.json())
      .then((jsonData: AnalysisData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading analysis data...</div>;
  }

  if (!data) {
    return <div className="error">Error loading data. Please check the console.</div>;
  }

  const summary = data.system_summary;
  const totalComponents = data.analysis_metadata.total_components_analyzed;

  const executiveSummaryCards = [
    {
      value: `${(summary.system_health_score * 100).toFixed(1)}%`,
      label: 'System Health Score',
      color: '#e74c3c',
      sublabel: 'Critical',
    },
    {
      value: `€${Math.round(summary.total_annual_savings_potential_eur).toLocaleString()}`,
      label: 'Annual Savings Potential',
    },
    {
      value: `${(summary.average_efficiency_gap * 100).toFixed(1)}%`,
      label: 'Average Efficiency Gap',
    },
    {
      value: `${(summary.data_quality_score * 100).toFixed(1)}%`,
      label: 'Data Quality Score',
    },
  ];

  const distributionCards = [
    {
      value: summary.well_tuned_components,
      label: 'Well-Tuned Components',
      color: '#27ae60',
      sublabel: `${((summary.well_tuned_components / totalComponents) * 100).toFixed(1)}% of total`,
    },
    {
      value: summary.partially_optimized_components,
      label: 'Partially Optimized',
      color: '#f39c12',
      sublabel: `${((summary.partially_optimized_components / totalComponents) * 100).toFixed(1)}% of total`,
    },
    {
      value: summary.misconfigured_components,
      label: 'Misconfigured',
      color: '#e74c3c',
      sublabel: `${((summary.misconfigured_components / totalComponents) * 100).toFixed(1)}% of total`,
    },
    {
      value: totalComponents,
      label: 'Total Components',
    },
  ];

  return (
    <div className="container">
      <Header data={data} />

      <div className="section">
        <h2>Executive Summary</h2>
        <SummaryCards cards={executiveSummaryCards} />
      </div>

      <div className="section">
        <h2>System Overview</h2>
        <h3>Component Distribution</h3>
        <SummaryCards cards={distributionCards} />
      </div>

      <div className="section">
        <h2>Component Analysis</h2>
        <p>Detailed analysis of {totalComponents} system components.</p>
        <ComponentTable components={data.component_results} />
      </div>

      <div className="footer">
        <div className="footer-content">
          <p>
            <strong>GMB-ECC Energy Efficiency Analysis Framework</strong>
          </p>
          <p>Professional Analysis | Comprehensive Reporting | Data-Driven Insights</p>
          <p>
            Report generated on{' '}
            {new Date(data.analysis_metadata.analysis_timestamp).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            UTC
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            Version: {data.analysis_metadata.framework_version} | Framework Analysis Complete
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
