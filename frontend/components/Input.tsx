import { InputProps } from "../types";

const Input = ({ name, handleChange, type, ...rest }: InputProps) => {
  return (
    <div className="field px-6">
      <label className="label is-capitalized is-small" htmlFor={name}>
        {name}
      </label>
      <div className="control">
        <input
          className="input is-small"
          {...rest}
          required
          type={type}
          onChange={(e) =>
            handleChange({
              [name]:
                type === "number" ? parseFloat(e.target.value) : e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};

export default Input;
