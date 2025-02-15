import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from "formik";
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import "./Reminder.css"
import { GetRemindersAPI, addReminderAPI, DeleteReminderAPI } from "../../API/reminder";
import usevInfo from "../../utils/LocalStorage";
import { reminderType } from "../Types";
import { sessionActive } from "../../utils/utils";

type reminderAddType = {
	userId: string;
	message: string;
	date: string;
}


function Reminder() {

	const [errorAlert, setErrorAlert] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingReminder, setLoadingReminder] = useState(true);
	const [reminders, setReminder] = useState<reminderType[]>([]);

	const { userData } = usevInfo();
	const navigate = useNavigate();


	useEffect(() => {

		if (!sessionActive()) {
			navigate("/login");
			return;
		}

		const id = userData != null ? userData.id : "";
		GetRemindersAPI({ "id": id })
			.then(res => {
				if(res.data !== null && res.error === null) {
					setLoadingReminder(false);
					setReminder([
						...res.data
					]);
				} else {
					console.log(res.error.message);
				}

			})
			.catch(err => {
				console.log(err);
			})

	}, []);

	const deleteReminderClick = async (id: number) => {
		try {
			setLoadingReminder(true);
			const res = await DeleteReminderAPI(id);
			if (!res.error) {
				setReminder(reminders.filter(ele => ele.id != id));
			}
			setLoadingReminder(false);
		} catch (error) {
			console.error(error);
		}
	}

	const reminderClick = async (value: reminderAddType) => {

		value.userId = userData != null ? userData.id : "";
		setLoading(true);
		try {
			const res = await addReminderAPI(value);
			
			if(res.error === null && res.data !== null) {

				setErrorAlert(false);
				setReminder([
					res.data[0],
					...reminders
				]);
				console.log(reminders);
	
	
			} else {
				setErrorAlert(true);
				setErrorMessage(res.error.message);
				console.log(res.error);
			}

		} catch (error) {
			setErrorAlert(true);
			setErrorMessage(String(error));
		}

		setLoading(false);
		formit.resetForm();
	}


	
	const initialValues = {
		message: "",
		date: "",
		userId: "",
	}

	const validationSchema = Yup.object({
		message: Yup.string().required("messgage is required."),
		date: Yup.date().required("Date is required.").min(new Date()),
	});

	const formit = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			reminderClick(values);
		},
	});

	return (
		<PageTemplate showNavbar={true} showBox={true}>
			<div className="reminder-page">
				<div className="reminder-container">
					<form className="reminder-form" onSubmit={formit.handleSubmit}>
						<div className="reminder-title">Reminder</div>
						{errorAlert && <Alert severity="error" sx={{ color: "white", background: "#f56262" }}>{errorMessage}</Alert>}
						<div className="vname">
							<TextField
								id="outlined-basic"
								variant="outlined"
								value={formit.values.message}
								onChange={formit.handleChange("message")}
								onBlur={formit.handleBlur("message")}
								label={"Message"}
								multiline
								rows={3}
							/>
							<div className="error">{formit.touched.message && formit.errors.message ? (
								<>
									<ErrorOutlineIcon color="error" fontSize="small" />
									{formit.errors.message}
								</>
							) : null}</div>
						</div>
						<div className="date-reminder">
							<TextField
								id="outlined-basic"
								variant="outlined"
								value={formit.values.date}
								onChange={formit.handleChange("date")}
								onBlur={formit.handleBlur("date")}
								type={"date"}
							/>
							<div className="error">{formit.touched.date && formit.errors.date ? (
								<>
									<ErrorOutlineIcon color="error" fontSize="small" />
									{formit.errors.date}
								</>
							) : null}
							</div>
						</div>
						<div>
							<button className="reminder-button">
								<span className="text">Reminder</span>
							</button>
						</div>
						<div>
							{(loading || loadingReminder)
								&&
								<CircularProgress color="primary" />
							}
						</div>
					</form>
				</div>

				<h2 className="up-reminder">Upcoming Reminders:</h2>

				<div className="reminder-list-container">
					{reminders.map(v => {
						const d = new Date(v.timestamp.split('T')[0]);
						const month = d.toLocaleString('default', { month: 'long' });
						return (
							<div className="card" key={v.id}>
								<div className="card-details">
									<p className="text-title">{v.message}</p>
									<div className="card-body">
										<div className="time-info">
											<p className="text-body">{d.getDate()} {month} {d.getFullYear()}</p>
										</div>
									</div>
								</div>
								<button className="reminder-card-btn" onClick={() => deleteReminderClick(v.id)}><DeleteIcon color="primary"/></button>
							</div>
						);
					})}
				</div>



			</div>
		</PageTemplate>
	);

}

export default Reminder;