import useSWR from 'swr';
import Link from 'next/link';
import { IAccountRow, ISubRow, IMonth } from '@models/index';

export default function Month() {
  const { data: monthsData, mutate: monthsMutate } = useSWR(
    `{ months{ id name accountrows{ date desc text amount subrows { category { name } amount } } } }`
  );

  return (
    <>
      <h1>Månader</h1>
      <table>
        <thead>
          <tr>
            <th>Månad</th>
            <th>In</th>
            <th>Ut</th>
            <th>Diff</th>
            <th>Sparas</th>
            <th>Extra</th>
          </tr>
        </thead>
        <tbody>
          {monthsData &&
            monthsData.months.map((month: IMonth, i: number) => (
              <>
                <MonthTableRow key={i} month={month} />
              </>
            ))}
        </tbody>
      </table>
    </>
  );
}

const MonthTableRow = ({ month }) => {
  const rowGroups = {
    in: [],
    out: [],
    savings: [],
    extra: [],
  };
  function groupSum(name) {
    return rowGroups[name].reduce((tot, v) => tot + v.amount, 0);
  }
  function groupSumF(name) {
    return rowGroups[name]
      .reduce((tot, v) => tot + v.amount, 0)
      .toLocaleString('sv-SE', { minimumFractionDigits: 2 });
  }

  console.log('mont accountrows', month.accountrows);
  month.accountrows.forEach((accountRow) => {
    if (accountRow.savings) {
      rowGroups.savings.push(accountRow);
    } else {
      if (accountRow.amount > 0) {
        rowGroups.in.push(accountRow);
      } else {
        rowGroups.out.push(accountRow);
      }
    }
    if (accountRow.extra) {
      rowGroups.extra.push(accountRow);
    }
  });
  console.log('ROWGROUPS', rowGroups);

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
        <td>{groupSumF('in')}</td>
        <td>{groupSumF('out')}</td>
        <td>
          {(groupSum('in') - groupSum('out')).toLocaleString('sv-SE', {
            minimumFractionDigits: 2,
          })}
        </td>
        <td>{groupSumF('savings')}</td>
        <td>{groupSumF('extra')}</td>
      </tr>
    </>
  );
};
