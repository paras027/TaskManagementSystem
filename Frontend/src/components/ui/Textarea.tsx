interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = ({ label, className = '', ...props }: TextareaProps) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={props.id}>{label}</label>}
      <textarea className={`textarea ${className}`} {...props} />
    </div>
  );
};