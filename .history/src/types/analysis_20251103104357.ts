export interface AnalysisData {
  analysis_metadata: {
    customer_id: string;
    analysis_timestamp: string;
    framework_version: string;
    total_components_analyzed: number;
    configuration_based: boolean;
    framework_info: {
      name: string;
      version: string;
      configuration_validated: boolean;
      gmb_ecc_methodology: string;
      total_component_types: number;
    };
  };
  system_summary: {
    average_efficiency_gap: number;
    total_annual_savings_potential_eur: number;
    system_health_score: number;
    well_tuned_components: number;
    partially_optimized_components: number;
    misconfigured_components: number;
    critical_components: number;
    data_quality_score: number;
  };
  component_results: {
    [key: string]: ComponentResult;
  };
}

export interface ComponentResult {
  component_info: {
    component_id: string;
    component_type: string;
    location: string;
    analysis_timestamp: string;
    type_detection_confidence: number;
  };
  efficiency_analysis: {
    current_efficiency: number;
    optimal_efficiency: number;
    efficiency_gap: number;
    current_utilization: number;
    optimal_utilization: number;
  };
  benchmarking: {
    category: string;
    priority: string;
    efficiency_gap: number;
    annual_savings_potential_eur: number;
    optimization_effort_score: number;
  };
  summary: {
    annual_savings_potential_eur: number;
    optimization_priority_score: number;
    implementation_effort_score: number;
    data_quality: string;
  };
}
