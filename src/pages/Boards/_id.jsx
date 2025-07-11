//Board details
import { Box, Container, Typography } from "@mui/material";
import AppBar from "~/components/AppBar/AppBar";
import Boardbar from "./BoardBar/Boardbar";
import BoardContent from "./BoardContent/BoardContent";
import { mockData } from "~/apis/mock-data";

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <Boardbar board={mockData?.board} />
      <BoardContent board={mockData?.board} />
    </Container>
  );
}

export default Board;
