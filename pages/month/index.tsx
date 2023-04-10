import useSWR from 'swr';
import { useState } from 'react';
import { IAccountRow, ISubRow, IMonth } from '@models/index';

export default function Month() {
  const { data: monthsData, mutate: monthsMutate } = useSWR(
    `{ months{ id name accountrows{ date desc text amount subrows { category { name } amount } } } }`
  );

  return (
    <>
      <h1>Månader</h1>
      {monthsData &&
        monthsData.months.map((month: IMonth, i: number) => (
          <>
            <ShowMonth key={i} month={month} />
          </>
        ))}
    </>
  );
}

const ShowMonth = ({ month }) => {
  const rowGroups = {};
  console.log('mont accountrows', month.accountrows);
  month.accountrows.forEach((accountRow) => {
    if (!(accountRow.text in rowGroups)) {
        rowGroups[accountRow.text] = {};
        rowGroups[accountRow.text].sum = 0.0;
        rowGroups[accountRow.text].rows = [];
    }
    rowGroups[accountRow.text].sum += accountRow.amount;
    rowGroups[accountRow.text].rows.push(accountRow);
  });
  console.log('ROWGROUPS', rowGroups);

  return (
    <>
      <h2>{month.name}</h2>
      <ul>
        {Object.keys(rowGroups).sort((key_a, key_b) => rowGroups[key_b].sum - rowGroups[key_a].sum).map((key) => (
          <li>
            {key}: {rowGroups[key].sum} {rowGroups[key].rows.length} rader
          </li>
        ))}
      </ul>
      <ul>
        {month.accountrows.map((accountRow: IAccountRow) => (
          <li>
            {accountRow.date} <b>{accountRow.desc}</b> <i>{accountRow.text}</i>
            <ul>
              {accountRow.subrows && accountRow.subrows.map((subRow: ISubRow) => (
                <li>{subRow.amount}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};
