import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProductList from "./pages/admin/components/ProductList";
import Admin from "./pages/admin/Admin";
import CategoryList from "./pages/admin/components/CategoryList";
import ProductForm from "./components/ProductForm";
import CategoryForm from "./components/CategoryForm";
import Register from "./pages/auth/Register";
import User from "./pages/user/Home";
import Products from "./pages/user/components/Products";
import ProductDetail from "./pages/user/components/ProductDetail";
import { UserProvider } from "./contexts/UserContext";
import {
  LOGIN,
  REGISTER,
  ADMIN,
  PRODUCTS,
  PRODUCT_FORM,
  PRODUCT_FORM_EDIT,
  CATEGORIES,
  CATEGORY_FORM,
  CATEGORY_FORM_EDIT,
  USER,
  PRODUCT_DETAIL,
  HOME,
  PRODUCT_DETAIL_URL,
  MYPURCHASE,
  PURCHASE_DETAIL_URL,
  CART,
  RECENTLY_VIEWED,
} from "./routes";
import { MODE } from "./utils/constants";
import MyPurchase from "./pages/user/components/MyPurchase";
import PurchaseList from "./pages/admin/components/PurchaseList";
import PurchaseDetail from "./pages/user/components/PurchaseDetail";
import Cart from "./pages/user/components/Cart";
import RecentlyViewed from "./pages/user/components/RecentlyViewed";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={REGISTER} element={<Register />} />
        <Route path={ADMIN} element={<Admin />}>
          <Route path={PRODUCTS} element={<ProductList />} />
          <Route
            path={PRODUCT_FORM}
            element={<ProductForm mode={MODE.ADD} />}
          />
          <Route
            path={PRODUCT_FORM_EDIT}
            element={<ProductForm mode={MODE.EDIT} />}
          />
          <Route path={CATEGORIES} element={<CategoryList />} />
          <Route
            path={CATEGORY_FORM}
            element={<CategoryForm mode={MODE.ADD} />}
          />
          <Route
            path={CATEGORY_FORM_EDIT}
            element={<CategoryForm mode={MODE.EDIT} />}
          />
          <Route path={MYPURCHASE} element={<PurchaseList />} />
          <Route index element={<Navigate to={PRODUCTS} />} />
        </Route>
        <Route path={USER} element={<User />}>
          <Route path={PRODUCTS} element={<Products />} />
          <Route path={PRODUCT_DETAIL_URL} element={<ProductDetail />} />
          <Route path={MYPURCHASE} element={<MyPurchase />} />
          <Route path={PURCHASE_DETAIL_URL} element={<PurchaseDetail />} />
          <Route path={CART} element={<Cart />} />
          <Route path={RECENTLY_VIEWED} element={<RecentlyViewed />} />
        </Route>
        <Route
          path={HOME}
          element={<Navigate to={USER + "/" + PRODUCTS} />}
        ></Route>
      </Routes>
    </UserProvider>
  );
};

export default App;
