import Link from 'next/link';
import { ReactElement } from 'react';
import { Month } from 'types/gql';
import {
  MonthBucketer,
  bucketSumF,
  netF,
  netSavingsF,
} from 'util/monthBucketer';

type Props = {
  month: Month;
};

export default function MonthTableRow({ month }: Props): ReactElement {
  const monthBuckets = MonthBucketer(month);
  return (
    <>
      <tr>
        <td>
          <Link
            href={{
              pathname: '/month/[monthId]',
              query: { monthId: month.id },
            }}
          >
            {month.name}
          </Link>
        </td>
        <td className="amount">{bucketSumF(monthBuckets, 'in')}</td>
        <td className="amount">{bucketSumF(monthBuckets, 'out')}</td>
        <td className="amount">{netF(monthBuckets)}</td>
        <td className="amount">{bucketSumF(monthBuckets, 'savings_in')}</td>
        <td className="amount">{bucketSumF(monthBuckets, 'savings_out')}</td>
        <td className="amount">{netSavingsF(monthBuckets)}</td>
        <td className="amount">{bucketSumF(monthBuckets, 'extra')}</td>
      </tr>
    </>
  );
}
