import AccountSelector from '@components/selectors/accountselector';
import { ReactElement } from 'react';

type Props = {
  accountId: string;
  setAccountId: (accountId: string) => void;
  rowsText: string;
  setRowsText: (rowsText: string) => void;
  setParsed: (sent: boolean) => void;
};

// A form with a selectbox for accounts and a textfield for account rows text to parse
export default function ImportAccountRowsForm({
  accountId,
  setAccountId,
  rowsText,
  setRowsText,
  setParsed,
}: Props): ReactElement {
  return (
    <>
      <AccountSelector accountId={accountId} setAccountId={setAccountId} />
      <div>
        <textarea
          value={rowsText}
          onChange={(e) => setRowsText(e.target.value)}
        ></textarea>
      </div>
      <button disabled={!accountId || !rowsText} onClick={() => setParsed(true)}>
        Läs in
      </button>
    </>
  );
}
