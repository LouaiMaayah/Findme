import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
interface DrawerProps {
  children?: React.ReactNode;
  title: string;
}

function Drawer({ children, title }: DrawerProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ ...styles.container, left: isOpen ? 0 : "-15vw" }}>
      <div style={styles.arrow} onClick={toggleDrawer}>
        {!isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </div>
      <h2>{title}</h2>
      <div style={styles.children}>{children}</div>
    </div>
  );
}

export default Drawer;

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 10,
    width: "15vw",
    height: "100vh",
    backgroundColor: "white",
    backgroundSize: "cover",
    position: "relative",
    transition: "all 0.5s",
    backgroundImage: "url('../../../background.svg')",
    display: "flex",
    flexDirection: "column",
    color: "white",
    textAlign: "center",
    boxSizing: "border-box",
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
    color: "black",
  },
  children: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
};
