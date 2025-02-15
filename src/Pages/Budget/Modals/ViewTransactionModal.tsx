import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { transactionType } from "../../Types";
import DeleteIcon from '@mui/icons-material/Delete';
import './ModalView.css';
import { deleteTransactionAPI } from '../../../API/transaction';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';

function ViewTransactionModal({isOpen, handleClose, viewTXN, setTXNOpen, setDeleteTXN}: { isOpen: boolean; handleClose: () => void; viewTXN: transactionType | undefined; setTXNOpen: (b:boolean) => void; setDeleteTXN: (n:transactionType) => void;}) {

    const[showLoad, setShowLoad] = useState(false);

    const deleteTransaction = async (transaction: transactionType) => {
        const response = await deleteTransactionAPI(transaction.id);
    
        if(response.error === null) {

            setTXNOpen(false);
            setDeleteTXN(transaction);
            setShowLoad(false);
        }
    }

    return (
            <>
            <Modal 
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
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
            >
                <div className="view-transaction-modal-container">

                    <div className="view-transaction-modal-title">
                        <div style={{marginRight: "20px"}}>View Transaction </div> {showLoad && <CircularProgress color='primary'/>}
                    </div>

                    <div className='view-transaction-modal-line-1'>
                        <TextField
                        sx={{
                            width: '100%'
                        }}
                        multiline
                        maxRows={4}
                        label="Description"
                        defaultValue={viewTXN?.description}
                        InputProps={{
                            readOnly: true,
                        }}
                        />
                    </div>
                    
                    <div className='view-transaction-modal-line-1'>
                        <TextField
                        multiline
                        maxRows={4}
                        label="Value ($)"
                        defaultValue={viewTXN?.value}
                        InputProps={{
                            readOnly: true,
                        }}
                        />

                        <TextField
                        multiline
                        maxRows={4}
                        label="Date/Time"
                        defaultValue={viewTXN?.date}
                        InputProps={{
                            readOnly: true,
                        }}
                        />
                    </div>

                    <div className='view-transaction-modal-line-1'>
                        <TextField
                        multiline
                        maxRows={4}
                        label="Is Income ?"
                        defaultValue={viewTXN?.income}
                        InputProps={{
                            readOnly: true,
                        }}
                        />

                        { !viewTXN?.income && viewTXN?.type !== "Investments" &&  <TextField
                        multiline
                        maxRows={4}
                        label="Category"
                        defaultValue={viewTXN?.category}
                        InputProps={{
                            readOnly: true,
                        }}
                        />}

                        {!viewTXN?.income && <TextField
                        multiline
                        maxRows={4}
                        label="Category"
                        defaultValue={viewTXN?.type}
                        InputProps={{
                            readOnly: true,
                        }}
                        />}
                    </div>
                    {viewTXN?.id &&
                        <div className="delete-icon" onClick={() => {deleteTransaction(viewTXN); setShowLoad(true)}}><DeleteIcon/></div>
                    }
                    
                    
                </div>
            </Box>
        </Modal>
        </>
    );
}

export default ViewTransactionModal;