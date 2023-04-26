import useSWR from 'swr';

export default function AccountSelector({ accountId, setAccountId }) {
  const { data: accountData } = useSWR('{ accounts{ id name } }');
  console.log('AccountSelector', accountId)
  return (
    <>
      <div>
        <select
          name="accounts"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          <option key="0" value="">
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
