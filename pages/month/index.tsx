import useSWR from 'swr';
import { useState } from 'react';
import { request } from 'graphql-request';

export default function Month() {
  const { data: monthsData, mutate: monthsMutate } = useSWR(
    `{ months{ id name year month } }`
  );

  // calculate year and month values for next month
  const nextMonth = () => {
    if (monthsData) {
      const month = { year: 0, month: 0 };
      month.year = monthsData.months.reduce(
        (v, n) => Math.max(v, n.year || 0),
        ''
      );
      month.month = monthsData.months
        .filter((m) => m.year == month.year)
        .reduce((v, n) => Math.max(v, n.month || 0), 0);

      if (month.month >= 11) {
        month.year += 1;
        month.month = 0;
      } else {
        month.month += 1;
      }
      return month;
    }
  };

  return (
    <>
      <h1>Månader</h1>
      <NewMonthForm nextMonth={nextMonth} monthsMutate={monthsMutate} />
    </>
  );
}

const NewMonthForm = ({ nextMonth, monthsMutate }) => {
  const [show, setShow] = useState(false);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [startDate, setStartDate] = useState('yyyy-mm-dd');

  const createNewMonth = () => {
    const nmo = nextMonth();
    setYear(nmo.year);
    setMonth(nmo.month);
    setShow(true);
  };

  const saveMonth = () => {
    request(
      '/api/graphql',
      `mutation{ createMonth(year:${year} month:${month} startDate:"${startDate}"){ id } }`
    ).then(monthsMutate());
  };

  if (!show) {
    return <button onClick={createNewMonth}>Ny månad</button>;
  } else {
    return (
      <>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
        />
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value, 10))}
        />
        <input
          type="text"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <button onClick={saveMonth}>Spara</button>
        <button onClick={() => setShow(false)}>Avbryt</button>
      </>
    );
  }
};
