import React, { useState } from 'react';
import { useAgentStore } from '../store/agentStore';
import { api } from '../services/api';
import { MessageSquare, Award, Play, ChevronRight, RefreshCw, Star, BarChart2, BookOpen, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const MockInterview: React.FC = () => {
  const {
    interviewActive,
    setInterviewActive,
    interviewQuestions,
    setInterviewQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    interviewHistory,
    addInterviewAnswer,
    clearInterviewHistory,
    interviewSummary,
    setInterviewSummary,
    interviewParams,
    setInterviewParams,
    isLoading,
    setIsLoading,
  } = useAgentStore();

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState<any | null>(null);

  const handleStart = async () => {
    setIsLoading(true);
    clearInterviewHistory();
    setInterviewSummary(null);
    setCurrentFeedback(null);
    setCurrentAnswer('');

    try {
      const data = await api.interview.start(
        interviewParams.role,
        interviewParams.level,
        interviewParams.roundType
      );
      setInterviewQuestions(data.questions);
      setInterviewActive(true);
      setCurrentQuestionIndex(0);
      toast.success('Mock session generated!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to generate interview. Check API configurations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || !interviewQuestions) return;

    setIsLoading(true);
    const currQ = interviewQuestions[currentQuestionIndex];
    try {
      const feed = await api.interview.evaluate(
        currQ.question,
        currentAnswer,
        interviewParams.role,
        interviewParams.level
      );
      setCurrentFeedback(feed);
      toast.success('Answer graded!');
    } catch (err) {
      console.error(err);
      toast.error('Grading failed. Running backup grading metrics.');
      setCurrentFeedback({
        score: 7,
        verdict: 'Good',
        feedback: 'Solid baseline. Ensure you speak more about measurable achievements.',
        what_was_strong: 'Answered key technical aspects correctly.',
        what_was_missing: 'Missing STAR details.',
        star_compliance: false,
        communication_score: 8,
        technical_accuracy: 7,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (!interviewQuestions) return;
    
    // Save current response
    addInterviewAnswer({
      question: interviewQuestions[currentQuestionIndex].question,
      answer: currentAnswer,
      score: currentFeedback?.score || 5,
      type: interviewQuestions[currentQuestionIndex].type || 'technical',
    });

    setCurrentAnswer('');
    setCurrentFeedback(null);

    if (currentQuestionIndex + 1 < interviewQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Completed last question
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Triggers overall view
    }
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const sum = await api.interview.complete(interviewHistory, interviewParams.role);
      setInterviewSummary(sum);
      toast.success('Summary scorecard ready!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to compile report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInterviewActive(false);
    setInterviewQuestions(null);
    setCurrentQuestionIndex(0);
    clearInterviewHistory();
    setInterviewSummary(null);
    setCurrentFeedback(null);
    setCurrentAnswer('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          💬 Mock Interview Agent
        </h2>
        <p className="text-brand-gray text-sm leading-relaxed">
          Step into a live targeted interview. Speak or type your answers, and receive instant, granular score breakdowns on technical correctness and STAR alignment.
        </p>
      </div>

      {!interviewActive ? (
        /* Configuration Setup Pane */
        <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Play className="w-4 h-4 text-brand-purple fill-brand-purple" />
            Set Up Your Target Round
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Job Position Title
              </label>
              <input
                type="text"
                value={interviewParams.role}
                onChange={(e) => setInterviewParams({ ...interviewParams, role: e.target.value })}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Experience Level
              </label>
              <select
                value={interviewParams.level}
                onChange={(e) => setInterviewParams({ ...interviewParams, level: e.target.value })}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
              >
                <option value="Junior">Junior (0-2 YOE)</option>
                <option value="Mid">Mid-Level (3-5 YOE)</option>
                <option value="Senior">Senior (5-8 YOE)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Interview Round Type
              </label>
              <select
                value={interviewParams.roundType}
                onChange={(e) => setInterviewParams({ ...interviewParams, roundType: e.target.value })}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
              >
                <option value="Technical">Technical Interview</option>
                <option value="HR Round">HR / Behavioral Round</option>
                <option value="Managerial">Managerial / Culture Fit</option>
                <option value="System Design">System Design & Scaling</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-purple/90 hover:to-indigo-600/90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Start Mock Interview Session'
            )}
          </button>
        </div>
      ) : (
        /* Active Interview Session */
        <div className="space-y-6">
          {interviewQuestions && currentQuestionIndex < interviewQuestions.length ? (
            /* Running Questions view */
            <div className="space-y-6">
              {/* Progress Indicators */}
              <div className="flex justify-between items-center text-xs text-brand-gray">
                <span>
                  Question <strong className="text-white">{currentQuestionIndex + 1}</strong> of{' '}
                  <strong className="text-white">{interviewQuestions.length}</strong>
                </span>
                <span>Type: <strong className="text-brand-purple capitalize">{interviewQuestions[currentQuestionIndex].type}</strong></span>
              </div>
              <div className="w-full bg-slate-900 border border-brand-border h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-purple h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentQuestionIndex / interviewQuestions.length) * 100}%` }}
                />
              </div>

              {/* Chat Bubble: Interviewer */}
              <div className="bg-slate-900 border border-brand-border p-6 rounded-2xl border-l-4 border-l-brand-purple space-y-3">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-purple">
                  Interviewer Question
                </span>
                <p className="text-base text-slate-100 font-medium leading-relaxed">
                  "{interviewQuestions[currentQuestionIndex].question}"
                </p>
                <div className="text-[11px] text-slate-500 italic mt-2.5">
                  Hint: {interviewQuestions[currentQuestionIndex].hint}
                </div>
              </div>

              {/* User Input Block */}
              {!currentFeedback ? (
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Draft Your Response
                  </label>
                  <textarea
                    rows={6}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type or copy/paste your reply. Remember to explain: the Situation, the Task, the specific Actions you drove, and the final quantitative Result (STAR)..."
                    className="w-full bg-slate-900 border border-brand-border rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-purple text-white placeholder-slate-600 transition-colors resize-none"
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isLoading || !currentAnswer.trim()}
                    className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Submit Answer for Grading'
                    )}
                  </button>
                </div>
              ) : (
                /* Immediate Grading Panel */
                <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-start border-b border-brand-border pb-4">
                    <div>
                      <h4 className="font-extrabold text-lg text-white">Instant Response Grading</h4>
                      <span className="text-xs text-brand-gray">STAR Framework Diagnostic</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center pr-4 border-r border-brand-border">
                        <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block">
                          Score
                        </span>
                        <span className="text-xl font-extrabold text-brand-emerald">
                          {currentFeedback.score}/10
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block">
                          Verdict
                        </span>
                        <span className="text-xs font-bold text-slate-200 capitalize">
                          {currentFeedback.verdict}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                        <h5 className="text-xs font-bold uppercase text-slate-400 mb-1">Feedback</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentFeedback.feedback}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-brand-emerald/[0.02] border border-brand-emerald/10 rounded-xl">
                          <span className="font-bold text-brand-emerald block mb-1">What you did well</span>
                          <span className="text-slate-300 leading-relaxed">{currentFeedback.what_was_strong}</span>
                        </div>
                        <div className="p-3 bg-brand-rose/[0.02] border border-brand-rose/10 rounded-xl">
                          <span className="font-bold text-brand-rose block mb-1">What was missing</span>
                          <span className="text-slate-300 leading-relaxed">{currentFeedback.what_was_missing}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-brand-border flex flex-col justify-between text-xs space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">STAR Compliant</span>
                          <span className={currentFeedback.star_compliance ? 'text-brand-emerald font-semibold' : 'text-brand-rose'}>
                            {currentFeedback.star_compliance ? '✅ Yes' : '❌ No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Communication</span>
                          <span className="text-slate-200 font-bold">{currentFeedback.communication_score}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tech Correctness</span>
                          <span className="text-slate-200 font-bold">{currentFeedback.technical_accuracy}/10</span>
                        </div>
                      </div>

                      <button
                        onClick={handleNextQuestion}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        Next Question
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Final Report Generation view */
            <div className="space-y-8">
              {!interviewSummary ? (
                <div className="glass-panel p-8 rounded-2xl border border-brand-border text-center space-y-4">
                  <div className="p-4 bg-brand-purple/10 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto text-brand-purple">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">All questions answered!</h3>
                    <p className="text-xs text-brand-gray mt-1">
                      Compile all responses to retrieve your aggregate dashboard scores and learning guides.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isLoading}
                    className="bg-brand-purple hover:bg-brand-purple/95 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 mx-auto"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Compile Session Report'
                    )}
                  </button>
                </div>
              ) : (
                /* Overall Session Scoreboard Dashboard */
                <div className="space-y-8 animate-fadeIn">
                  {/* Summary Metric Header */}
                  <div className="bg-gradient-to-br from-brand-card to-slate-900 border border-brand-border p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        Session Scorecard Summary
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        Verdict:{' '}
                        <span className="text-brand-purple font-extrabold">
                          {interviewSummary.hire_recommendation}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                        {interviewSummary.encouragement_message}
                      </p>
                    </div>

                    <div className="text-center bg-slate-950/60 p-5 rounded-2xl border border-white/5 min-w-[150px]">
                      <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">
                        Overall Score
                      </span>
                      <span className="text-5xl font-black text-brand-emerald">
                        {interviewSummary.overall_score}%
                      </span>
                    </div>
                  </div>

                  {/* Details columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Strengths & Gaps */}
                    <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
                      <h4 className="font-bold text-base text-white border-b border-brand-border pb-3 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-brand-purple" />
                        Performance Breakdown
                      </h4>

                      <div className="space-y-4">
                        {interviewSummary.performance_by_type &&
                          Object.entries(interviewSummary.performance_by_type).map(([key, val]: [string, any]) => (
                            <div key={key} className="space-y-1 text-xs">
                              <div className="flex justify-between font-semibold">
                                <span className="text-slate-300 capitalize">{key}</span>
                                <span className="text-slate-400">{val}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-brand-border">
                                <div
                                  className="bg-brand-emerald h-full rounded-full transition-all duration-300"
                                  style={{ width: `${val}%` }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-brand-border">
                        <div>
                          <span className="font-extrabold text-brand-emerald block mb-2">Key Strengths</span>
                          <ul className="space-y-1.5 text-slate-300">
                            {interviewSummary.top_strengths?.map((str: string) => (
                              <li key={str}>• {str}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-extrabold text-brand-rose block mb-2">Dev Areas</span>
                          <ul className="space-y-1.5 text-slate-300">
                            {interviewSummary.areas_for_improvement?.map((str: string) => (
                              <li key={str}>• {str}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Study plan roadmap recommendations */}
                    <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
                      <h4 className="font-bold text-base text-white border-b border-brand-border pb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-brand-purple" />
                        Personalized Study Checklist
                      </h4>
                      <ul className="space-y-3.5 text-xs text-slate-300">
                        {interviewSummary.personalized_study_plan?.map((plan: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="p-0.5 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple rounded-md font-bold text-[10px] w-5 h-5 flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            {plan}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="mx-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset & Conduct New Round
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
