import { useRouter } from 'next/router';
import Link from 'next/link';
import { GraphQLQuery } from 'hooks/useGraphQL';
import { gql } from 'graphql-request';
import { MonthBucketer, bucketSumF } from 'util/monthBucketer';
import AccountRowsTable from '@components/accountRowsTable';
import SubRowsTable from '@components/subRowsTable';

export default function Month() {
  const router = useRouter();
  const { monthId } = router.query;
  const monthData = GraphQLQuery(
    monthId
      ? gql`{ 
      month(id: "${monthId}"){
        name 
        accountrows{ 
          date 
          datef 
          desc 
          text 
          amount 
          amountf
          savings 
          subrows{
            accountRow{ datef desc amountf }
            category{ 
              group
              subgroup 
            }
            extra
            amountf
          } 
        } 
      } 
    }`
      : null
  );

  if (monthData.data) {
    const { month } = monthData.data;

    const monthBuckets = MonthBucketer(month);

    return (
      <>
        <h1>{month.name}</h1>
        <small>
          <Link
            href={{
              pathname: '/month/[monthId]/edit',
              query: { monthId: monthId },
            }}
          >
            redigera
          </Link>
        </small>
        <h2>In {bucketSumF(monthBuckets, 'in')}</h2>
        <SubRowsTable subRows={monthBuckets.in} />
        <h2>Extra {bucketSumF(monthBuckets, 'extra')}</h2>
        <SubRowsTable subRows={monthBuckets.extra} />
        <h2>Sparat {bucketSumF(monthBuckets, 'savings')}</h2>
        <SubRowsTable subRows={monthBuckets.savings} />
        <h2>Kontorader</h2>
        {month.accountrows && (
          <AccountRowsTable accountRows={month.accountrows} />
        )}
      </>
    );
  }
}
