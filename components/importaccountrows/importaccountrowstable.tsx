import { ReactElement, useEffect, useState } from 'react';
import { ImportAccountRow } from 'types/importaccountrow';
import ImportAccountRowsRow from './importaccountrowsrow';
import { AccountRow } from 'types/gql';
import { GraphQLMutation } from 'hooks/useGraphQL';

type Props = {
  accountId: string;
  accountRows: AccountRow[];
  rowsText: string;
  setParsed: (parsed: boolean) => void;
};

// An table to select rows to import
export default function ImportAccountRowsTable({
  accountId,
  accountRows,
  rowsText,
  setParsed,
}: Props): ReactElement {
  const [rows, setRows] = useState([]);

  const parseRows = (rowsText: string): ImportAccountRow[] | null => {
    const splitRows = rowsText.split('\n'); // Split into array of rows
    const columnRows = splitRows.map((row: string) => row.split('\t \t')); // Split each row into columns
    const filteredRows = columnRows.filter((columnRow: string[]) => {
      // Filter away 'Prel' rows
      if (!columnRow || columnRow.length != 5) return false;
      return columnRow[1].charAt(0) == '2' && !columnRow[2].startsWith('Prel');
    });
    const rowObjArr = filteredRows.map((rowColumn: string[]) => {
      // create array of "lightweight" AccoutRow objects
      if (rowColumn.length == 5) {
        const dateColumn = new Date(rowColumn[1]);
        let calcMonth = dateColumn.getMonth();
        let calcYear = dateColumn.getFullYear();
        // adjust to next month/year if after 25th
        if (dateColumn.getDate() >= 25) {
          if (calcMonth == 11) {
            calcMonth = 0;
            calcYear += 1;
          } else {
            calcMonth += 1;
          }
        }
        // create lightweight object
        const rowObj = {
          date: rowColumn[1],
          text: rowColumn[2],
          amount: parseFloat(rowColumn[3].replace(',', '.').replace(' ', '')),
          year: calcYear,
          month: calcMonth,
        } as ImportAccountRow;

        return rowObj;
      }
    });
    return rowObjArr;
  };

  useEffect(() => {
    if (accountRows && rowsText) {
      // parse the account rows text
      const parsedRows = parseRows(rowsText);
      if (parsedRows) {
        parsedRows
          .map((row: ImportAccountRow) => {
            row.matching = accountRows
              .filter(
                (ar) =>
                  new Date(ar.date).toLocaleDateString('sv-SE') === row.date
              )
              .filter((ar) => ar.text === row.text)
              .filter((ar) => ar.amount === row.amount);
            row.save = row.matching.length == 0;
            row.duplicate = row.matching.length > 1;
            return row;
          })
          .sort((a, b) => b.date.localeCompare(a.date));
        setRows(parsedRows);
      }
    }
  }, [accountRows, rowsText]);

  const saveRows = () => {
    const mutations = rows
      .filter((row) => row.save)
      .map((row, i) => {
        return `m${i}: createAccountRow(accountId: "${accountId}", date:"${row.date.toString()}", text:"${
          row.text
        }", amount:${row.amount}, year: ${row.year}, month: ${
          row.month
        }){ id }`;
      });
    const mutationQuery = `mutation { ${mutations.join('\n')}}`;
    GraphQLMutation(mutationQuery);
  };

  return (
    <>
      <span onClick={() => setParsed(false)}>{'<-'}</span>

      <table>
        <thead>
          <tr>
            <th colSpan={3}>Att importera</th>
            <th></th>
            <th colSpan={3}>I databasen</th>
          </tr>
          <tr>
            <th>Datum</th>
            <th>Text</th>
            <th>Belopp</th>
            <th></th>
            <th>Datum</th>
            <th>Text</th>
            <th>Belopp</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: ImportAccountRow, i: number) => (
            <ImportAccountRowsRow key={i} row={row} />
          ))}
        </tbody>
      </table>
      <button onClick={saveRows}>Spara</button>
    </>
  );
}
