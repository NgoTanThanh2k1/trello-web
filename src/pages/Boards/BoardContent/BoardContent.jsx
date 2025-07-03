import { Box, Container, Typography } from "@mui/material";
import ListCloumn from "./ListColumns/ListCloumn";

function BoardContent() {
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        width: "100%",
        height: (theme) => theme.trello.boardContentHeight,
        p: "10px 0",
      }}
    >
      <ListCloumn />
    </Box>
  );
}

export default BoardContent;
