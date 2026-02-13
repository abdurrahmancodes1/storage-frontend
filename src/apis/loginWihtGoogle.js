export const loginWithGoogle = async (idToken) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/user/google`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ idToken }),
    },
  );
  const data = await response.json();
  return data;
};
