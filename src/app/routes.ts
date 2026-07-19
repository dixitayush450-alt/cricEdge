import {
  createBrowserRouter,
} from "react-router";

import { Layout } from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

import { Home } from "./pages/Home";
import { Prediction } from "./pages/Prediction";
import { Teams } from "./pages/Teams";
import { Players } from "./pages/Players";
import { Analytics } from "./pages/Analytics";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { History } from "./pages/History";
import { Profile } from "./pages/ProfileOld";
import { ForgotPassword } from "./pages/ForgotPassword";
import { OAuthSuccess } from "./pages/OAuthSuccess";

export const router =
  createBrowserRouter([
    {
      path: "/",
      Component: Layout,
      children: [
        {
          index: true,
          Component: Home,
        },
        {
          path: "teams",
          Component: Teams,
        },
        {
          path: "players",
          Component: Players,
        },
        {
          path: "analytics",
          Component: Analytics,
        },
        {
          path: "about",
          Component: About,
        },

        /*
          OAuth callback ko PublicOnlyRoute ke bahar rakho.
          Google se token aane ke baad auth state update hoti hai,
          isliye callback page ko freely complete hone dena zaroori hai.
        */
        {
          path: "oauth-success",
          Component: OAuthSuccess,
        },

        {
          Component: ProtectedRoute,
          children: [
            {
              path: "prediction",
              Component: Prediction,
            },
            {
              path: "history",
              Component: History,
            },
            {
              path: "profile",
              Component: Profile,
            },
          ],
        },

        {
          Component: PublicOnlyRoute,
          children: [
            {
              path: "login",
              Component: Login,
            },
            {
              path: "signup",
              Component: Signup,
            },
            {
              path: "forgot-password",
              Component: ForgotPassword,
            },
          ],
        },
      ],
    },
  ]);