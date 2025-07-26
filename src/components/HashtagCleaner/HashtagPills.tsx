"use client";

import { X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TagState = "ok" | "duplicate" | "overflow";

export interface PillTag {
  value: string;
  state: TagState;
  count?: number; // duplicate count
}

export default function HashtagPills({
  tags,
  onRemove,
  onReorder,
}: {
  tags: PillTag[];
  onRemove: (tag: string) => void;
  onReorder: (newTags: PillTag[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tags.findIndex((t) => t.value === active.id);
    const newIndex = tags.findIndex((t) => t.value === over.id);
    onReorder(arrayMove(tags, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* rectSortingStrategy works well for items that can wrap */}
      <SortableContext
        items={tags.map((t) => t.value)}
        strategy={rectSortingStrategy}
      >
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <SortablePill key={t.value} tag={t} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortablePill({
  tag,
  onRemove,
}: {
  tag: PillTag;
  onRemove: (tag: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tag.value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-default select-none",
        tag.state === "duplicate" &&
          "bg-red-100 text-red-700 border border-red-300",
        tag.state === "overflow" &&
          "bg-gray-200 text-gray-600 border border-gray-300 line-through",
        tag.state === "ok" &&
          "bg-green-100 text-green-700 border border-green-200"
      )}
      title={
        tag.state === "overflow"
          ? "Above 30 limit – will not be copied"
          : undefined
      }
    >
      {/* Drag handle */}
      <span
        className="mr-2 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </span>
      {tag.value} {tag.state === "duplicate" && tag.count && `(${tag.count}x)`}
      <button
        className="ml-2 hover:opacity-70"
        onClick={() => onRemove(tag.value)}
        aria-label={`Remove ${tag.value}`}
      >
        <X size={14} />
      </button>
    </span>
  );
}
