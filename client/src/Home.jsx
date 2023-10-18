import { Button } from "@mui/material";

const Home = () => {
  return (
    <>
      <h1>Welcome to Multipurpose Code Editor</h1>
      <a href="/editor">
        <Button variant="contained"> visit editor</Button>
      </a>
      <a href="/live-editor">
        <Button variant="contained"> live editor</Button>
      </a>
    </>
  );
};
export default Home;
