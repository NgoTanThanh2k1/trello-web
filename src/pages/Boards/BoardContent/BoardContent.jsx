import { Box, Container, Typography } from "@mui/material";
import ListCloumn from "./ListColumns/ListCloumn";
import { mapOrder } from "~/utils/sorts"; // nếu hàm thật sự tên là mapOrder
function BoardContent({ board }) {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, "_id");
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
      <ListCloumn columns={orderedColumns} />
    </Box>
  );
}

export default BoardContent;
