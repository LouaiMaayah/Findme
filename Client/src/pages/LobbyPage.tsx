import { useState } from "react";
import DefaultDiv from "../components/DefaultDiv";
import { Button, TextField } from "@mui/material";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";

function LobbyPage() {
  const [lobbyState, setLobbyState] = useState<"lobby" | "create" | "join">(
    "lobby"
  );
  const [lobbyName, setLobbyName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  if (lobbyState === "lobby") {
    return (
      <div style={styles.container}>
        <DefaultDiv
          width={400}
          height={500}
          text="Create a Game"
          onClick={() => {
            setLobbyState("create");
          }}
        />
        <div style={{ color: "white", fontSize: "50px" }}>OR</div>
        <DefaultDiv
          width={400}
          height={500}
          text="Join a Game"
          onClick={() => {
            setLobbyState("join");
          }}
        />
      </div>
    );
  }

  const handleCreateLobby = async () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_URL}/hubs/lobby`)
        .withAutomaticReconnect()
        .build();

      await connection.start();
      const result = await connection.invoke(
        "CreateLobby",
        lobbyName,
        userName
      );

      if (result) {
        console.log("Lobby created successfully:", result);
        navigate("/lobby/" + lobbyName);
      } else {
        alert("Lobby name already exists, please choose another one.");
      }
    } catch (error) {
      console.error("Error creating lobby:", error);
    }
  };

  if (lobbyState === "create") {
    return (
      <div style={styles.container}>
        <DefaultDiv width={400} height={300} text="Enter your lobby name">
          <div style={styles.createGame}>
            <TextField
              label="User name"
              variant="outlined"
              style={{ margin: 0 }}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <TextField
              label="Lobby name"
              variant="outlined"
              style={{ margin: 0 }}
              onChange={(e) => {
                setLobbyName(e.target.value);
              }}
            />
          </div>
          <Button variant="contained" onClick={() => handleCreateLobby()}>
            Start
          </Button>
        </DefaultDiv>
      </div>
    );
  }

  if (lobbyState === "join") {
    return (
      <div style={styles.container}>
        <DefaultDiv width={400} height={500} text="Join a Game" />
      </div>
    );
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('../../../background.svg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
  },
  createGame: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
};

export default LobbyPage;
