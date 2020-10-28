import { RestockData, SupremeMonitor } from './SupremeMonitor';
import { useEffect } from 'react';

const monitor = new SupremeMonitor('mobile_stock');

export function useMonitor(callback: (product: RestockData) => unknown): void {
  useEffect(() => {
    monitor.on('restock', callback);
    return () => void monitor.off('restock', callback);
  }, []);
}

export function useFetching(callback: () => unknown): void {
  useEffect(() => {
    monitor.on('fetching', callback);
    return () => void monitor.off('fetching', callback);
  });
}
