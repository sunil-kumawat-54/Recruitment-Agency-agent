import { useState } from 'react';
import { useAgentStore } from '../store/agentStore';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const useInterview = () => {
  const {
    setInterviewQuestions,
    setInterviewActive,
    setCurrentQuestionIndex,
    clearInterviewHistory,
    setInterviewSummary,
    interviewHistory,
    addInterviewAnswer,
    currentQuestionIndex,
    interviewQuestions,
    interviewParams,
  } = useAgentStore();

  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    setLoading(true);
    clearInterviewHistory();
    setInterviewSummary(null);
    try {
      const data = await api.interview.start(
        interviewParams.role,
        interviewParams.level,
        interviewParams.roundType
      );
      setInterviewQuestions(data.questions);
      setInterviewActive(true);
      setCurrentQuestionIndex(0);
      toast.success('Interview session configured!');
      return data.questions;
    } catch (err) {
      toast.error('Failed to configure interview questions.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async (answer: string) => {
    if (!interviewQuestions) return;
    setLoading(true);
    const currQ = interviewQuestions[currentQuestionIndex];
    try {
      const report = await api.interview.evaluate(
        currQ.question,
        answer,
        interviewParams.role,
        interviewParams.level
      );
      addInterviewAnswer({
        question: currQ.question,
        answer,
        score: report.score,
        type: currQ.type,
      });
      toast.success('Answer evaluated!');
      return report;
    } catch (err) {
      toast.error('Failed to evaluate answer.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finalizeSession = async () => {
    setLoading(true);
    try {
      const summary = await api.interview.complete(interviewHistory, interviewParams.role);
      setInterviewSummary(summary);
      toast.success('Session evaluation compiled!');
      return summary;
    } catch (err) {
      toast.error('Session compile aborted.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, startSession, evaluateAnswer, finalizeSession };
};
export default useInterview;
