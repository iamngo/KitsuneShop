import { message } from "antd";
import { ADMIN, LOGIN, PRODUCTS, USER } from "../routes";
import { getUser, refresh } from "../services/api";
import { ERROR, ROLE } from "../utils/constants";

export const refreshToken = async (navigate: any) => {
  const handleUnauthorized = () => {
    message.error(ERROR.AUTH);
    navigate(LOGIN);
  };
  const storedRefreshToken = localStorage.getItem("refreshToken");
  const storedAccessToken = localStorage.getItem("accessToken");
//   if (!storedAccessToken && !storedRefreshToken) {
//     handleUnauthorized();
//   }
  if (storedRefreshToken) {
    try {
      const response = await refresh(storedRefreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response;

      localStorage.setItem("refreshToken", newRefreshToken);

      const userData = await getUser(accessToken);

      if (userData.role === ROLE.ADMIN) {
        navigate(`${ADMIN}/${PRODUCTS}`, { state: { token: accessToken } });
      } else if (userData.role === ROLE.USER) {
        navigate(`${USER}/${PRODUCTS}`, {
          state: { token: accessToken, user: userData },
        });
      }
    } catch (error) {
      console.error("Failed to refresh token", error);
      navigate(LOGIN);
    }
  }
};
