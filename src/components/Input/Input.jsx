import PropTypes from "prop-types";

export default function Input({
  className,
  name,
  register,
  errorMessage,
  classNameInputCustom = "",
  classNameInput = "w-full h-[45px] rounded-[10px] border border-quaternary/20 p-3 outline-none focus:border-quaternary focus:shadow-sm",
  classNameError = "mt-1 min-h-[1.25rem] text-sm text-red-600",
  ...rest
}) {

  const registerResult = register && name ? register(name) : null;
  const isPass = rest.type === "password" ? " pr-10" : "";

  return (
    <div className={"relative " + className}>
      <input
        className={classNameInputCustom + " " + classNameInput + " " + isPass}
        name={name}
        {...registerResult}
        {...rest}
        type={rest.type === "password" ? rest.type : "text"}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  classNameInputCustom: PropTypes.string,
  classNameInput: PropTypes.string,
  classNameError: PropTypes.string,
  classNameEye: PropTypes.string,
  register: PropTypes.func,
};
