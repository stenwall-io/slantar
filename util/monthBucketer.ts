import { AccountRow, Month, SubRow } from 'types/gql';
import { MonthBuckets } from 'types/monthBuckets';

export const MonthBucketer = (month: Month) => {
  const monthBuckets = {
    in: [],
    out: [],
    savings_in: [],
    savings_out: [],
    extra: [],
  } as MonthBuckets;
  month.accountrows.forEach((accountRow: AccountRow) => {
    if (accountRow.savings) {
      if (accountRow.amount > 0) {
        monthBuckets.savings_out.push(accountRow);
      } else {
        monthBuckets.savings_in.push(accountRow);
      }
    } else {
      if (accountRow.amount > 0) {
        monthBuckets.in.push(accountRow);
      } else {
        monthBuckets.out.push(accountRow);
      }
    }
    accountRow.subrows &&
      accountRow.subrows.forEach((subRow: SubRow) => {
        if (subRow.extra) {
            monthBuckets.extra.push(subRow);
        }
      });
  });
};

export function bucketSum(monthBuckets: MonthBuckets, name: string) {
  return monthBuckets[name as keyof MonthBuckets].reduce(
    (tot: number, v: SubRow) => tot + v.amount,
    0
  );
}

export function bucketSumF(monthBuckets: MonthBuckets,name: string) {
  return monthBuckets[name as keyof MonthBuckets]
    .reduce((tot: number, v: SubRow) => tot + v.amount, 0)
    .toLocaleString('sv-SE', { minimumFractionDigits: 2 });
}
