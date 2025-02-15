import IncomeExpenditureAnalysisGraph from "./IncomeExpendtireAnalysisGraph";
import './IncomeExpenditureAnalysis.css'
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import DateSelector from "./DateSelector"
import { useState, useEffect } from "react";
import SetBudgetModal from "../Budget/Modals/SetBudgetModal";
import { getTransactionsAPI } from '../../API/transaction';
import { bType, transactionType } from "../Types";
import { getBudgetAPI } from "../../API/budget";
import useUserInfo from "../../utils/LocalStorage";

function IncomeExpenditureAnalysis () {

    const [open, setOpen] = useState<boolean>(false);
    const currentDate  = new Date();
    const [year, setYear] = useState<string>(currentDate.getFullYear() + "");
    const [month, setMonth] = useState<string>(currentDate.getMonth() + 1 + "");
    const [savings, setSavings] = useState(0);
    const [investments, setInvestments] = useState(0);
    const [needs, setNeeds] = useState(0);
    const [wants, setWants] = useState(0);

    const [savingsBudget, setSavingsBudget] = useState(0);
    const [investmentsBudget, setInvestmentsBudget] = useState(0);
    const [needsBudget, setNeedsBudget] = useState(0);
    const [wantsBudget, setWantsBudget] = useState(0);

    const [income, setIncome] = useState(0);
    const [totalSpending, setTotalSpending] = useState(0);
    const { userData } = useUserInfo();

    const getTransactions = async (year: string, month: string, search: string, category: string) => {

        const response = await getTransactionsAPI(userData.id, year, month, search, category);
    
        if(response.data !== null && response.error === null) {
          return response.data
        } else {
          alert(`An error occured while fetching transactions. 
          Please contact us at ayaan.adil@gmail.com or uzaifsheikh09@gmail.com: ${response.error?.code} - ${response.error?.message}`);
        }

        return [];
    };

    const getBudget = async (userId: string) => {
      const response = await getBudgetAPI(userId);

      if(response.ok) {
        const res = await response.json();
  
        if(res.error) {
          alert(`An error occurred: ${res.error}. Please contact us at ayaan.adil@gmail.com or uzaifsheikh09@gmail.com`);
        } else {
          return res;
        }
      } else {
        alert(`An error occured while fetching transactions. 
        Please contact us at ayaan.adil@gmail.com or uzaifsheikh09@gmail.com: ${response?.status} - ${response?.statusText}`);
      }
    }

    
    useEffect(() => {

      const id = userData != null ? userData.localId : "";

      getBudget(id).then((res:bType[]) => {

        for (let i = 0; i < res.length; i++) {

          if (res[i].category === "savings") {
            setSavingsBudget(res[i].budget);
          } else if (res[i].category === "investments") {
            setInvestmentsBudget(res[i].budget);
          } else if (res[i].category == "needs") {
            setNeedsBudget(res[i].budget);
          } else {
            setWantsBudget(res[i].budget);
          }
        }
      });

      getTransactions(year, month, '', 'category').then((res: transactionType[]) => {
        let tempSavings = 0;
        let tempNeeds = 0;
        let tempWants = 0;
        let tempIncome = 0;
        let tempInvestments = 0;
        let tempTotalSpending = 0;
    
        for (let i = 0; i < res.length; i++) {

          if (res[i].income) {
              tempIncome += res[i].value;
              
          } else {
              const transactionType = res[i].type;
              const transactionValue = res[i].value;
              tempTotalSpending += res[i].value;
              if (transactionType === 'Savings') {
                tempSavings += transactionValue;
              } else if (transactionType === 'Wants') {
                tempWants += transactionValue;
              } else if (transactionType === 'Investments') {
                tempInvestments += transactionValue;
              } else {
                tempNeeds += transactionValue;
              }
          }

        }
      
        setSavings(tempSavings);
        setWants(tempWants);
        setInvestments(tempInvestments);
        setNeeds(tempNeeds);
        setIncome(tempIncome);
        setTotalSpending(tempTotalSpending)

      });
    }, [year, month]);

    return (
        <>
        <PageTemplate>
            <div className="large-container">
              <div className="income-expendtire-container">
                  <div className="income-expenditure-graph">
                      <IncomeExpenditureAnalysisGraph savings={savings} wants={wants} investments={investments} needs={needs}/>
                  </div>
                  <div>
                      <button onClick={() => setOpen(true)} className="transaction-add-button">
                      Create New Budget
                      </button>
                  </div>
                  <div className="date-selector-container">
                      <DateSelector setMonth={setMonth} setYear={setYear} month={month} year={year}/>
                  </div>
              </div>
              <div className="spending-info">
                  <div>
                    Savings: $ {savings}
                  </div>
                  <div>
                    investment: $ {investments}
                  </div>
                  <div>
                    Needs: $ {needs}
                  </div>
                  <div>
                    Wants/Luxuaries: $ {wants}
                  </div>
              </div>

              <div className="seperator">
                
              </div>

              <div className="analysis-container">
                <ul>
                  {income !== 0 && <li>You saved {Math.floor((savings/income)*100)}% of your income.</li>}
                  {savingsBudget !== 0 && <li>You had planned to save {savingsBudget}% of your income</li>}

                  {investments !== 0 && income !== 0 && <li>You invested {(investments/income)*100}% of your income. 
                  {investmentsBudget !== 0 && <>You had planned to invest {Math.round(investmentsBudget)}% of your income</>}</li>}

                  {income !== 0 && <li>{Math.floor((needs/income)*100)}% of your income was spent on needs</li>}
                  {income === 0 && <li>{Math.floor((needs/totalSpending)*100)}% of your spending was on needs. 
                  {needsBudget !== 0 && <>You had planned to spend {needsBudget}% of your income on Needs</>}</li>}
                  

                  {income !== 0 && <li>{Math.floor((wants/income)*100)}% of your income was spent on wants</li>}
                  {income === 0 && <li>{Math.floor((wants/totalSpending)*100)}% of your spending was on wants</li>}
                  {wantsBudget !== 0 && <li>. You had planned to spend {wantsBudget}% of your income on Wants</li>}

                </ul>
              </div>
              
            </div>
            <SetBudgetModal 
            isOpen={open} 
            handleModal={setOpen} 
            />
        </PageTemplate>
        </>
    )
}

export default IncomeExpenditureAnalysis;