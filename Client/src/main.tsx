import { createRoot } from "react-dom/client";

import "./styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage.tsx";
import GamePage from "./pages/GamePage.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import TestPage from "./pages/TestPage.tsx";
import SignInPage from "./pages/SignInPage.tsx";

const router = createBrowserRouter([
  { path: "/test", element: <TestPage /> },
  { path: "lobby", element: <LobbyPage /> },
  { path: "lobby/:lobbyName", element: <GamePage /> },
  { path: "/", element: <SignInPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <RouterProvider router={router}></RouterProvider>
  </UserProvider>
);
