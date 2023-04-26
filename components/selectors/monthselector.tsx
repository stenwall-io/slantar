import useSWR from 'swr';

export default function MonthSelector({ monthId, setMonthId }) {
  const monthData = useSWR('{ months{ id name } }');
  return (
    <>
      <div>
        <select
          name="accounts"
          value={monthId}
          onChange={(e) => setMonthId(e.target.value)}
        >
          <option key="0" value="">
            Välj månad
          </option>
          {monthData.data &&
            monthData.data.months.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
        </select>
      </div>
    </>
  );
}
