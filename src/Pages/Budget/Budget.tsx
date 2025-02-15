import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Budget.css";

import PageTemplate from "../../components/PageTemplate/PageTemplate";

import AddTransactionModal from "./Modals/AddTransactionModal";
import ViewTransactionModal from "./Modals/ViewTransactionModal";
import TransactionList from "./TransactionList/TransactionList";
import ButtonBar from "./ButtonBar/ButtonBar";
import { reminderType, transactionType } from "../Types";
import TextField from "@mui/material/TextField";
import BudgetBar from "./BudgetBar";
import useUserInfo from "../../utils/LocalStorage";
import { GetRemindersAPI } from "../../API/reminder";
import { sessionActive } from "../../utils/utils";
import { Snackbar } from "@mui/material";
// import { getUserMetadata } from "../../API/user";


function Budget() {

  const [barData, setBarData] = useState<Map<string, number> | undefined>();

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [TXNopen, setTXNOpen] = useState<boolean>(false);
  const handleTXNOpen = () => setTXNOpen(true);
  const handleTXNClose = () => setTXNOpen(false);

  const [viewTXN, setViewTXN] = useState<transactionType>();

  const currentDate = new Date();
  const [year, setYear] = useState<string>(currentDate.getFullYear() + "");
  const [month, setMonth] = useState<string>(currentDate.getMonth() + 1 + "");

  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("category");

  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const { userData, setUserData } = useUserInfo();
  const navigate = useNavigate();

  const [deleteTXN, setDeleteTXN] = useState<transactionType | undefined>(undefined);

  const [newTXN, setNewTXN] = useState<transactionType | undefined>(undefined);

  const [openNotify, setNotify] = useState<boolean>(false);
  const [notifyMessage, setNotifyMessage] = useState<String>("");

  const onClose = () => {
    setNotify(false);
  }

  const id = userData != null ? userData.id : "";

  useEffect(() => {
    if (!sessionActive()) {
      navigate("/login");
      return;
    }

    
    // getUserMetadata(id).then((res) => {
    //   if (res.data !== null && res.error === null && res.data.length === 0) {
    //     navigate(`/welcome/${id}`);
    //   } else if (res.error) {
    //     console.log(res?.error?.message);
    //   }
    // })

    const todayDate = new Date();
    const dateT =
      todayDate.getFullYear() +
      "-" +
      (todayDate.getMonth() + 1 >= 10
        ? todayDate.getMonth() + 1
        : `0${todayDate.getMonth() + 1}`) +
      "-" +
      todayDate.getDate();

    if (userData?.reminderDate !== dateT) {
      userData.reminderDate = dateT;
      setUserData({
        ...userData,
        reminderDate: dateT,
      });
      GetRemindersAPI({ id: id })
        .then((res) => {
          if (res.data !== null && res.error === null) {
            res.data.forEach((ele: reminderType) => {
              const date = new Date();
              const today =
                date.getFullYear() +
                "-" +
                (date.getMonth() + 1 >= 10
                  ? date.getMonth() + 1
                  : `0${date.getMonth() + 1}`) +
                "-" +
                date.getDate();

              const ReminderDate = ele.timestamp.split("T")[0];
              if (
                new Date(ReminderDate).toString() === new Date(today).toString()
              ) {
                setNotify(true);
                setNotifyMessage(`Reminder: ${ele.message} due today!`);
              }
            });
          } else {
            console.log(res.error.message);
          }
        })
        .catch((err) => {
          console.log(err);
      });
    }
  }, []);

  return (
    <PageTemplate>
      <div className="budget-page">

        <div className="budget-container">
          <div className="budget-bar">

            <BudgetBar year={year} month={month} barData={barData} />

          </div>

          <div className="transaction-box">
            {showSearchBar &&
              <div className="mobile-search">
                <TextField size="small" id="outlined-basic" label="Search.." variant="outlined" onChange={(e) => setSearch(e.target.value)} />
              </div>
            }
            <div className="button-container">
              <ButtonBar
                handleOpen={handleOpen}
                setYear={setYear}
                setMonth={setMonth}
                setSearch={setSearch}
                setShowSearchBar={setShowSearchBar}
                showSearchBar={showSearchBar}
                month={month}
                year={year}
                setCategory={setCategory}
                category={category}
              />
            </div>

            <div className="transaction-list">

              <TransactionList
                deleteTXN={deleteTXN}
                setDeleteTXN={setDeleteTXN}
                newTXN={newTXN}
                setNewTXN={setNewTXN}
                handleOpen={handleTXNOpen}
                setViewTXN={setViewTXN}
                year={year}
                month={month}
                search={search}
                category={category}
                setBarData={setBarData}
                barData={barData}
              />

            </div>

            <AddTransactionModal
              isOpen={open}
              handleClose={handleClose}
              setNewTXN={setNewTXN}
            />

            <ViewTransactionModal
              isOpen={TXNopen}
              handleClose={handleTXNClose}
              viewTXN={viewTXN}
              setTXNOpen={setTXNOpen}
              setDeleteTXN={setDeleteTXN}
            />

          </div>
        </div>

        <Snackbar open={openNotify} message={notifyMessage} autoHideDuration={2000} onClose={onClose} />
      </div>
    </PageTemplate>
  );
}

export default Budget;
