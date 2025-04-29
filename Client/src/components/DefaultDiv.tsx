interface DefaulrDivProps {
  width: number;
  height: number;
  text?: string;
  onClick?: () => void;
  child?: React.ReactNode;
}

function DefaultDiv({ width, height, text, onClick, child }: DefaulrDivProps) {
  return (
    <div
      style={{ width: width, height: height, ...styles.container }}
      onClick={onClick}
    >
      {text}
      {child}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    borderRadius: "20px",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.25)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    fontSize: "24px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
  },
};

export default DefaultDiv;
