import { Box, Container, Typography } from "@mui/material";
import ListCloumn from "./ListColumns/ListCloumn";
import { mapOrder } from "~/utils/sorts"; // nếu hàm thật sự tên là mapOrder
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter,
} from "@dnd-kit/core";
import { useEffect } from "react";
import React, { useState, useCallback, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatters";
const ACTIVE_DRAG_ITEM_TYPE = {
  CARD: " ACTIVE_DRAG_ITEM_TYPE_CARD",
  COLUMN: " ACTIVE_DRAG_ITEM_TYPE_COLUMN",
};
function BoardContent({ board }) {
  const [orderedColumns, setOrderedColumns] = useState([]);
  //cùng 1 thời điểm chỉ có 1 một phần tử được kéo column hoặc là card
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);
  //Điểm va chạm cuối cùng
  const lastOverId = useRef(null);
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
  // tìm 1 cái column theo cardid
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    );
  };

  const handleDragStart = (event) => {
    // console.log("handleDragStart: ", event);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  // console.log("activeDragItemData: ", activeDragItemData);
  // console.log("activeDragItemId: ", activeDragItemId);
  // console.log("activeDragItemType: ", activeDragItemType);
  //trigger trong quá trình kéo 1 phần tử
  const handleDragOver = (event) => {
    // ko làm gì thêm khi kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return;
    }
    // console.log("handleDragOver: ", event);
    //còn nếu kéo card thì xử lý thêm để có thể kéo card qua các column
    const { over, active } = event;
    //nếu ko tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!active || !over) return;
    //cái card đang được tương tác trên hoặc dưới so với thằng đang được kéo
    const { id: overCardId } = over;
    //cái card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    //nếu ko tồn tại 1 trong 2 column thì ko làm gì hết
    if (!activeColumn || !overColumn) {
      return;
    }

    //xử lí nếu 2 column khác nhau code mới chạy
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        // tìm vị trí cái card sắp được thả
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        );
        let newCardIndex;
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.cards?.length + 1;
        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activeColumn._id
        );
        const nextOverColumn = nextColumns.find(
          (column) => column._id === overColumn._id
        );
        if (nextActiveColumn) {
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );

          if (isEmpty(nextActiveColumn.cards)) {
            nextActiveColumn.cards = [
              generatePlaceholderCard(nextActiveColumn),
            ];
          }

          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id
          );
        }
        if (nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          );

          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => !card.FE_PlaceholderCard
          );
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          );
        }
        return nextColumns;
      });
    }
  };
  const handleDragEnd = (event) => {
    const { over, active } = event;
    //nếu ko tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!active || !over) return;
    // console.log("handleDragEnd: ", event);
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log("hành động kéo thả: ");
      //cái card đang được tương tác trên hoặc dưới so với thằng đang được kéo
      const { id: overCardId } = over;
      //cái card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      //nếu ko tồn tại 1 trong 2 column thì ko làm gì hết
      if (!activeColumn || !overColumn) {
        return;
      }
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        setOrderedColumns((prevColumns) => {
          // tìm vị trí cái card sắp được thả
          const overCardIndex = overColumn?.cards?.findIndex(
            (card) => card._id === overCardId
          );
          let newCardIndex;
          const isBelowOverItem =
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newCardIndex =
            overCardIndex >= 0
              ? overCardIndex + modifier
              : overColumn?.cards?.length + 1;
          const nextColumns = cloneDeep(prevColumns);
          const nextActiveColumn = nextColumns.find(
            (column) => column._id === activeColumn._id
          );
          const nextOverColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
          if (nextActiveColumn) {
            nextActiveColumn.cards = nextActiveColumn.cards.filter(
              (card) => card._id !== activeDraggingCardId
            );
            nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
              (card) => card._id
            );
          }
          if (nextOverColumn) {
            nextOverColumn.cards = nextOverColumn.cards.filter(
              (card) => card._id !== activeDraggingCardId
            );
            nextOverColumn.cards = nextOverColumn.cards.toSpliced(
              newCardIndex,
              0,
              activeDraggingCardData
            );
            nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
              (card) => card._id
            );
          }
          return nextColumns;
        });
      } else {
        //lấy vị trí cũ (từ thằng active)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        );
        //lấy vị trí mới (từ thằng over)
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        );
        const dndorderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);
          const tagetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
          tagetColumn.cards = dndorderedCards;
          tagetColumn.cardOrderIds = dndorderedCards.map((card) => card._id);
          return nextColumns;
        });
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        //lấy vị trí cũ (từ thằng active)
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        );
        //lấy vị trí mới (từ thằng over)
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        );
        // dùng arraymive để sắp xếp mảng Columns ban đầu
        const dndorderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );
        //2 cái consolog này để sau dùng api
        // const dndorderedColumnsIds = dndorderedColumns.map((c) => c._id);
        // console.log("mảng trước khi xếp", dndorderedColumns);
        // console.log("mảng sau khi xếp", dndorderedColumnsIds);

        setOrderedColumns(dndorderedColumns);
      }
    }

    setActiveDragItemData(null);
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setOldColumnWhenDraggingCard(null);
  };
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      const pointerIntersections = pointerWithin(args);
      if (!pointerIntersections?.length) return;

      // const intersections =
      //   pointerIntersections?.length > 0
      //     ? pointerIntersections
      //     : rectIntersection(args);
      let overId = getFirstCollision(pointerIntersections, "id");
      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id);
              }
            ),
          })[0]?.id;
        }
        lastOverId.current = overId;

        return [{ id: overId }];
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType]
  );
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
    >
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
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
