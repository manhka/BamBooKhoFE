import { useNavigate } from "react-router-dom";

export const useApiWithErrorRedirect = () => {
  const navigate = useNavigate();

  const callApi = async (apiFunc, ...args) => {
    try {
      return await apiFunc(...args);
    } catch (err) {
      const status = err.status || err.response?.status;

      // if (status === 400) navigate("/error/400");
      // else
      if (status === 401) navigate("/error/401");
      // else
      if (status === 403) navigate("/error/403");
      // else
      if (status === 404) navigate("/error/404");
      // else
      // if (status === 500) navigate("/error/500");
      // else navigate("/error/500");

      throw err; // nếu cần xử lý thêm toast / modal
    }
  };

  return { callApi };
};
