import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { useContext, lazy, Suspense } from "react";

import { AppContext } from "./contexts/app.context";
import path from "./constants/path";

import MainLayout from "./layouts/MainLayout";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Order = lazy(() => import("./pages/Order"));
const Payment = lazy(() => import("./pages/Payment"));
const Profile = lazy(()=> import("./pages/Profile"));
const OrderHistory = lazy(()=> import("./pages/OrderHistory"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "",
      element: <MainLayout />,
      children: [
        {
          index: true,
          path: path.home,
          element: (
            <Suspense>
              <Home />
            </Suspense>
          ),
        },
        {
          index: true,
          path: path.product,
          element: (
            <Suspense>
              <Product />
            </Suspense>
          ),
        },
        {
          index: true,
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          ),
        },
        {
          path: "*",
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: [
            {
              index: true,
              path: path.cart,
              element: (
                <Suspense>
                  <Cart />
                </Suspense>
              ),
            },
            {
              index: true,
              path: path.order,
              element: (
                <Suspense>
                  <Order/>
                </Suspense>
              ),
            },
            {
              index: true,
              path: path.payment,
              element: (
                <Suspense>
                  <Payment />
                </Suspense>
              ),
            },
            {
              index: true,
              path: path.profile,
              element: (
                <Suspense>
                  <Profile/>
                </Suspense>
              ),
            },
            {
              index: true,
              path: path.orderHistory,
              element: (
                <Suspense>
                  <OrderHistory/>
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: [
            {
              index: true,
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ]);
  return routeElements;
}
