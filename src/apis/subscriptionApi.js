import axios from "axios";

export const createSubscription = async (planId) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/subscription`,
    { planId },
    {
      withCredentials: true,
    },
  );
  return data;
};
