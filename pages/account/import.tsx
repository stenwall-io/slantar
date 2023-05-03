import { useState } from 'react';
import ImportAccountRowsForm from '@components/importaccountrows/importaccountrowsform';
import { GraphQLQuery } from 'hooks/useGraphQL';
import ImportAccountRowsTable from '@components/importaccountrows/importaccountrowstable';
import { gql } from 'graphql-request';

export default function ImportAccountRows() {
  // ID of the account to import to
  const [accountId, setAccountId] = useState('');
  // is the text parsed?
  const [parsed, setParsed] = useState(false);
  // the text to parse
  const [rowsText, setRowsText] = useState('');

  // fetch account rows when the ID is set
  // needs to be here so that the data can load on select
  const { data } = GraphQLQuery(
    accountId
      ? gql`{
        accountRows(accountId:"${accountId}"){
          date
          text
          amount
        }}`
      : null
  );

  if (!parsed) {
    // show the form to enter text
    return (
      <>
        {' '}
        <ImportAccountRowsForm
          accountId={accountId}
          setAccountId={setAccountId}
          rowsText={rowsText}
          setRowsText={setRowsText}
          setParsed={setParsed}
        />
      </>
    );
  } else {
    // show result of parsing before saving to DB
    // fetch the content of data if it's there
    const accountRows = data ? data.accountRows : [];
  
    return (
      <ImportAccountRowsTable
        accountId={accountId}
        accountRows={accountRows}
        rowsText={rowsText}
        setParsed={setParsed}
      />
    );
  }
}
