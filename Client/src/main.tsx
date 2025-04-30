import { createRoot } from "react-dom/client";
import SignInPage from "./pages/SignInPage.tsx";
import "./styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage.tsx";
import GamePage from "./pages/GamePage.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";

const router = createBrowserRouter([
  { path: "/", element: <SignInPage /> },
  { path: "lobby", element: <LobbyPage /> },
  { path: "lobby/:lobbyName", element: <GamePage /> },
]);

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <RouterProvider router={router}></RouterProvider>
  </UserProvider>
);
