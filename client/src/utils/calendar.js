// client/src/utils/calendar.js

const [timesExcluded, setTimesExcluded] = useState([]);

useEffect(() => {
  const noStockTimes = [];
  const fewStockTimes = [];
  const manyStockTimes = [];

  backArr.forEach((e) => {
    if (!Object.values(e)[0]) {
      noStockTimes.push(Object.keys(e)[0]);
    } else if (Object.values(e)[0] < 3) {
      fewStockTimes.push(Object.keys(e)[0]);
    } else {
      manyStockTimes.push(Object.keys(e)[0]);
    }
  });

  setTimesExcluded(
    noStockTimes.map((e) => setHours(setMinutes(new Date(), e.slice(3)), e.slice(0, 2)))
  );
}, [backArr]);

    
    backArr.forEach(e => !Object.values(e)[0]
                         ? noStockTimes.push(Object.keys(e)[0])
                         : Object.values(e)[0] < 3
                         ? fewStockTimes.push(Object.keys(e)[0])
                         : manyStockTimes.push(Object.keys(e)[0])
                    )
    
    setTimesExcluded(
        noStockTimes.map(
        e => setHours(setMinutes(new Date(), e.slice(3)), e.slice(0,2))
        )
    )
    
    let handleColor = (time) => {
        /* const str = '1245'
        let stock = 0
        backArr.forEach(e => stock += e[str] || 0 ) */
      const strTime = time.toTimeString().slice(0, 5)  
      return manyStockTimes.includes(strTime) ? "text-success" : "text-error";
    };
    const disabledDates = [
    new Date(2022, 6, 6),
  ];
    
    const isWeekday = (date) => {
      const day = getDay(date);
      return !sucursal.daysOff.includes(day)
    }

    return (
      <DatePicker
        inline
        minDate={new Date()}
        maxDate={addDays(new Date(), 21)}
        timeIntervals={15}
        selected={startDate}
        onChange={(date) => {
          setStartDate(date)
          console.log(date)
          }}
        showTimeSelect
        timeCaption="horarios"
        minTime={setHours(setMinutes(new Date(), mmStart), hhStart)}
        maxTime={setHours(setMinutes(new Date(), mmEnd), hhEnd)}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeClassName={handleColor}
        filterDate={isWeekday}
        excludeTimes={timesExcluded}
        excludeDates={disabledDates}
      />
    );
