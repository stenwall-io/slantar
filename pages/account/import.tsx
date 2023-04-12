import useSWR from 'swr';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Account } from '@models/index';
import { IAccountRow } from '@models/index';
import account from '@models/account';
import { fetcher } from 'util/graphQLFetcher';
import AccountSelector from '@components/selectors/accountselector';

export default function ImportAccountRows() {
  // ID of the account to import to
  const [accountId, setAccountId] = useState(0);
  // is the text parsed?
  const [parsed, setSent] = useState(false);
  // the text to parse
  const [rowsText, setRowsText] = useState('');

  // fetch account rows when the ID is set
  // needs to be here so that the data can load on select
  const accountRowData = useSWR(
    accountId
      ? `{ accountRows(accountId:"${accountId}"){ date text amount }}`
      : null
  );

  if (!parsed) {
    // show the form to enter text
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
    // show result of parsing before saving to DB
    return (
      <ImportAccountRowsTable
        sent={parsed}
        accountId={accountId}
        accountRowData={accountRowData}
        rowsText={rowsText}
        setSent={setSent}
      />
    );
  }
}


// A form with a selectbox for accounts and a textfield for account rows text to parse
const ImportAccountRowsForm = ({
  accountId,
  setAccountId,
  rowsText,
  setRowsText,
  setSent,
}) => {
  
  const { data:accountData } = useSWR('{ accounts{ id name }}');
  
  return (
    <>
      <AccountSelector accountId={accountId} setAccountId={setAccountId}/>
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

// An table to select rows to import
const ImportAccountRowsTable = ({ sent, accountId, accountRowData, rowsText, setSent }) => {
  const [rows, setRows] = useState([]);
  
  // fetch the content of data if it's there
  const accountRows = accountRowData.data ? accountRowData.data.accountRows : [];

  useEffect(() => {
    if (accountRowData.data && rowsText) {
      // parse the account rows text
      const parsedRows = parseRows(rowsText);
      if (parsedRows) {
        findMatchingRows(parsedRows).sort((a, b) => b.date.localeCompare(a.date));
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
          month: calcMonth ,
        };

        return rowObj;
      }
    });
    return rowObjArr;
  };

  const findMatchingRows = (parsedRows) => {
    // find matching rows already in account
    return parsedRows.map((row) => {
      row.matching = accountRows
        .filter(
          (ar) => new Date(ar.date).toLocaleDateString('sv-SE') === row.date
        )
        .filter((ar) => ar.text === row.text)
        .filter((ar) => ar.amount === row.amount);
      row.save = row.matching.length == 0;
      row.duplicate = row.matching.length > 1;
    });
  };

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

  if (row.matching.length <= 1) {
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
        {row.matching.length == 1 && (
          <>
            <td>{new Date(row.matching[0].date).toLocaleDateString('sv-SE')}</td>
            <td>{row.matching[0].text}</td>
            <td>{row.matching[0].amount}</td>
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
          <td>{new Date(row.matching[0].date).toLocaleDateString('sv-SE')}</td>
          <td>{row.matching[0].text}</td>
          <td>{row.matching[0].amount}</td>
        </tr>
        {row.matching.map((f) => (
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
