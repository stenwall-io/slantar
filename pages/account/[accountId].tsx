import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { request } from 'graphql-request';

export default function Account() {
  const router = useRouter();
  const { accountId } = router.query;
  const { data: accountData } = useSWR(
    `{ account(id: "${accountId}"){ name } }`
  );
  const { data: accountRowData, mutate } = useSWR(
    `{ accountRows(accountId:"${accountId}"){ id date text amount }}`
  );

  if (accountData) {
    const { account } = accountData;

    return (
      <>
        <h1>{account.name}</h1>
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Text</th>
              <th>Belopp</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accountRowData &&
              accountRowData.accountRows.map((row: any, i: number) => (
                <AccountRow key={i} row={row} mutate={mutate} />
              ))}
          </tbody>
        </table>
      </>
    );
  }
}

const AccountRow = ({ row, mutate }) => {
  const deleteRow = () => {
    request(
      '/api/graphql',
      `mutation{ deleteAccountRow(id: "${row.id}") }`
    ).then(mutate());
  };

  return (
    <tr>
      <td>{new Date(row.date).toLocaleDateString('sv-SE')}</td>
      <td title={row.text}>{row.desc}</td>
      <td>{row.amount}</td>
      <td>
        <button onClick={deleteRow}>X</button>
      </td>
    </tr>
  );
};
