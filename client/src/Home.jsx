import { Button } from "@mui/material";

const Home = () => {
  return (
    <>
      <h1>Hello world</h1>
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
