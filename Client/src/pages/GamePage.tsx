import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { HubConnectionBuilder } from "@microsoft/signalr";
import MapComponent from "../components/MapComponent";
import Drawer from "../components/ui/Drawer";
import PlayerCards from "../components/PlayerCards";

function GamePage() {
  const { lobbyName } = useParams();
  const { username } = useUser();
  const [loading, setLoading] = useState(false);
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

  return loading ? (
    <>loading</>
  ) : (
    <div style={styles.container}>
      <MapComponent>
        <Drawer title={lobbyName!}>
          {users.map((user) => {
            return (
              <PlayerCards playerName={user} playerScore={0}></PlayerCards>
            );
          })}
        </Drawer>
      </MapComponent>
    </div>
  );
}

export default GamePage;

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "row",
    backgroundImage: "url('../../../background.svg')",
  },
};

/*


*/
