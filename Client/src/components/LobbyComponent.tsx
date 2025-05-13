import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const LobbyComponent = () => {
  const [lobbyId, setLobbyId] = useState(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/lobbyHub")
      .build();

    setConnection(newConnection);

    newConnection.start().catch((err) => console.error(err));

    newConnection.on("LobbyCreated", (id) => {
      setLobbyId(id);
    });

    return () => {
      newConnection.stop();
    };
  }, []);

  const createLobby = async () => {
    if (connection) {
      await connection.invoke("CreateLobby");
    } else {
      console.error("Connection is not established.");
    }
  };

  const joinLobby = async () => {
    const lobbyId = prompt("Enter lobby ID:");
    if (lobbyId) {
      if (connection) {
        await connection.invoke("JoinLobby", lobbyId);
      } else {
        console.error("Connection is not established.");
      }
    }
  };

  return (
    <div>
      <button onClick={createLobby}>Create Game</button>
      <button onClick={joinLobby}>Join Game</button>
      {lobbyId && <p>Your lobby ID is: {lobbyId}</p>}
    </div>
  );
};

export default LobbyComponent;
