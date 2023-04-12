import { useRouter } from 'next/router';
import useSWR from 'swr';
import { IAccountRow } from '@models/index';

export default function Month() {
  const router = useRouter();
  const { monthId } = router.query;
  const monthData = useSWR(
    `{ month(id: "${monthId}"){ name accountrows{ date datef desc text amount amountf subrows { category { name } amount } } } }`
  );

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

  if (monthData.data) {
    const { month } = monthData.data;

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

    return (
      <>
        <h1>{month.name}</h1>
        <h2>In {groupSumF('in')}</h2>
        <RowTable accountrows={rowGroups.in}/>
        <h2>Extra {groupSumF('extra')}</h2>
        <RowTable accountrows={rowGroups.extra}/>
        <h2>Sparat {groupSumF('savings')}</h2>
        <RowTable accountrows={rowGroups.savings}/>
        <h2>Kontorader</h2>
        {month.accountrows && (<RowTable accountrows={month.accountrows}/>)}
      </>
    );
  }
}

const RowTable = ({ accountrows }) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Text</th>
            <th>Belopp</th>
          </tr>
        </thead>
        <tbody>
          {accountrows.map((row: IAccountRow) => (
              <>
                <tr>
                  <td>{row.datef}</td>
                  <td>{row.desc}</td>
                  <td>{row.amountf}</td>
                </tr>
              </>
            ))}
        </tbody>
      </table>
    </>
  );
};
