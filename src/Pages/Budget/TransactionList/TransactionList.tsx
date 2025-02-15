import {useState, useEffect} from "react";
import { getTransactionsAPI } from "../../../API/transaction";
import { transactionType } from "../../Types";
import "./TransactionList.css";
import Loader from "../../../components/Loader/Loader";
import useUserInfo from '../../../utils/LocalStorage';

function TransactionList({
  handleOpen,
  setViewTXN,
  year,
  month,
  search,
  deleteTXN,
  setDeleteTXN,
  newTXN,
  setNewTXN,
  category,
  setBarData,
  barData
}: {
  handleOpen: () => void;
  setViewTXN: (transaction: transactionType) => void;
  year: string;
  month: string;
  search: string;
  deleteTXN: transactionType | undefined;
  setDeleteTXN: (value: transactionType|undefined) => void;
  newTXN: transactionType | undefined;
  setNewTXN: (value: transactionType|undefined) => void;
  category: string;
  setBarData: (transactionArray: Map<string, number>) => void;
  barData: Map<string, number> | undefined;
}) {

  const [transactions, setTransactions] = useState<transactionType[][]>([]);
  let txnToBeDeleted = deleteTXN;
  let txnToBeAdded = newTXN;
  const { userData } = useUserInfo();


  const getTransactions = async (year: string, month: string, search: string, category: string) => {

    const response = await getTransactionsAPI(userData.id ,year, month, search, category);

    if(response.data !== null && response.error === null) {
      return response.data;
    } else {
      alert(`An error occurred: ${response.error}. Please contact us at ayaan.adil@gmail.com or uzaifsheikh09@gmail.com`);
      return new Array<transactionType>;
    }
  };
  
  const deleteTransaction =  (id : number) => {

    let newTransactionList: transactionType[][] = []; 

    transactions.map((dailyTXNList) => {
      newTransactionList.push(dailyTXNList.filter((txn)=> txn.id !== id))
    });

    setTransactions(newTransactionList);
  }

  useEffect(() => {

    if (deleteTXN !== undefined) {

      let updatedBarData = new Map(barData);
      updatedBarData.set(deleteTXN.category, updatedBarData.get(deleteTXN.category)! - deleteTXN.value);
      setBarData(updatedBarData);

      deleteTransaction(deleteTXN.id);
      setDeleteTXN(undefined); // Set back to undefined after deletion
      
    } else if (newTXN !== undefined){
      
      let newTXNDate = new Date(newTXN.date);
      newTXN.date = newTXNDate.getDate() + "";

      let newTransactions = [...transactions];

      // Check if any other transactions exist on the same day
      if (transactions[0].length !== 0 && ((newTXNDate.getDate() + "") === transactions[0][0].date)) {

        let prevDayTXNS: transactionType[] = transactions[0];

        prevDayTXNS.unshift(newTXN);
        newTransactions.splice(0, 1); 
        newTransactions.unshift(prevDayTXNS);

      }  else {
        newTransactions.unshift([newTXN]);        
      }

      setTransactions(newTransactions);
      
      let updatedBarData = new Map(barData);
      if (updatedBarData.has(newTXN.category)) {
        updatedBarData.set(newTXN.category, newTXN.value + updatedBarData.get(newTXN.category)!)
      } else {
        updatedBarData.set(newTXN.category, newTXN.value);
      }
      setBarData(updatedBarData);
      setNewTXN(undefined);
    } else {

      getTransactions(year, month, search, category)
      .then((res: transactionType[]) => {
        let transactionList: transactionType[][] = []
        let prevDate = 0;
        let newDateTXNs:transactionType[]  = [];

        let barData= new Map<string, number> ();

        for (let i = 0; i < res?.length; i++) {


          if (res[i].category !== "null"){ 
            if (barData.has(res[i].category)) {
              barData.set(res[i].category, res[i].value + barData.get(res[i].category)!)
            } else {
              barData.set(res[i].category, res[i].value);
            }
          }

          let dateObject = new Date(res[i].date);
          let date = dateObject.getDate();
          let month  = dateObject.getMonth() + 1;
          let dateTime = `${dateObject.getDate()}/${month}/${dateObject.getFullYear()} ${dateObject.getHours()}:${dateObject.getMinutes()}`;
          res[i].date = dateTime;
        
          if (i === 0) {

            prevDate = date;
            newDateTXNs.push(res[i]);

          } else {

            if (date === prevDate) {
              newDateTXNs.push(res[i]);

            } else {
              transactionList.push(newDateTXNs);
              newDateTXNs = [];
              prevDate = date;
              newDateTXNs.push(res[i]);
            }
          }

        }
        setBarData(barData);
        transactionList.push(newDateTXNs);
        transactionList.reverse();
        setTransactions(transactionList.reverse());
      });
      

    }

  }, [year, month, search, category,txnToBeDeleted, txnToBeAdded])

  return (
    <>
    {transactions.length === 0 &&
      <Loader/>
    }

    {transactions.length === 1 && transactions[0].length === 0 &&
      <div> No transactions </div>
    }
    
    {transactions.length > 0 && transactions[0].length > 0 && transactions.map((tList) => {
      <div className="transaction-list-seperator"></div>
      return (
        <>
          <div className="transaction-list-date-container">
            
            <div className="transaction-list-date">
            {tList.length > 0 && tList[0].date && / /.exec(tList[0].date) !== null && tList[0].date.slice(0, / /.exec(tList[0].date)!.index)}
            </div>
            
          </div>
          {tList.map((transaction, key) => {             
            return (
              <div id={`${key}`} className="transaction" onClick={() => { handleOpen(); setViewTXN(transaction);}}>
                  <div className="transaction-descriptor">{transaction.title}</div>

                  {(transaction.income || transaction.type === "Savings") &&
                    <div className="transaction-descriptor">+{transaction.value}$</div>
                  }

                  {!transaction.income && transaction.type !== "Investments" && transaction.type !== "Savings" &&
                    <div className="transaction-descriptor">-{transaction.value}$</div>
                  }

                  {!transaction.income && transaction.type === "Investments" &&
                    <div className="transaction-descriptor">↑{transaction.value}$</div>
                  }
                  
              </div>
            );
          })}
        </>
      
      );
      
    })}
    </>
  );
}

export default TransactionList;