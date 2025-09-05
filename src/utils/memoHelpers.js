import { memo, useMemo, useCallback } from 'react';

export const memoComponent = (Component) => memo(Component, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});

export const useMemoizedData = (data, deps = []) => {
  return useMemo(() => data, deps);
};

export const useMemoizedCallback = (callback, deps = []) => {
  return useCallback(callback, deps);
};

export const createMemoizedSelector = (selector) => {
  let lastArgs = null;
  let lastResult = null;
  
  return (...args) => {
    if (!lastArgs || !args.every((arg, i) => arg === lastArgs[i])) {
      lastArgs = args;
      lastResult = selector(...args);
    }
    return lastResult;
  };
};