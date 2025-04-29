import { useState } from "react";
import DefaultDiv from "../components/DefaultDiv";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Lobby } from "../types";

function LobbyPage() {
  const [lobbyState, setLobbyState] = useState<"lobby" | "create" | "join">(
    "lobby"
  );
  const [lobbyName, setLobbyName] = useState<string>("");
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lobbies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await res.json()) as Lobby[];
    const lobbyExists = data.some((lobby) => lobby.name === lobbyName);
    if (lobbyExists) {
      alert("Lobby name already exists. Please choose a different name.");
      return;
    }

    navigate("/lobby/" + lobbyName);
  };

  if (lobbyState === "create") {
    return (
      <div style={styles.container}>
        <DefaultDiv width={400} height={300} text="Enter your lobby name">
          <div style={styles.createGame}>
            <TextField
              label="Lobby name"
              variant="outlined"
              style={{ margin: 0 }}
              onChange={(e) => {
                setLobbyName(e.target.value);
              }}
            />
          </div>
          <Button variant="contained" onClick={handleCreateLobby}>
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
