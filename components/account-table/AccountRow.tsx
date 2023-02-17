import { IAccountRow } from '@models/accountRow';
import { request } from 'graphql-request';
import { KeyedMutator } from 'swr';

interface Props {
  row: IAccountRow;
  mutate: KeyedMutator<any>;
}

export const AccountRow = (props: Props) => {
  const { row, mutate } = props;

  const deleteRow = async () => {
    request(
      '/api/graphql',
      `mutation{ deleteAccountRow(id: "${row.id}") }`
    ).then(await mutate());
  };

  return (
    <tr>
      <td>{new Date(row.date).toLocaleDateString('sv-SE')}</td>
      <td>{row.text}</td>
      <td>{row.amount}</td>
      <td>
        <button onClick={deleteRow}>X</button>
      </td>
    </tr>
  );
};

export default AccountRow;
