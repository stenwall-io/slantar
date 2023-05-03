import { useRouter } from 'next/router';
import EditAccountRows from '@components/editaccountrows/editaccountrows';
import { GraphQLQuery, fetcherFunc } from 'hooks/useGraphQL';
import { gql } from 'graphql-request';
import { EditableAccountRow, EditableSubRow } from 'types/editables';

export default function EditMonth() {
  const router = useRouter();
  const { monthId } = router.query;
  const monthData = GraphQLQuery(
    monthId
      ? gql`{ 
        month(id: "${monthId}"){ 
          name 
          accountrows{ 
            id
            datef 
            desc 
            text 
            amountf 
            savings
            month{ id } 
            subrows{ 
              id 
              extra 
              amountf 
              category{
                id 
                group 
                subgroup 
              }
            }
          } 
        } 
      }`
      : null
  );

  const saveChangedRows = (accountRows: EditableAccountRow[]) => {
    const accountrow_mutations = accountRows
      .filter((row: EditableAccountRow) => row.edited)
      .map((row: EditableAccountRow, i: number) => {
        const mutation = `m${i}: updateAccountRow(accountRowId: "${
          row.id
        }", monthId: "${
          row.newMonthId ? row.newMonthId : row.month.id
        }", desc:"${row.desc}", savings:${row.savings}){ id }`;
        const subrow_mutations = row.subrows
          .map((subrow: EditableSubRow, j: number) => {
            const amount = subrow.amountf
              .replace('\xa0', '') // Non breaking space
              .replace(' ', '') // Space
              .replace(',', '.') // Comma to period
              .replace('\u2212', '-'); // Unicode minus sign
            return `m${i}_${j}: updateSubRow(subRowId: "${
              subrow.id
            }", categoryId:"${
              subrow.category ? subrow.category.id : ''
            }", extra:${subrow.extra}, amount:${amount}){ id }`;
          })
          .join(' ');
        return mutation + ' ' + subrow_mutations;
      });

    const mutationQuery = `mutation{ ${accountrow_mutations.join(' ')}}`;
    fetcherFunc(mutationQuery);
    // TODO check for errors
    //router.push('/month/' + monthId);
  };

  

  if (!monthData.data) {
    return 'Loading...';
  } else {
    const { month } = monthData.data;

    return (
      <>
        <h1>Redigera {month.name}</h1>
        <EditAccountRows accountRows={month.accountrows as EditableAccountRow[]} saveChangedRows={saveChangedRows}/>
      </>
    );
  }
}
