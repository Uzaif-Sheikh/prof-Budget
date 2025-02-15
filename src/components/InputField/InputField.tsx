import "./InputField.css"

type Props = {
    type?: string;
    placeholder?: string;
}
const InputField = ({type = "text", placeholder = "text"}: Props) => {
    return (
        <input placeholder={placeholder} className="input" type={type}></input>
    );
}

export default InputField;