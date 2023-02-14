import useSWR from 'swr';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Account } from '@models/index';
import { IAccountRow } from '@models/index';
import { request } from 'graphql-request';

export default function Import() {
  const [sent, setSent] = useState(false);
  const [accountId, setAccountId] = useState(0);
  const [text, setText] = useState('');
  const [rows, setRows] = useState([]);

  const tableRef = useRef(null);

  const accountRes = useSWR('{ accounts{ id name }}');
  const accountRowRes = useSWR(
    accountId
      ? `{ accountRows(accountId:"${accountId}"){ date text amount }}`
      : null
  );

  if (accountRes.error) return <div>Error!</div>;
  if (accountRes.isLoading) return <div>Loading...</div>;

  const { accounts } = accountRes.data;
  const accountRows = accountRowRes.data ? accountRowRes.data.accountRows : [];

  const selectAccount = (event) => {
    const { value } = event.target;
    setAccountId(value);
  };
  const onTextChange = (event) => {
    const { value } = event.target;
    setText(value);
  };

  const parseRows = () => {
    const baseRows = text.split('\n'); // Split into array of rows
    //console.log(baseRows);
    const rows = baseRows
      .map((row: string) => row.split('\t \t')) // Split each row into columns
      .filter((splitRow: Array<string>) => {
        // Filter away 'Prel' rows
        //console.log(splitRow[2]);
        return splitRow[2] && !splitRow[2].startsWith('Prel');
      })
      .map((splitRow: Array<string>) => {
        // create array of lightweight AccoutRow objects
        //console.log(splitRow);
        if (splitRow.length == 5) {
          const accountRow = {
            date: splitRow[1],
            text: splitRow[2],
            amount: parseFloat(splitRow[3].replace(',', '.').replace(' ', '')),
          };
          return accountRow;
        }
      });
    console.log(rows);
    return rows;
  };

  const findFriends = (parsedRows) => {
    // find row "friends" already in account
    // for now just set det save flag
    return parsedRows.map((row) => {
      row.friend = accountRows
        .filter(
          (ar) => new Date(ar.date).toLocaleDateString('sv-SE') === row.date
        )
        .filter((ar) => ar.text === row.text)
        .filter((ar) => ar.amount === row.amount);
      if (row.friend.length == 0) row.status = 'save';
      else if (row.friend.length > 1) row.status = 'multiple';
      else row.status = 'duplicate';
      return row
    });
  };

  const handleSubmit = () => {
    if (accountId && text) {
      let parsedRows = parseRows();
      if (parsedRows) {
        parsedRows = findFriends(parsedRows).sort((a, b) => b.date.localeCompare(a.date));
        setRows(parsedRows);
        setSent(true);
      }
    }
  };

  const saveRows = () => {
    const mutations = rows
      .filter((row) => row.save)
      .map(
        (row, i) =>
          `m${i}: createAccountRow(accountId: "${accountId}" date:"${row.date.toString()}", text:"${
            row.text
          }", amount:${row.amount}){ id }`
      );
    const mutationQuery = `mutation { ${mutations.join('\n')}}`;
    console.log(mutationQuery);
    request('/api/graphql', mutationQuery);
  };

  const statusSymbol = (status) => {
    switch (status) {
      case 'save':
        return '-->';
      case 'multiple':
        return ' ! ';
      case 'duplicate':
        return ' X ';
    }
    return '';
  };

  if (!sent) {
    return (
      <>
        <div>
          <select name="accounts" value={accountId} onChange={selectAccount}>
            <option key="" value="0">
              Välj konto
            </option>
            {accounts.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <textarea value={text} onChange={onTextChange}></textarea>
        </div>
        <button disabled={!accountId || !text} onClick={handleSubmit}>
          Läs in
        </button>
      </>
    );
  } else {
    // show after form is sent

    return (
      <>
        <span onClick={() => setSent(false)}>{'<-'}</span>

        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Text</th>
              <th>Belopp</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any) => (
              <tr>
                <td>{row.date.toString()}</td>
                <td>{row.text}</td>
                <td>{row.amount}</td>
                <td>{statusSymbol(row.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={saveRows}>Spara</button>
      </>
    );
  }
}
