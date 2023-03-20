import axios from "axios";
import type { StateDispatch } from "../types";

export const pinImage = async (
  selectedFile: File,
  name: string,
  setLoading: StateDispatch<boolean>
) => {
  let result;
  const formData = new FormData();
  formData.append("file", selectedFile);

  const metadata = JSON.stringify({
    name,
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
        },
      }
    );
    console.log(res.data);
    result = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
  return result;
};
