import { useState } from "react";

const InputBox = ({
  name,
  type,
  id,
  value,
  placeholder,
  icon,
  disabled = false,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4  ">
      <input
        type={
          type === "password" ? (passwordVisible ? "text" : "password") : type
        }
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        className="input-box"
        disabled={disabled}
      />
      <i className={"fi " + icon + " input-icon "}></i>
      {type === "password" ? (
        <i
          onClick={() => setPasswordVisible((currentValue) => !currentValue)}
          className={
            "fi fi-rr-eye" +
            (!passwordVisible ? "-crossed" : "") +
            " input-icon left-[auto] right-4 cursor-pointer"
          }
        ></i>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputBox;
