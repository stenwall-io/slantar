import { AccountRow } from 'types/gql';
import { ReactElement } from 'react';

type Props = {
  accountRows: AccountRow[];
};

export default function AccountRowsTable({ accountRows }: Props): ReactElement {
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
          {accountRows.map((row, i:number) => (
            <>
              <tr key={i}>
                <td>{row.datef}</td>
                <td>{row.desc}</td>
                <td className="amount">{row.amountf}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </>
  );
}
