import DeleteIcon from "../icons/delete";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import type {Column, Id, Task} from "../types"
import {CSS} from '@dnd-kit/utilities'
import { useMemo, useState } from "react";
import PlusIcon from "../icons/plus";
import TaskCard from "./TaskCard";

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (column: Id) => void;
    tasks: Task[];
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

const ColumnContainer = (props: Props) => {
    const {column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask} = props;

    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(() => tasks.map((task) => task.id),[tasks]);


    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return <div ref={setNodeRef} style={style}
        className="bg-[#161C22] opacity-40 border-2
        w-[350px] h-[500px] max-h-[500px] rounded-md
        flex flex-col" />
    }

    return (
        <div ref={setNodeRef} style={style} className="bg-[#161C22] w-[350px]
        h-[500px] max-h-[500px] rounded-md flex flex-col">
            {/* Column Title */}
            <div
            {...attributes}
            {...listeners}
            onClick={() => {setEditMode(true)}}
            className="bg-mainBackgroundColor p-4
            text-md h-[60px] cursor-grab rounded-md
            rounded-b-none border-columnBackgroundColor
            border-2 flex items-center justify-between">
                <div className="flex gap-2">
                    {!editMode  && column.title}
                    {editMode && (
                        <input
                            className="bg-black border rounded outline-none px-2 w-41"
                            autoFocus
                            value={column.title}
                            onChange={(e) => updateColumn(column.id, e.target.value)}
                            onBlur={() => {
                                setEditMode(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                            }}
                        />
                    )}
                </div>
                <button onClick={() => deleteColumn(column.id)}
                className="stroke-gray-400
                hover:stroke-rose-500
                hover:bg-columnBackgroundColor
                px-1 py-2"   
                >
                    <DeleteIcon />
                </button>
            </div>

            {/* Column task container */}
            <div className="flex flex-grow flex-col ga-4 p-2
            overflow-x-hidden overflow-y-auto gap-2">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                    ))}
                </SortableContext>
                
            </div>

            {/* Column Footer */}
            <button className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-2
            border-x-columnBackgroundColor hover:bg-gray-500 hover:text-white
            active: bg-mainBackgroundColor"
            onClick={() => {
                createTask(column.id);
            }}>
                <PlusIcon />
                Add Task
            </button>
        </div>
    )
}

export default ColumnContainer