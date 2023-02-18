import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from 'util/graphQLFetcher';

export default function Account() {
  const router = useRouter();
  const { accountId } = router.query;
  const { data: accountData } = useSWR(
    `{ account(id: "${accountId}"){ name } }`
  );
  const { data: accountRowData, mutate: accountRowMutate } = useSWR(
    `{ accountRows(accountId:"${accountId}"){ id date text desc amount }}`
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
                <AccountRow
                  key={i}
                  row={row}
                  accountRowMutate={accountRowMutate}
                />
              ))}
          </tbody>
        </table>
      </>
    );
  }
}

const AccountRow = ({ row, accountRowMutate }) => {
  const deleteRow = () => {
    fetcher(`mutation{ deleteAccountRow(id: "${row.id}") }`).then(
      (id) => id && accountRowMutate()
    );
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
