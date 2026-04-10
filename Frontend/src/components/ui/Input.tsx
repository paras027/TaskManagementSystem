interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={props.id}>{label}</label>}
      <input className={`input ${className}`} {...props} />
    </div>
  );
};