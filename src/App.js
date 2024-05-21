import React from "react";
import BooksTable from "./components/BooksTable";
import { Container, Typography } from "@mui/material";

const App = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <BooksTable />
    </Container>
  );
};

export default App;
