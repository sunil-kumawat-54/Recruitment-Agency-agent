import { useState } from 'react';
import toast from 'react-hot-toast';

export const useAgent = <T, Args extends any[]>(
  agentFn: (...args: Args) => Promise<T>,
  successMessage?: string
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (...args: Args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agentFn(...args);
      setData(result);
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (err: any) {
      console.error(err);
      setError(err);
      toast.error(err.response?.data?.detail || 'Agent diagnostic run failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { loading, data, error, execute, reset };
};
