import useSWR from 'swr';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Account } from '@models/index';
import { IAccountRow } from '@models/index';

export default function Import() {
  const [sent, setSent] = useState(false);
  const [account, setAccount] = useState(0);
  const [text, setText] = useState('');
  const [rows, setRows] = useState([]);

  const tableRef = useRef(null);

  const accountRes = useSWR('{ accounts{ id name }}');
  const accountRowRes = useSWR(
    account
      ? `{ accountRows(accountId:"${account}"){ date text amount }}`
      : null
  );

  if (accountRes.isLoading) return <div>Loading...</div>;

  const { accounts } = accountRes.data;

  const selectAccount = (event) => {
    const { value } = event.target;
    setAccount(value);
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
    //console.log(rows);
    setRows(rows);
  };

  const findFriends = () => {
    // find row "friends" already in account
  }

  const handleSubmit = () => {
    if (account && text) {
      parseRows();
      if (rows) {
        findFriends();
        setSent(true);
      }
    }
  };

  if (!sent) {
    return (
      <>
        <div>
          <select name="accounts" value={account} onChange={selectAccount}>
            <option key="" value="">
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
        <button disabled={!account || !text} onClick={handleSubmit}>
          Submit
        </button>
      </>
    );
  } else { // show after form is sent
    if (accountRowRes.isLoading) return <div>Loading...</div>;

    const { accountRows } = accountRowRes.data;
    return (
      <>
        <span onClick={() => setSent(false)} title={'back'}>
          {'<-'}
        </span>

        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Text</th>
              <th>Belopp</th>
            </tr>
          </thead>
          <tbody>
          {rows.map((row: IAccountRow) => (
            <tr>
              <td>{row.date}</td>
              <td>{row.text}</td>
              <td>{row.amount}</td>
            </tr>
          )
          )}
          </tbody>
          </table>
      </>
    );
  }
}
