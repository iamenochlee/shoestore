import React from "react";
import type { ImageInputProps } from "../types";

const ImageInput = ({
  name,
  handleChange,
  preview,
  setPreview,
}: ImageInputProps) => {
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    handleChange({
      image: selectedFile,
    });
    const reader = new FileReader();
    reader.onload = function (event) {
      setPreview(event?.target?.result);
    };
    reader.readAsDataURL(selectedFile as Blob);
  }
  return (
    <div className="is-centered mb-5">
      <label htmlFor={name}>
        <img
          className="preview-image"
          src={preview ? preview : "/picture.png"}
          alt={name}
          loading="lazy"
        />
        <input
          id={name}
          name={name}
          type="file"
          className="is-hidden"
          placeholder="image"
          required
          onChange={handleFileSelect}
        />
      </label>
    </div>
  );
};

export default ImageInput;
