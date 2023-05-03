import { GraphQLQuery } from 'hooks/useGraphQL';
import { ReactElement } from 'react';

type Props = {
  accountId: string;
  setAccountId: (arg: string) => void;
};

export default function AccountSelector({ accountId, setAccountId }: Props):ReactElement {
  const { data: accountData } = GraphQLQuery('{ accounts{ id name } }');
  return (
    <>
      <div>
        <select
          name="accounts"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          <option value="">
            Välj konto
          </option>
          {accountData &&
            accountData.accounts.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
        </select>
      </div>
    </>
  );
}
