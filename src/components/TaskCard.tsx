import { useState } from "react";
import type { Id, Task } from "../types"
import DeleteIcon from "../icons/delete";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteTask: (id: Id) =>  void;
    updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return <div ref={setNodeRef} style={style}
        className="bg-mainBackgroundColor p-2.5 h-[100px]
        min-h-[100px] items-center flex text-left rounded-xl
        border-2 border-white opacity-30
        cursor-grab relative" />
    }

    if (editMode) {
        return (
            <div
            className="bg-mainBackgroundColor p-2.5 h-[100px]
            min-h-[100px] items-center flex text-left rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-white
            cursor-grab relative"
            >
                <textarea
                className="h-[90%] w-full resize-none border-none
                rounded bg-transparent text-white focus:outline-none"
                value={task.content} autoFocus placeholder="Task content here" onBlur={() => setEditMode(false)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey) setEditMode(false);
                }}
                onChange={(e) => updateTask(task.id, e.target.value) } >
                </textarea>
            </div>
        );
    }

    return (
        <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => {setEditMode(true)}}
        className="bg-mainBackgroundColor p-2.5 h-[100px]
        min-h-[100px] items-center flex text-left rounded-xl
        hover:ring-2 hover:ring-inset hover:ring-white
        cursor-grab relative task"
        onMouseEnter={() => {
            setMouseIsOver(true);
        }}
        onMouseLeave={() => {
            setMouseIsOver(false);
        }}
        >
            <p className="my-auto h-[90%] w-full overflow-y-auto
            overflow-x-hidden whitespace-pre-wrap">
                {task.content}
            </p>
            {mouseIsOver && (<button onClick={() => {
                deleteTask(task.id)
            }}
            className="stroke-white absolute right-4 top-1/2-translate-y-1/2
            bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100
            hover:stroke-red-500">
                <DeleteIcon />
            </button>)}
        </div>
    )
}

export default TaskCard