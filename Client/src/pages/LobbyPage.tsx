import DefaultDiv from "../components/DefaultDiv";

function LobbyPage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('../../../public/background.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <DefaultDiv width={400} height={500} text="Create a Game" />
      <div style={{ color: "white", fontSize: "50px" }}>OR</div>
      <DefaultDiv width={400} height={500} text="Join a Game" />
    </div>
  );
}

export default LobbyPage;
