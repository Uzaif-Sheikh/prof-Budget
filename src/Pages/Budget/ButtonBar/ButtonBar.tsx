import SearchIcon from '@mui/icons-material/Search';
import './ButtonBar.css';
import TextField from '@mui/material/TextField';

function ButtonBar({handleOpen, setYear, setMonth, month, year, category, setSearch, setShowSearchBar, showSearchBar, setCategory} : {handleOpen: () => void; setYear: (year:string) => void; setMonth: (month:string) => void; setSearch: (search:string) => void; setShowSearchBar: (show:boolean) => void; showSearchBar: boolean; month: string; year: string; setCategory: (category: string) => void; category: string}) {

  const years: number[]  = [];
  const thisYear = new Date().getFullYear();
  
  for (let i = 0; i <= 10; i++) {
    const year = thisYear - i;
    years.push(year);
  }


  return (
    <div className='add-filter-search-bar'>

      <div className="button-bar-1">

        <div>
          <button onClick={handleOpen} className="transaction-add-button">
          + Add
          </button>
        </div>
            
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
          <select value={year} style={{width: 70, height: 30}} onChange={(e) => setYear(e.target.value)}>
            {years.map((i,k) => {
              return <option key={k} value={i} id={String(k)}>{i}</option>
            })}
          </select>
        </div>

        <div>
          <select value={category} style={{width: 80, height: 30}} name="category" onChange={(e) => setCategory(e.target.value)}>
            <option value="category">Category</option>
            <option value="Shopping">Shopping</option>
            <option value="Eating Out">Eating Out</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Travel">Travel</option>
            <option value="Groceries">Groceries</option>
            <option value="Cash">Cash</option>
            <option value="Health">Health</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>

          </select>
        </div>

      </div>
        
      <div className='search-container'>

        <div className="search-input">
          <TextField size="small" id="outlined-basic" label="Search.." variant="outlined" onChange={(e) => setSearch(e.target.value)}/>

        </div>

        <div className="search-icon" onClick={() => setShowSearchBar(!showSearchBar)}>
          <SearchIcon fontSize="medium" sx={{ color: 'black' }}/>
        </div>

      </div>

    </div>
  );
}

export default ButtonBar;