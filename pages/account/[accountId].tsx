import { useRouter } from 'next/router';
import useSWR from 'swr';
import AccountTable from '@components/account-table/AccountTable';

export const Account = () => {
  const router = useRouter();
  const { accountId } = router.query;
  const { data: accountData } = useSWR(
    `{ account(id: "${accountId}"){ name } }`
  );
  const { data: accountRowData, mutate } = useSWR(
    `{ accountRows(accountId:"${accountId}"){ id date text amount }}`
  );

  if (accountData && accountRowData) {
    return (
      <>
        <AccountTable
          account={accountData}
          accountRows={accountRowData.accountRows}
          mutate={mutate}
        />
      </>
    );
  }
};

export default Account;
