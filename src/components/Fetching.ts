import { useFetching } from '../hooks';

export function Fetching() {
  useFetching(() => console.log(`[${Date.now()}] Fetching products`));
  return null;
}
