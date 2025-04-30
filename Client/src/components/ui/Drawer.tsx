import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
function Drawer() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ ...styles.container, left: isOpen ? 0 : "-20vw" }}>
      <div style={styles.arrow} onClick={toggleDrawer}>
        {!isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </div>
    </div>
  );
}

export default Drawer;

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "20vw",
    height: "100vh",
    backgroundColor: "white",
    backgroundSize: "cover",
    position: "relative",
    transition: "all 0.5s",
    backgroundImage: "url('../../../background.svg')",
  },
  arrow: {
    position: "absolute",
    top: "20%",
    right: "-30px", // Half of the width to place it flush outside
    width: "30px",
    height: "60px",
    borderRadius: "0 30px 30px 0", // True half-circle
    backgroundColor: "white",
    cursor: "pointer",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)", // Optional: gives depth
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
  },
};
