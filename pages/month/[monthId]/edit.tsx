import { useRouter } from 'next/router';
import useSWR from 'swr';
import EditAccountRows from '@components/editaccountrows';

export default function EditMonth() {
  const router = useRouter();
  const { monthId } = router.query;
  const monthData = useSWR(
    monthId
      ? `{ month(id: "${monthId}"){ name accountrows{ id month{ id } datef desc text amountf savings subrows{ id extra amountf category{ group subgroup }}} } }`
      : null
  );

  if (!monthData.data) {
    return 'Loading...';
  } else {
    const { month } = monthData.data;

    return (
      <>
        <h1>Redigera {month.name}</h1>
        <EditAccountRows accountRows={month.accountrows} />
      </>
    );
  }
}
