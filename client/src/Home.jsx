import { Button, Typography, Grid, Paper, Box, Divider } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const Home = () => {
  const containerStyle = {
    color: "white",
    background:
      "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=100&w=1920&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center center/cover",

    padding: "0",
    backgroundSize: "cover",
    minHeight: "100vh",

    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center", // Center content horizontally
  };

  const paperStyle = {
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Use a semi-transparent background
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
  };

  const headingStyle = {
    fontSize: "3rem", // Increase font size
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333", // Use a darker color
  };

  const descriptionStyle = {
    color: "#555", // Use a slightly darker color
    textAlign: "center", // Center-align description text
  };

  return (
    <Container style={containerStyle}>
      <Paper elevation={5} style={paperStyle}>
        <Typography variant="h2" gutterBottom style={headingStyle}>
          Welcome to the Multipurpose Code Editor
        </Typography>
        <Divider style={{ marginBottom: "20px" }} />
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <Link to="/editor" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CodeIcon />}
              >
                Explore Code Editor
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/live-editor" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PlayArrowIcon />}
              >
                Try Live Editor
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>
      <Box mt={4}>
        <Typography variant="body1" style={descriptionStyle}>
          Experience the power of coding like never before with our versatile
          code editor and interactive live coding environment.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
