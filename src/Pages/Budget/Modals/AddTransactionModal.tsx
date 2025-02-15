import {useState} from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import * as Yup from 'yup';
import { useFormik } from "formik";
import { bodyType } from "../../Types.tsx";
import Select from '@mui/material/Select';
import useUserInfo from '../../../utils/LocalStorage.ts';
import { addTransactionAPI } from "../../../API/transaction.ts";
import './ModalView.css';
import { transactionType } from "../../Types.tsx";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';


function AddTransactionModal({isOpen, handleClose, setNewTXN}: { isOpen: boolean; handleClose: () => void; setNewTXN: (newTXN: transactionType|undefined) => void}) {

    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { userData } = useUserInfo();

    const initialValues = {
        title: "",
        description: "",
        category: "Other",
        value: 0,
        income: false,
        owner: userData?.id,
        type: ""
    }

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required."),
        value: Yup.string().required("Value is required."),
        income: Yup.string().required("This field is required."),
    });

    const addTransaction = async (body :bodyType) : Promise<transactionType[]|undefined> => {

        
        const response = await addTransactionAPI(body);
        if(response.error === null && response.data !== null) {
            setErrorAlert(false);
            setErrorMessage("");
            console.log("Add Transaction Success");
            return response.data;
        } else {
          setErrorAlert(true);
          setErrorMessage(`${response.error.message}`);
        }
    
    }

    const addNewTransaction = (body: bodyType):void => {
        addTransaction(body)
        .then((res: transactionType[]|undefined) => {
            if (res !== undefined){
                setNewTXN(res[0]);
            }
            formit.values.description = ""
            formit.values.title = ""
            formit.values.value = 0
            handleClose();
        })
    }

    const formit = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const body = {
                title: values.title,
                description: values.description,
                category: values.category,
                value: values.value,
                income: values.income,
                owner: userData?.id,
                type: values.type
            }
          addNewTransaction(body);
        },
    });

    return (
        <>
        <Modal
        open={isOpen}
        onClose={handleClose}
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
                        <div>Add Transaction</div>
                    </div>

                    <form className="add-transaction-form" onSubmit={formit.handleSubmit}>
                    {errorAlert && <Alert severity="error" sx={{color: "white", background: "#f56262"}}>{errorMessage}</Alert>}

                        <div className="add-transaction-modal-line1">
                            <div>
                                <FormControl style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                                    <FormLabel id="demo-radio-buttons-group-label">Is income ?  </FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={formit.values.income}
                                        onChange={(e) => {
                                            formit.setFieldValue('income', JSON.parse(e.target.value));
                                          }}
                                        style={{display: 'flex', flexDirection: 'column'}}
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="YES" />
                                        <FormControlLabel value={false} control={<Radio />} label="NO" />
                                    </RadioGroup>
                                
                                </FormControl>
                            </div>

                            {formit.values.income === false &&
                            <div>
                                <FormControl>

                                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Type"
                                    sx={{width: '150px'}}
                                    value={formit.values.type}
                                    onChange={(e) => formit.setFieldValue("type", e.target.value)}
                                    >
                                        <MenuItem value={"Needs"}>Needs</MenuItem>
                                        <MenuItem value={"Wants"}>Wants</MenuItem>
                                        <MenuItem value={"Savings"}>Savings</MenuItem>
                                        <MenuItem value={"Investments"}>Investments</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            }
                        </div>

                        <div className="title-field">
                                <TextField
                                id="outlined-basic"
                                variant="outlined"
                                value={formit.values.title}
                                onChange={formit.handleChange("title")}
                                onBlur={formit.handleBlur("title")}
                                label={"Title"}
                                />
                                <div className="error">
                                    {formit.touched.title && formit.errors.title ? (
                                        <>
                                        <ErrorOutlineIcon color="error" fontSize="small"/> 
                                        {formit.errors.title}
                                        </>
                                    ) : null}
                                </div>
                            </div>

                        <div className="value-field">
                            <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={formit.values.value}
                            onChange={formit.handleChange("value")}
                            onBlur={formit.handleBlur("value")}
                            label={"Value"}
                            />
                            <div className="error">
                            {formit.touched.value && formit.errors.value ? (
                                <>
                                    <ErrorOutlineIcon color="error" fontSize="small"/> 
                                    {formit.errors.value}
                                </>
                            ) : null}
                            </div>
                        </div>
                    
                        <div className="description"style={{width: '100%'}}>
                            <TextField
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            rows={4}
                            value={formit.values.description}
                            onChange={formit.handleChange("description")}
                            onBlur={formit.handleBlur("description")}
                            sx={{width: '100%'}}
                            />
                        </div>

                        <div className="add-transaction-modal-line1">
                            
                            {formit.values.income === false && formit.values.type !== "Investments" &&
                            <div>
                            <FormControl>

                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Category"
                                sx={{width: '150px'}}
                                value={formit.values.category}
                                onChange={(e) => formit.setFieldValue("category", e.target.value)}
                                >
                                    <MenuItem value={"Travel"}>Travel</MenuItem>
                                    <MenuItem value={"Eating Out"}>Eating Out</MenuItem>
                                    <MenuItem value={"Groceries"}>Groceries</MenuItem>
                                    <MenuItem value={"Shopping"}>Shopping </MenuItem>
                                    <MenuItem value={"Entertainment"}>Entertainment </MenuItem>
                                    <MenuItem value={"Cash"}>Cash</MenuItem>
                                    <MenuItem value={"Health"}>Health</MenuItem>
                                    <MenuItem value={"Utilities"}>Utilities</MenuItem>
                                    <MenuItem value={"Other"}>Other</MenuItem>
                                </Select>
                            </FormControl>
                            </div>
                            
                            }
                            
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

export default AddTransactionModal;