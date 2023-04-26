import { ReactElement } from 'react';
import { EditableAccountRow, EditableSubRow} from 'types/editables';
import EditAccountRow from '@components/editaccountrow';
import { fetcher } from 'util/graphQLFetcher';

type Props = {
  accountRows: EditableAccountRow[];
};

export default function EditAccountRows({ accountRows }: Props): ReactElement {
  const saveChangedRows = (accountRows: EditableAccountRow[]) => {
    const accountrow_mutations = accountRows
      .filter((row: EditableAccountRow) => row.edited)
      .map((row: EditableAccountRow, i: number) => {
        const mutation = `m${i}: updateAccountRow(accountRowId: "${
          row.id
        }", monthId: "${
          row.newMonthId ? row.newMonthId : row.month.id
        }", desc:"${row.desc}", savings:${row.savings}){ id }`;
        const subrow_mutations = row.subrows
          .map((subrow: EditableSubRow, j: number) => {
            const amount = subrow.amountf
              .replace('\xa0', '')  // Non breaking space
              .replace(' ', '')  // Space
              .replace(',', '.')  // Comma to period
              .replace('\u2212', '-'); // Unicode minus sign
            console.log(amount);
            return `m${i}_${j}: updateSubRow(subRowId: "${
              subrow.id
            }", categoryId:"${
              subrow.category ? subrow.category.id : ''
            }", extra:${subrow.extra}, amount:${amount}){ id }`;
          })
          .join(' ');
        return mutation + ' ' + subrow_mutations;
      });

    const mutationQuery = `mutation{ ${accountrow_mutations.join(' ')}}`;
    fetcher(mutationQuery);
  };

  const save = () => {
    saveChangedRows(accountRows);
    //router.push('/month/' + monthId);
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
            accountRows.map((row: EditableAccountRow, i: number) => (
              <EditAccountRow key={i} accountRow={row} />
            ))}
        </tbody>
      </table>
      <button onClick={save}>Spara</button>
    </>
  );
}
