import {useState} from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import * as Yup from 'yup';
import { useFormik } from "formik";

import useUserInfo from '../../../utils/LocalStorage.ts';
import './ModalView.css';



function SetBudgetModal({isOpen, handleModal}: { isOpen: boolean; handleModal: (value: boolean) => void;}) {

    
    const categories = 
    {
        needs: "Needs",
        wants: "Wants",
        savings: "Savings",
        investments: "Investments",
    }
    
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage] = useState("");
    const { userData } = useUserInfo();

    const initialValues = {
        needs: 0,
        wants: 0,
        savings: 0,
        investments: 0,
        userId: userData?.localId
    }

    const validationSchema = Yup.object({
        travelBudget: Yup.string().required("Budget is required"),
    });


    const formit = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
          createBudget();
        },
    });

    const createBudget = () => {

        // BudgetAPI has not been implemented yet! TODO
        
        // const response = await createBudgetAPI(body);
    
        // if(response.ok) {
        //   const res = await response.json();
    
        //   if(res.error) {
        //     setErrorAlert(true);
        //     setErrorMessage(res.error.message);
        //   } else {
        //     setErrorAlert(false);
        //     setErrorMessage("");
        //     handleModal(false);
        //     alert("Budget Added");
        //     return res;
        //   }
        // } else {
        //   setErrorAlert(true);
        //   setErrorMessage(`${response?.status} - ${response?.statusText}`)
        // }

        setErrorAlert(true);
        alert(`BudgetAPI has not been implemented yet!
            Please contact us at ayaan.adil@gmail.com or uzaifsheikh09@gmail.com`);
    
    }

    return (
        <>
        <Modal
        open={isOpen}
        onClose={() => handleModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
            backdropFilter: 'blur(5px)'
        }}
        >
            <Box 
            sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '55vw',
                height: '-20vw',
                minWidth: '300px',
                bgcolor: 'white',
                boxShadow: 24,
                p: 3,
                color: 'black',
                border: 'solid',
                borderColor: '#5cb4f7',
                borderWidth: '2px',
                borderRadius: '10px'
            }}
            className="MuiBox-root css-laxiyf">
                <div className="add-transaction-modal-container">

                    <div className="add-transaction-modal-title">
                        <div>Set Budget</div>
                    </div>

                    <form className="add-transaction-form" onSubmit={formit.handleSubmit}>
                    {errorAlert && <Alert severity="error" sx={{color: "white", background: "#f56262"}}>{errorMessage}</Alert>}

                    <div className="field-container">
                        {(() => {
                            let fieldList = [];
                            for (const [key, value] of Object.entries(categories)) {
                                fieldList.push(
                                    <div>
                                        {value}(%): 
                                        <br/>        
                                        <TextField 
                                        id={key} 
                                        variant="outlined" 
                                        
                                        value={formit.values[key as keyof typeof initialValues]}
                                        onChange={formit.handleChange(key)}
                                        onBlur={formit.handleBlur(key)}
                                        />
                                    </div>
                                );
                            }
                            return fieldList;
                        })()}
                    </div>

                    <div>
                        <button className="add-transaction-modal-container-button">
                            <span className="text">Submit</span>
                        </button>
                    </div>
                    </form>
                    
                </div>
            </Box>
        </Modal>
        </>
    );
}

export default SetBudgetModal;