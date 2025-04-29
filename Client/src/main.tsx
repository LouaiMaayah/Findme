import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SignInPage from "./pages/SignInPage.tsx";
import "./styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage.tsx";

const router = createBrowserRouter([
  { path: "/", element: <SignInPage /> },
  { path: "lobby", element: <LobbyPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
