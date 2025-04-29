import { Button, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

type LoginProps = {
  style?: React.CSSProperties;
};

function SignInForm({ style }: LoginProps) {
  const navigate = useNavigate();
  const [name, setName] = React.useState<string>("");
  const { setUsername } = useUser();
  return (
    <div
      style={{
        ...styles.container,
        ...style,
      }}
    >
      <TextField
        label="username"
        variant="outlined"
        style={{ margin: 0 }}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <Button
        variant="contained"
        onClick={() => {
          setUsername(name);
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
    padding: "20px",
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
    gap: "20px",
    justifyContent: "center",
  },
};

export default SignInForm;
