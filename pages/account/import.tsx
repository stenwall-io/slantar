import useSWR from 'swr';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Account } from '@models/index';
import { IAccountRow } from '@models/index';
import account from '@models/account';
import { fetcher } from 'util/graphQLFetcher';

export default function ImportAccountRows() {
  const [accountId, setAccountId] = useState(0);
  const [sent, setSent] = useState(false);
  const [rowsText, setRowsText] = useState('');

  if (!sent) {
    return (
      <ImportAccountRowsForm
        accountId={accountId}
        setAccountId={setAccountId}
        rowsText={rowsText}
        setRowsText={setRowsText}
        setSent={setSent}
      />
    );
  } else {
    // show after form is sent
    return (
      <ImportAccountRowsTable
        sent={sent}
        accountId={accountId}
        rowsText={rowsText}
        setSent={setSent}
      />
    );
  }
}

const ImportAccountRowsForm = ({
  accountId,
  setAccountId,
  rowsText,
  setRowsText,
  setSent,
}) => {
  const accountRes = useSWR('{ accounts{ id name }}');
  return (
    <>
      <div>
        <select
          name="accounts"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          <option key="" value="0">
            Välj konto
          </option>
          {accountRes.data &&
            accountRes.data.accounts.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
        </select>
      </div>
      <div>
        <textarea
          value={rowsText}
          onChange={(e) => setRowsText(e.target.value)}
        ></textarea>
      </div>
      <button disabled={!accountId || !rowsText} onClick={() => setSent(true)}>
        Läs in
      </button>
    </>
  );
};

const ImportAccountRowsTable = ({ sent, accountId, rowsText, setSent }) => {
  const [rows, setRows] = useState([]);

  const accountRowRes = useSWR(
    accountId
      ? `{ accountRows(accountId:"${accountId}"){ date text amount }}`
      : null
  );

  const accountRows = accountRowRes.data ? accountRowRes.data.accountRows : [];

  useEffect(() => {
    if (accountId && rowsText) {
      const parsedRows = parseRows(rowsText);
      if (parsedRows) {
        findFriends(parsedRows).sort((a, b) => b.date.localeCompare(a.date));
        setRows(parsedRows);
      }
    }
  }, [sent]);

  const parseRows = (rowsText: string) => {
    const splitRows = rowsText.split('\n'); // Split into array of rows
    const columnRows = splitRows.map((row: string) => row.split('\t \t')); // Split each row into columns
    const filteredRows = columnRows.filter((columnRow: Array<string>) => {
      // Filter away 'Prel' rows
      if (!columnRow || columnRow.length != 5) return false;
      return columnRow[1].charAt(0) == '2' && !columnRow[2].startsWith('Prel');
    });
    const rowObjArr = filteredRows.map((rowColumn: Array<string>) => {
      // create array of "lightweight" AccoutRow objects
      if (rowColumn.length == 5) {
        const dateColumn = new Date(rowColumn[1]);
        let calcMonth = dateColumn.getMonth();
        let calcYear = dateColumn.getFullYear();
        if (dateColumn.getDate() >= 25) {
          if (calcMonth == 11) {
            calcMonth = 0;
            calcYear += 1;
          } else {
            calcMonth += 1;
          }
        }
        const rowObj = {
          date: rowColumn[1],
          text: rowColumn[2],
          amount: parseFloat(rowColumn[3].replace(',', '.').replace(' ', '')),
          year: calcYear, 
          month: calcMonth ,
        };

        return rowObj;
      }
    });
    return rowObjArr;
  };

  const findFriends = (parsedRows) => {
    // find row "friends" already in account
    return parsedRows.map((row) => {
      row.friends = accountRows
        .filter(
          (ar) => new Date(ar.date).toLocaleDateString('sv-SE') === row.date
        )
        .filter((ar) => ar.text === row.text)
        .filter((ar) => ar.amount === row.amount);
      row.save = row.friends.length == 0;
      row.duplicate = row.friends.length > 1;
    });
  };

  const saveRows = () => {
    const mutations = rows
      .filter((row) => row.save)
      .map((row, i) => {
        console.log(row);
        return `m${i}: createAccountRow(accountId: "${accountId}", date:"${row.date.toString()}", text:"${
          row.text
        }", amount:${row.amount}, year: ${row.year}, month: ${
          row.month
        }){ id }`;
      });
    const mutationQuery = `mutation { ${mutations.join('\n')}}`;
    fetcher(mutationQuery);
  };

  return (
    <>
      <span onClick={() => setSent(false)}>{'<-'}</span>

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
          {rows.map((row: any, i: number) => (
            <ImportAccountRowsRow key={i} row={row} />
          ))}
        </tbody>
      </table>
      <button onClick={saveRows}>Spara</button>
    </>
  );
};

const ImportAccountRowsRow = ({ row }) => {
  const statusSymbol = () => {
    return row.save ? '-->' : ' X ';
  };

  const [symbol, setSymbol] = useState(statusSymbol());

  const toggleSave = () => {
    row.save = !row.save;
    setSymbol(statusSymbol());
  };

  if (row.friends.length <= 1) {
    return (
      <tr>
        <td>{row.date}</td>
        <td>{row.text}</td>
        <td>{row.amount}</td>
        <td>
          <button onClick={toggleSave}>
            {row.duplicate ? '! ' : ''}
            {symbol}
          </button>
        </td>
        {row.friends.length == 1 && (
          <>
            <td>{new Date(row.friends[0].date).toLocaleDateString('sv-SE')}</td>
            <td>{row.friends[0].text}</td>
            <td>{row.friends[0].amount}</td>
          </>
        )}
      </tr>
    );
  } else {
    return (
      <>
        <tr>
          <td>{row.date}</td>
          <td>{row.text}</td>
          <td>{row.amount}</td>
          <td>
            <button onClick={toggleSave}>
              {row.duplicate ? '! ' : ''}
              {symbol}
            </button>
          </td>
          <td>{new Date(row.friends[0].date).toLocaleDateString('sv-SE')}</td>
          <td>{row.friends[0].text}</td>
          <td>{row.friends[0].amount}</td>
        </tr>
        {row.friends.map((f) => (
          <tr>
            <td colSpan={4}></td>
            <td>{new Date(f.date).toLocaleDateString('sv-SE')}</td>
            <td>{f.text}</td>
            <td>{f.amount}</td>
          </tr>
        ))}
      </>
    );
  }
};
