import { SubRow } from 'types/gql';
import { ReactElement } from 'react';

type Props = {
  subRows: SubRow[];
};

export default function SubRowsTable({ subRows }: Props): ReactElement {
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
          {subRows.map((row, i:number) => (
            <>
              <tr key={i}>
                <td>{row.accountRow.datef}</td>
                <td>{row.accountRow.desc}</td>
                <td>{row.amountf}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </>
  );
}
