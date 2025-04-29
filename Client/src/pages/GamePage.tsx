import { useParams } from "react-router-dom";

function GamePage() {
  const { lobbyName } = useParams();
  return <div style={{ width: "100vw", height: "100vh" }}>{lobbyName}</div>;
}

export default GamePage;

/*
const handleCreateLobby = async () => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/hubs/lobby`)
      .withAutomaticReconnect()
      .build();

    // Set up listeners BEFORE starting connection
    connection.on("LobbyCreated", (lobbyNameFromServer) => {
      console.log("Lobby created successfully:", lobbyNameFromServer);
      navigate("/lobby/" + lobbyNameFromServer);
    });

    connection.on("LobbyError", (message) => {
      alert(message); // e.g., "Lobby name already exists"
    });

    await connection.start();

    // Call the method — don't expect a return, wait for the above messages
    await connection.invoke("CreateLobby", lobbyName, userName);
    await connection.stop();
  } catch (error) {
    console.error("Error creating lobby:", error);
  }
};
*/
