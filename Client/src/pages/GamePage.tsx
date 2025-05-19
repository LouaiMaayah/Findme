import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import MapComponent, { MapComponentRef } from "../components/MapComponent";
import Drawer from "../components/ui/Drawer";
import PlayerCards from "../components/PlayerCards";
import DefaultDiv from "../components/DefaultDiv";
import { Button, IconButton } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Latlng, MarkerData, PlayerFromServer } from "../types";

function GamePage() {
  const { lobbyName } = useParams();
  const { username, isLobbyAdmin } = useUser();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<PlayerFromServer[]>([]);
  const navigate = useNavigate();
  const connectionRef = useRef<HubConnection | null>(null);
  const [streetViewVisible, setStreetViewVisible] = useState(false);
  const mapRef = useRef<MapComponentRef>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isInStreetView, setIsInStreetView] = useState(false);
  const [gameState, setGameState] = useState<
    "WaitingForAdminToStart" | "PlayersAreHiding" | "Started"
  >("WaitingForAdminToStart");

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
        connection.on("UserListUpdated", (userList: PlayerFromServer[]) => {
          setPlayers(userList);
        });

        if (isLobbyAdmin) {
          await connection.invoke("CreateLobby", lobbyName, username);
          await connection.invoke("JoinLobby", lobbyName, username);
        } else {
          await connection.invoke("JoinLobby", lobbyName, username);
        }

        connection.on(
          "PlayerHidden",
          (playerName: string, hidingPlace: Latlng) => {
            setPlayers((prevPlayers) =>
              prevPlayers.map((player) => {
                if (player.username === playerName) {
                  return { ...player, hidingPlace };
                }
                return player;
              })
            );
          }
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error("SignalR Connection Error:", error);
      });

    return () => {
      connection.off("UserListUpdated");
      connection.off("GameStarted");
      connection.off("PlayerHidden");
      connection.invoke("LeaveLobby", lobbyName, username).catch(console.error);
      connection.stop().catch(console.error);
    };
  }, []);

  const handleHidePlayer = () => {
    const hidingPosition = mapRef.current?.getStreetViewPosition();
    if (!hidingPosition) return;
    setIsInStreetView(false);
    connectionRef.current
      ?.invoke("HidePlayer", lobbyName, username, hidingPosition)
      .catch((err) => {
        console.error(err);
      });
    setMarkers((prev) => {
      return [
        ...prev,
        {
          position: hidingPosition,
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        },
      ];
    });
  };

  return loading ? (
    <>loading</>
  ) : (
    <div style={styles.container}>
      <MapComponent
        ref={mapRef}
        isInStreetView={isInStreetView}
        onStreetViewVisibleChange={(visible) => {
          setStreetViewVisible(visible);
        }}
        showPegMan={true}
        markers={markers}
      >
        <IconButton
          style={{ ...styles.leaveButtonStyle }}
          onClick={() => {
            navigate("/lobby");
          }}
        >
          <ExitToAppIcon />
        </IconButton>
        {
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
        }
        {
          <Drawer title={lobbyName!}>
            {players.map((player) => {
              return (
                <PlayerCards
                  hiding={player.hidingPlace === null}
                  key={player.connectionId}
                  playerName={player.username}
                  playerScore={0}
                />
              );
            })}
          </Drawer>
        }
      </MapComponent>
      {streetViewVisible && (
        <Button
          variant="contained"
          style={styles.hideButton}
          onClick={handleHidePlayer}
        >
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
