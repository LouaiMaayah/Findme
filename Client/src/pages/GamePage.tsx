import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { HubConnectionBuilder } from "@microsoft/signalr";

function GamePage() {
  const { lobbyName } = useParams();
  const { username } = useUser();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<string[]>([]);
  const { isLobbyAdmin } = useUser();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/hubs/lobby`)
      .withAutomaticReconnect()
      .build();

    setLoading(true);

    connection
      .start()

      .then(async () => {
        connection.on("UserListUpdated", (userList: string[]) => {
          console.log("UserListUpdated", userList);
          setUsers(userList);
        });

        if (isLobbyAdmin) {
          await connection.invoke("CreateLobby", lobbyName, username);
          await connection.invoke("JoinLobby", lobbyName, username);
        } else {
          await connection.invoke("JoinLobby", lobbyName, username);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("SignalR Connection Error:", error);
      });

    return () => {
      connection
        .invoke("LeaveLobby", lobbyName, username)
        .catch((err) => console.error(err));
      connection.stop().catch((err) => console.error(err));
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {loading ? (
        <>loading</>
      ) : (
        <>
          {users.map((user) => {
            return <div key={user}>{user}</div>;
          })}
        </>
      )}
    </div>
  );
}

export default GamePage;
