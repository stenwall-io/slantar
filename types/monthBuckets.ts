import { HasAmount } from 'types/hasamount';

export type MonthBuckets = {
  in: HasAmount[];
  out: HasAmount[];
  savings_in: HasAmount[];
  savings_out: HasAmount[];
  extra: HasAmount[];
};
