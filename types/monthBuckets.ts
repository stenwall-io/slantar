import { SubRow } from 'types/gql';

export type MonthBuckets = {
  in: SubRow[];
  out: SubRow[];
  savings_in: SubRow[];
  savings_out: SubRow[];
  savings: SubRow[];
  extra: SubRow[];
};
