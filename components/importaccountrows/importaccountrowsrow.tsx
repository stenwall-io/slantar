import { ReactElement, useState } from "react";
import { AccountRow } from "types/gql";
import { ImportAccountRow } from "types/importaccountrow";

type Props = {
    row: ImportAccountRow
}

export default function ImportAccountRowsRow({ row }: Props): ReactElement{
    const statusSymbol = () => {
      return row.save ? '-->' : ' X ';
    };
  
    const [symbol, setSymbol] = useState(statusSymbol());
  
    const toggleSave = () => {
      row.save = !row.save;
      setSymbol(statusSymbol());
    };
  
    if (row.matching.length <= 1) {
      return (
        <tr>
          <td>{row.date}</td>
          <td>{row.text}</td>
          <td className="amount">{row.amount}</td>
          <td>
            <button onClick={toggleSave}>
              {row.duplicate ? '! ' : ''}
              {symbol}
            </button>
          </td>
          {row.matching.length == 1 && (
            <>
              <td>
                {new Date(row.matching[0].date).toLocaleDateString('sv-SE')}
              </td>
              <td>{row.matching[0].text}</td>
              <td>{row.matching[0].amount}</td>
            </>
          )}
        </tr>
      );
    } else {
      return (
        <>
          <tr>
            <td>{row.date}</td>
            <td>{row.text}</td>
            <td className="amount">{row.amount}</td>
            <td>
              <button onClick={toggleSave}>
                {row.duplicate ? '! ' : ''}
                {symbol}
              </button>
            </td>
            <td>{new Date(row.matching[0].date).toLocaleDateString('sv-SE')}</td>
            <td>{row.matching[0].text}</td>
            <td className="amount">{row.matching[0].amount}</td>
          </tr>
          {row.matching.map((f: AccountRow, i:number) => (
            <tr key={i}>
              <td colSpan={4}></td>
              <td>{new Date(f.date).toLocaleDateString('sv-SE')}</td>
              <td>{f.text}</td>
              <td className="amount">{f.amount}</td>
            </tr>
          ))}
        </>
      );
    }
  };
  