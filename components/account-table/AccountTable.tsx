import { IAccount } from '@models/account';
import { IAccountRow } from '@models/accountRow';
import { KeyedMutator } from 'swr';
import AccountRow from './AccountRow';

interface Props {
  account: IAccount;
  accountRows: IAccountRow[];
  mutate: KeyedMutator<any>;
}

export const AccountTable = (props: Props) => {
  const { account, accountRows, mutate } = props;

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
          {accountRows &&
            accountRows.map((row, i: number) => (
              <AccountRow key={i} row={row} mutate={mutate} />
            ))}
        </tbody>
      </table>
    </>
  );
};

export default AccountTable;
