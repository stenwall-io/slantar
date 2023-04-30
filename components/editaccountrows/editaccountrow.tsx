import { useState, ReactElement } from 'react';
import MonthSelector from '@components/selectors/monthselector';
import { ChangeEvent } from 'react';
import EditSubRow from '@components/editaccountrows/editsubrow';
import { EditableAccountRow, EditableSubRow } from 'types/editables';

type Props = {
  accountRow: EditableAccountRow;
};

export default function EditAccountRow({ accountRow }: Props): ReactElement {
  const [monthState, setMonthState] = useState(accountRow.month.id as string);
  const [savingsState, setSavingsState] = useState(accountRow.savings);

  const markRowEdited = () => (accountRow.edited = true);

  function setMonth(monthId: string) {
    setMonthState(monthId);
    accountRow.newMonthId = monthId;
  }
  function setSavings(e: ChangeEvent<HTMLInputElement>) {
    setSavingsState(e.target.checked);
    accountRow.savings = e.target.checked ? e.target.checked : false;
    markRowEdited();
  }

  return (
    <>
      <tr>
        <td>{accountRow.datef}</td>
        <td>{accountRow.desc}</td>
        <td>{accountRow.amountf}</td>
        <td>
          <input
            type="checkbox"
            value={savingsState.toString()}
            onChange={setSavings}
          ></input>
        </td>

        <td>
          <MonthSelector monthId={monthState} setMonthId={setMonth} />
        </td>
      </tr>
      <tr>
        <td colSpan={6}>
          <table>
            <tbody>
              {accountRow.subrows &&
                accountRow.subrows.map((row: EditableSubRow) => (
                  <EditSubRow
                    key={row.id}
                    rid={row.id.slice(-6)}
                    subRow={row}
                    markRowEdited={markRowEdited}
                  />
                ))}
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
}
