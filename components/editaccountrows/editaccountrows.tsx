import { MouseEvent, ReactElement } from 'react';
import { EditableAccountRow } from 'types/editables';
import EditAccountRow from '@components/editaccountrows/editaccountrow';
import { AccountRow } from 'types/gql';

type Props = {
  accountRows: AccountRow[];
  saveChangedRows: (accountRows: AccountRow[]) => void;
};

export default function EditAccountRows({ accountRows, saveChangedRows }: Props): ReactElement {
  const save = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    saveChangedRows(accountRows as EditableAccountRow[]);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Text</th>
            <th>Belopp</th>
            <th>Spara</th>
            <th>Månad</th>
          </tr>
        </thead>
        <tbody>
          {accountRows &&
            accountRows.map((row, i: number) => (
              // cast accountrow to EditableAccountRow to enable extra attributes
              <EditAccountRow key={i} accountRow={row as EditableAccountRow} />
            ))}
        </tbody>
      </table>
      <button onClick={save}>Spara</button>
    </>
  );
}
