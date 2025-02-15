import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { TextField, TextFieldVariants } from '@mui/material';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import "./Welcome.css";
import PageTemplate from '../../components/PageTemplate/PageTemplate';
import useUserInfo from '../../utils/LocalStorage';
import { useFormik } from "formik";
import * as Yup from 'yup';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { welcomeUserApi } from '../../API/user';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { sessionActive } from '../../utils/utils';

type propsType = {
	label: string;
	variant: TextFieldVariants;
}

type valueType = {
	name: string,
	income: string,
	fixed: boolean,
	needs: string,
	saving: string,
}


const IncomeTextFieldProps: propsType = {
	label: "Income",
	variant: "outlined"
};

const NeedsTextFieldProps: propsType = {
	label: "Needs",
	variant: "outlined"
};

const SavingTextFieldProps: propsType = {
	label: "Saving",
	variant: "outlined"
};

type welcomeUserBodyType = {
	name: string,
	id: string,
	fixed: boolean,
	saving: number,
	needs: number,
	income: number
}

function Welcome() {

	const navigate = useNavigate();

	const { userData, setUserData } = useUserInfo();
	const [loading, setLoading] = useState(false);
	const [errorAlert, setErrorAlert] = useState(false);
  	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!sessionActive()) {
			navigate("/");
		}
		if(userData != null && userData?.user_metadata?.saving) {
			navigate("/budget");
		}

	}, []);

	const welcomeClick = async (values: valueType) => {
		setLoading(true);
		const body: welcomeUserBodyType = {
			name: values.name,
			id: userData.id,
			fixed: values.fixed,
			saving: parseFloat(values.saving.replace(/[^0-9.]/g, '')),
			needs: parseFloat(values.needs.replace(/[^0-9.]/g, '')),
			income:  parseFloat(values.income.replace(/[^0-9.]/g, '')),
		}

		if (userData != null) {
			const response = await welcomeUserApi(body);

			if(response.error === null && response.data !== null) {
				const userDataToCopy = {
					...userData
				}
				userDataToCopy.user_metadata = {
					...userData.user_metadata,
					...body
				}
				setUserData(userDataToCopy);
				navigate("/budget");

			} 
			else {
				setErrorAlert(true);
        		setErrorMessage(`${response.error?.code} - ${response.error?.message}`);
			}
		}

		setLoading(false);
	}

	const initialValues = {
		name: "",
		income: "",
		fixed: false,
		needs: "",
		saving: "",
	}

	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required.'),
		income: Yup.string().required('Income is required.')
			.test('valid-character', "Income can't be negative.", (value) => {
				if (value && value.includes('-')) {
					return false;
				}
				return true;
			}),
		fixed: Yup.boolean(),
		needs: Yup.string().required("Needs is required.")
			.test('valid-character', "Needs can't be negative.", (value) => {
				if (value && value.includes('-')) {
					return false;
				}
				return true;
			}),
		saving: Yup.string().required("Saving is required.").test('valid-character', "Saving can't be negative.", (value) => {
			if (value && value.includes('-')) {
				return false;
			}
			return true;
		}),
	});

	const formit = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			welcomeClick(values);
		},
	});


	return (
		<PageTemplate showNavbar={false} showBox={false}>
			<div className='welcome-page'>
				<div className='welcome-container'>
					<form className='welcome-form' onSubmit={formit.handleSubmit}>
						<div className='welcome-title'>Hi {formit.values.name},</div>
						{errorAlert && <Alert severity="error" sx={{color: "white", background: "#f56262"}}>{errorMessage}</Alert>}
						<Typography className='welcome-h6' variant="h6" gutterBottom>
							Please enter your name.
						</Typography>
						<div className='welcome-l1-input'>
							<div>
								<TextField
									id="outlined-basic"
									label="Name"
									variant="outlined"
									type={"text"}
									value={formit.values.name}
									onChange={formit.handleChange("name")}
									onBlur={formit.handleBlur("name")}
								/>
								<div className="error">{formit.touched.income && formit.errors.income ? (
									<>
										<ErrorOutlineIcon color="error" fontSize="small" />
										{formit.errors.income}
									</>
								) : null}</div>
							</div>
						</div>
						<Typography className='welcome-h6' variant="h6" gutterBottom>
							Prof. Budget wants to know  about your monthly income and whether it remains consistent throughout the year.
						</Typography>
						<div className='welcome-l1-input'>
							<div>
								<NumericFormat
									value={formit.values.income.toString()}
									onChange={formit.handleChange('income')}
									onBlur={formit.handleBlur('income')}
									customInput={TextField}
									prefix={'$'}
									thousandSeparator
									decimalScale={2}
									{...IncomeTextFieldProps}
								/>
								<div className="error">{formit.touched.income && formit.errors.income ? (
									<>
										<ErrorOutlineIcon color="error" fontSize="small" />
										{formit.errors.income}
									</>
								) : null}</div>
							</div>
							<FormControlLabel
								style={{ marginLeft: "12px" }}
								control={
									<Checkbox
										color="success"
										value={formit.values.fixed}
										onChange={formit.handleChange('fixed')}
										onBlur={formit.handleBlur('fixed')}
									/>
								} label="Fixed Income"
							/>
						</div>
						<Typography className='welcome-h6' variant="h6" gutterBottom>
							Prof. Budget wants to know an estimate of your anticipated expenses for necessary items &#40;i.e Rent, Grocery, Gas and more&#41;.
						</Typography>
						<div className='welcome-l1-input'>
							<div>
								<NumericFormat
									value={formit.values.needs}
									onChange={formit.handleChange('needs')}
									onBlur={formit.handleBlur('needs')}
									customInput={TextField}
									prefix={'$'}
									thousandSeparator
									decimalScale={2}
									{...NeedsTextFieldProps}
								/>
								<div className="error">{formit.touched.needs && formit.errors.needs ? (
									<>
										<ErrorOutlineIcon color="error" fontSize="small" />
										{formit.errors.needs}
									</>
								) : null}</div>
							</div>
						</div>
						<Typography className='welcome-h6' variant="h6" gutterBottom>
							Prof. Budget wants to know how much percentage do you plan to save monthly.
						</Typography>
						<div className='welcome-l1-input'>
							<div>
								<NumericFormat
									value={formit.values.saving}
									onChange={formit.handleChange('saving')}
									onBlur={formit.handleBlur('saving')}
									customInput={TextField}
									suffix='%'
									max={100}
									min={0}
									thousandSeparator
									decimalScale={2}
									{...SavingTextFieldProps}
								/>
								<div className="error">{formit.touched.saving && formit.errors.saving ? (
									<>
										<ErrorOutlineIcon color="error" fontSize="small" />
										{formit.errors.saving}
									</>
								) : null}</div>
							</div>
						</div>

						<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: "100%" }}>
							<div style={{ marginRight: "6px" }}>
								{loading
									&&
									<CircularProgress color="success" />
								}
							</div>
							<button className="welcome-button">
								<span className="text">Continue</span>
							</button>
						</div>
					</form>

				</div>

			</div>

		</PageTemplate>
	);
}

export default Welcome;