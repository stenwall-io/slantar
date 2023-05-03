import { AccountRow, Month, SubRow } from 'types/gql';
import { HasAmount } from 'types/hasamount';
import { MonthBuckets } from 'types/monthBuckets';

export const MonthBucketer = (month: Month) => {
  const monthBuckets = {
    in: [],
    out: [],
    savings_in: [],
    savings_out: [],
    savings: [],
    extra: [],
  } as MonthBuckets;

  month.accountrows &&
    month.accountrows.forEach((accountRow: AccountRow) => {
      accountRow.subrows &&
        accountRow.subrows.forEach((subRow: SubRow) => {
          if (accountRow.savings) {
            if (accountRow.amount > 0) {
              monthBuckets.savings_out.push(subRow);
            } else {
              monthBuckets.savings_in.push(subRow);
            }
          } else {
            if (accountRow.amount > 0) {
              monthBuckets.in.push(subRow);
            } else {
              monthBuckets.out.push(subRow);
            }
          }
          if (subRow.extra) {
            monthBuckets.extra.push(subRow);
          }
        });
    });
  return monthBuckets;
};

export function bucketSum(monthBuckets: MonthBuckets, name: string) {
  return monthBuckets[name as keyof MonthBuckets].reduce(
    (tot: number, v: HasAmount) => tot + v.amount,
    0
  );
}

export function bucketSumF(monthBuckets: MonthBuckets, name: string) {
  return monthBuckets[name as keyof MonthBuckets]
    .reduce((tot: number, v: HasAmount) => tot + v.amount, 0)
    .toLocaleString('sv-SE', { minimumFractionDigits: 2 });
}

export function netF(monthBuckets: MonthBuckets) {
  return (
    bucketSum(monthBuckets, 'in') + bucketSum(monthBuckets, 'out')
  ).toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
  });
}

export function netSavingsF(monthBuckets: MonthBuckets) {
  return (
    (bucketSum(monthBuckets, 'savings_in') +
    bucketSum(monthBuckets, 'savings_out')) * -1
  ).toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
  });
}
