import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <p>Hello React</p>
      <Link to="/editor">
        {" "}
        <Button variant="contained"> editor</Button>{" "}
      </Link>
    </>
  );
}
