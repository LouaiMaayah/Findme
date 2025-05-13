interface PlayerCardsProps {
  playerName: string;
  playerScore: number;
  hiding?: boolean;
}

function PlayerCards({ playerName, playerScore, hiding }: PlayerCardsProps) {
  return (
    <div style={styles.mainContainer}>
      <div style={styles.container}>
        <div style={{ color: "black" }}>{playerName}</div>
        <div style={{ color: "black" }}>{playerScore} pts</div>
      </div>
      {hiding && "Hiding..."}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "black",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    opacity: 1,
    color: "black",
  },
};

export default PlayerCards;
