import "./DateSelector.css"


function DateSelector ({setMonth, setYear, month, year} : {setMonth: (month:string) => void; setYear: (year:string) => void; month:string; year:string}) {

  const years: number[]  = [];
  const thisYear = new Date().getFullYear();
  
  for (let i = 0; i <= 10; i++) {
    const year = thisYear - i;
    years.push(year);
  }


    return (
        <>
        <div className="date-selector">
            <div>
                <select value={month} style={{width: 90, height: 30}} name="month" onChange={(e) => setMonth(e.target.value)}>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </div>
                
            <div>
                <select value={year} style={{width: 60, height: 30}}  onChange={(e) => setYear(e.target.value)}>
                    {years.map((i,k) => {
                        return <option value={i} id={String(k)}>{i}</option>
                    })}
                </select>
            </div>
        </div>
        </>
    );
}

export default DateSelector;