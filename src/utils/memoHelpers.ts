import { memo, useMemo, useCallback, ComponentType } from 'react';

export const memoComponent = <T extends ComponentType<any>>(Component: T): T => 
  memo(Component, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  }) as T;

export const useMemoizedData = <T>(data: T, deps: React.DependencyList = []): T => {
  return useMemo(() => data, deps);
};

export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T, 
  deps: React.DependencyList = []
): T => {
  return useCallback(callback, deps);
};

export const createMemoizedSelector = <TArgs extends any[], TResult>(
  selector: (...args: TArgs) => TResult
) => {
  let lastArgs: TArgs | null = null;
  let lastResult: TResult;
  
  return (...args: TArgs): TResult => {
    if (!lastArgs || !args.every((arg, i) => arg === lastArgs![i])) {
      lastArgs = args;
      lastResult = selector(...args);
    }
    return lastResult;
  };
};