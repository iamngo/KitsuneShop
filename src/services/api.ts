import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const refresh = async (refreshToken: string) => {
  const response = await axios.post(`${API_BASE_URL}/refresh`, {
    refreshToken
  });
  return response.data;
};

export const getUser = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const register = async (user: any) => {
  const response = await axios.post(`${API_BASE_URL}/user`, user);
  return response.data;
};

export const getAllProduct = async (
  productName: string,
  page: number,
  offset: number = 10
) => {
  const response = await axios.get(`${API_BASE_URL}/product`, {
    params: { productName, page, offset },
  });
  console.log(response.data);

  return response.data;
};

export const getProductById = async (id: string, token: string) => {
  const response = await axios.get(`${API_BASE_URL}/product/id/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createProduct = async (product: any, token: string) => {
  const response = await axios.post(`${API_BASE_URL}/product`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProduct = async (
  id: string,
  product: any,
  token: string
) => {
  const response = await axios.patch(`${API_BASE_URL}/product/${id}`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteProduct = async (id: string, token: string) => {
  const response = await axios.delete(`${API_BASE_URL}/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProductPicture = async (
  id: string,
  picture: FormData,
  token: string
) => {
  const response = await axios.patch(
    `${API_BASE_URL}/product/picture/${id}`,
    picture,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getAllCategory = async (
  categoryName: string,
  page: number,
  offset: number = 10
) => {
  const response = await axios.get(`${API_BASE_URL}/category`, {
    params: { categoryName, page, offset },
  });
  console.log(response.data);

  return response.data;
};

export const getCategoryById = async (id: string, token: string) => {
  const response = await axios.get(`${API_BASE_URL}/category/id/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCategoryByName = async (name: string) => {
  const response = await axios.get(`${API_BASE_URL}/category/${name}`);
  return response.data;
};

export const createCategory = async (
  category: { name: string },
  token: string
) => {
  const response = await axios.post(`${API_BASE_URL}/category`, category, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCategory = async (
  id: string,
  category: { name: string },
  token: string
) => {
  const response = await axios.patch(
    `${API_BASE_URL}/category/${id}`,
    category,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteCategory = async (id: string, token: string) => {
  const response = await axios.delete(`${API_BASE_URL}/category/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getProductByUrlName = async (urlName: string) => {
  const response = await axios.get(`${API_BASE_URL}/product/${urlName}`);
  return response.data;
};

export const createPurchase = async (
  product: { productId: string; amount: number },
  token: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/purchase`, product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error in createPurchase:", error);
    throw error;
  }
};

export const getPurchaseOfUser = async (
  token: string,
  userId: string,
  productId: string | null,
  page: number,
  offset: number = 10,
) => {
  const response = await axios.get(`${API_BASE_URL}/purchase`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { userId, productId, page, offset },
  });
  console.log(response.data);

  return response.data;
};

export const getPurchaseOfAdmin = async (
  token: string,
  userId: string,
  productId: string,
  page: number,
  offset: number = 10,
) => {
  const response = await axios.get(`${API_BASE_URL}/purchase/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { userId, productId, page, offset },
  });
  console.log(response.data);

  return response.data;
};

export const deletePurchase = async (id: string, token: string) => {
  const response = await axios.delete(`${API_BASE_URL}/purchase/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getPurchaseById = async (id: string, token: string) => {
  const response = await axios.get(`${API_BASE_URL}/purchase/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateReviewPurchase = async (id: string, token: string, reviewNote: number, reviewComment: string) => {
  const response = await axios.patch(`${API_BASE_URL}/purchase/review/${id}`, {
    reviewNote,
    reviewComment
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updatePurchase = async (id: string, token: string, productId: number, amount: number) => {
  const response  = await axios.patch(`${API_BASE_URL}/purchase/${id}`, {
    productId,
    amount
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};