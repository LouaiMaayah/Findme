import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

type LoginProps = {
  style?: React.CSSProperties;
};

function SignInForm({ style }: LoginProps) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        ...styles.container,
        ...style,
      }}
    >
      <Button
        variant="contained"
        onClick={() => {
          navigate("/lobby");
        }}
      >
        Sign in
      </Button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "white",
    width: 400,
    height: 500,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
};

export default SignInForm;
