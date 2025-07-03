//Board details
import { Box, Container, Typography } from "@mui/material";
import AppBar from "~/components/AppBar/AppBar";
import Boardbar from "./BoardBar/Boardbar";
import BoardContent from "./BoardContent/BoardContent";
function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <Boardbar />
      <BoardContent />
    </Container>
  );
}

export default Board;
