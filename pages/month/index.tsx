import { GraphQLQuery } from 'hooks/useGraphQL';
import { gql } from 'graphql-request';
import { Month } from 'types/gql';
import MonthTableRow from '@components/monthtablerow';

export default function MonthIndex() {
  const { data: monthsData} = GraphQLQuery(
    gql`{ 
      months{ 
        id 
        name 
        accountrows{ 
          date 
          desc 
          text 
          amount
          savings
          subrows{
            extra
            amount
          } 
        }
      } 
    }`
  );

  return (
    <>
      <h1>Månader</h1>
      <table>
        <thead>
          <tr>
            <th>Månad</th>
            <th>In</th>
            <th>Ut</th>
            <th>Diff</th>
            <th>Sparas in</th>
            <th>Sparas ut</th>
            <th>Sparat</th>
            <th>Extra</th>
          </tr>
        </thead>
        <tbody>
          {monthsData &&
            monthsData.months.map((month: Month, i: number) => (
              <>
                <MonthTableRow key={i} month={month} />
              </>
            ))}
        </tbody>
      </table>
    </>
  );
}
