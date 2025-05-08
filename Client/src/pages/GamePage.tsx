import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import MapComponent from "../components/MapComponent";
import Drawer from "../components/ui/Drawer";
import PlayerCards from "../components/PlayerCards";
import DefaultDiv from "../components/DefaultDiv";
import { Button, IconButton } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Latlng } from "../types";

function GamePage() {
  const { lobbyName } = useParams();
  const { username, isLobbyAdmin } = useUser();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [startGame, setStartGame] = useState(true);
  const navigate = useNavigate();
  const connectionRef = useRef<HubConnection | null>(null);
  const [position, setPosition] = useState<Latlng | null>();
  const [streetViewVisible, setStreetViewVisible] = useState(false);

  console.log(streetViewVisible, position);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/hubs/lobby`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    setLoading(true);
    connection
      .start()
      .then(async () => {
        connection.on("UserListUpdated", (userList: string[]) => {
          setPlayers(userList);
        });

        if (isLobbyAdmin) {
          await connection
            .invoke("CreateLobby", lobbyName, username)
            .then(async () => {
              await connection.invoke("JoinLobby", lobbyName, username);
            });
        } else {
          await connection.invoke("JoinLobby", lobbyName, username);
        }

        connection.on("GameStarted", () => {
          setStartGame(true);
        });

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
      <MapComponent
        onStreetViewPositionChange={(position: Latlng) => {
          setPosition(position);
        }}
        onStreetViewVisibleChange={(visible) => {
          setStreetViewVisible(visible);
        }}
        showPegMan={startGame}
      >
        <IconButton
          style={{ ...styles.leaveButtonStyle }}
          onClick={() => {
            navigate("/lobby");
          }}
        >
          <ExitToAppIcon />
        </IconButton>
        {!startGame && (
          <DefaultDiv width={300} height={200} style={styles.gameStartDiv}>
            {isLobbyAdmin ? (
              <>
                {players.length < 2 && "wait for more players..."}
                <Button
                  variant="contained"
                  onClick={() => {
                    connectionRef.current?.invoke("StartGame", lobbyName);
                  }}
                  disabled={players.length < 2}
                >
                  start game
                </Button>
              </>
            ) : (
              "waiting for admin to start the game..."
            )}
          </DefaultDiv>
        )}
        <Drawer title={lobbyName!}>
          {players.map((user) => {
            return (
              <PlayerCards playerName={user} playerScore={0}></PlayerCards>
            );
          })}
        </Drawer>
      </MapComponent>
      {streetViewVisible && (
        <Button variant="contained" style={styles.hideButton}>
          Hide here
        </Button>
      )}
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
  gameStartDiv: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  leaveButtonStyle: {
    position: "absolute",
    top: 20,
    right: 20,
    opacity: 0.8,
  },
  hideButton: {
    position: "absolute",
    bottom: 100,
    right: "50%",
    transform: "translate(50%, 0)",
    zIndex: 1000,
    borderRadius: "20px",
  },
};
