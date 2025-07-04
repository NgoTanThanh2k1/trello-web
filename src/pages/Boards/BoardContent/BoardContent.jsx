import { Box, Container, Typography } from "@mui/material";
import ListCloumn from "./ListColumns/ListCloumn";
import { mapOrder } from "~/utils/sorts"; // nếu hàm thật sự tên là mapOrder
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { useEffect } from "react";
import React, { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

function BoardContent({ board }) {
  const [orderedColumns, setOrderedColumns] = useState([]);
  //fix trường hợp click chuột bị gọi event, yêu cầu di chuyển chuột 10px mới gọi event
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  //nhấn giữ 250ms va dung sai cảu cảm ứng là di chuyển 5px mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);
  const handleDragEnd = (event) => {
    // console.log("handleDragEnd: ", event);
    const { over, active } = event;
    //nếu ko tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return;
    if (active.id !== over.id) {
      //lấy vị trí cũ (từ thằng active)
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      //lấy vị trí mới (từ thằng over)
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      // dùng arraymive để sắp xếp mảng Columns ban đầu
      const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      //2 cái consolog này để sau dùng api
      // const dndorderedColumnsIds = dndorderedColumns.map((c) => c._id);
      // console.log("mảng trước khi xếp", dndorderedColumns);
      // console.log("mảng sau khi xếp", dndorderedColumnsIds);

      setOrderedColumns(dndorderedColumns);
    }
  };
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
    </DndContext>
  );
}

export default BoardContent;
