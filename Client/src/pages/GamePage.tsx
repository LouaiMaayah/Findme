import { useParams } from "react-router-dom";

function GamePage() {
  const { lobbyName } = useParams();
  return <div style={{ width: "100vw", height: "100vh" }}>{lobbyName}</div>;
}

export default GamePage;
