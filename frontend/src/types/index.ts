export interface ResumeReport {
  ats_score: number;
  grade: string;
  summary_feedback: string;
  keyword_analysis: {
    found_keywords: string[];
    missing_critical_keywords: string[];
  };
  section_scores: {
    work_experience: number;
    education: number;
    skills: number;
    formatting: number;
  };
  strengths: string[];
  critical_improvements: string[];
  quick_wins: string[];
}

export interface Question {
  question: string;
  type: 'technical' | 'behavioral';
  hint: string;
}

export interface InterviewFeedback {
  score: number;
  verdict: string;
  feedback: string;
  what_was_strong: string;
  what_was_missing: string;
  star_compliance: boolean;
}

export interface InterviewSummary {
  overall_score: number;
  hire_recommendation: string;
  encouragement_message: string;
  performance_by_type: Record<string, number>;
  top_strengths: string[];
  areas_for_improvement: string[];
  personalized_study_plan: string[];
}

export interface SkillGapReport {
  gap_score: number;
  readiness_level: string;
  time_to_ready: string;
  motivational_message: string;
  radar_chart_data: {
    categories: string[];
    current_scores: number[];
    target_scores: number[];
  };
  critical_gaps: Array<{
    skill: string;
    why_needed: string;
    free_resource: string;
    paid_resource: string;
  }>;
  learning_roadmap: Array<{
    phase: number;
    phase_name: string;
    duration: string;
    skills_to_learn: string[];
    daily_tasks: string[];
    milestone: string;
    project_to_build: string;
  }>;
}

export interface JobMatchReport {
  total_matches: number;
  market_demand: string;
  recommended_resume_tweaks: string[];
  top_matches: Array<{
    job_title: string;
    company: string;
    location: string;
    salary_range: string;
    match_percentage: number;
    why_this_job: string;
    match_breakdown: Record<string, number>;
    potential_concerns: string[];
    application_tip: string;
  }>;
}

export interface SalaryReport {
  negotiation_verdict: string;
  your_market_value: number;
  recommended_ask: number;
  market_salary_range: {
    minimum: number;
    median: number;
    maximum: number;
    currency: string;
  };
  market_trend: string;
  confidence_level: string;
  negotiation_strategy: {
    strategy_name: string;
    opening_number: number;
    ideal_outcome: number;
    minimum_acceptable: number;
  };
  phrases_to_use: string[];
  phrases_to_avoid: string[];
  non_salary_benefits_to_negotiate: string[];
  email_template: string;
}
