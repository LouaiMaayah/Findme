interface PlayerCardsProps {
  playerName: string;
  playerScore: number;
}

function PlayerCards({ playerName, playerScore }: PlayerCardsProps) {
  return (
    <div style={styles.container}>
      <div style={{ color: "black" }}>{playerName}</div>
      <div style={{ color: "black" }}>{playerScore} pts</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "25px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    padding: "20px",
  },
};

export default PlayerCards;
