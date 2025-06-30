import { Box, Container, Typography } from "@mui/material";

function Boardbar() {
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
      }}
    >
      Board Bar
    </Box>
  );
}

export default Boardbar;
