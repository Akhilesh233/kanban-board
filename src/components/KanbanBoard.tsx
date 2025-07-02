import { useMemo, useState } from "react"
import PlusIcon from "../icons/plus"
import type { Column, Id, Task} from "../types";
import ColumnContainer from "./ColumnContainer";

import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((col) => col.id),[columns]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 1
        },
    }));

    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    return (
        <div className="m-auto flex min-h-screen w-full
        items-center overflow-x-auto
        overflow-y-hidden px-[5px]">

            {/* Draggable Columns */}
            <DndContext sensors={sensors} onDragStart={ondragstart} onDragEnd={ondragend} onDragOver={ondragover} >
                <div className="m-auto flex gap-6">
                    <div className="flex gap-6">
                        <SortableContext items={columnsId}>
                            {columns.map(col => (
                                <ColumnContainer
                                key={col.id}
                                column={col}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                tasks={tasks.filter((task) => task.columnId === col.id)}
                                deleteTask={deleteTask}
                                updateTask={updateTask} />
                            ))}
                        </SortableContext>
                    </div>
                    <button onClick={() => {createColumn()}}
                    className="h-[60px] w-[350px] min-w-[350px]
                    cursor-pointer rounded-lg bg-mainBackgroundColor
                    border-2 border-columnBackgroundColor p-4 ring-white
                    hover:ring-2 flex gap-2">
                    <PlusIcon />
                        Add Column
                    </button>
                </div>
                { createPortal(<DragOverlay>
                    {activeColumn && (
                        <ColumnContainer column={activeColumn}
                        deleteColumn={deleteColumn}
                        updateColumn={updateColumn}
                        createTask={createTask}
                        tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                        deleteTask={deleteTask}
                        updateTask={updateTask} />
                    )}
                    {activeTask && (
                        <TaskCard task={activeTask}
                        deleteTask={deleteTask}
                        updateTask={updateTask} />
                    )}
                </DragOverlay>, document.body)}
            </DndContext>
        </div>
    );

    function createColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: "Enter Column name"
        };

        setColumns([...columns, columnToAdd]);
    }

    function generateId() {
        return Math.floor(Math.random() * 10000);
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter((col) => col.id !== id);
        setColumns(filteredColumns);

        const newTasks = tasks.filter((task) => task.columnId !== id);
        setTasks(newTasks);
    }

    function ondragstart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function ondragend(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);
        const {active, over} = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
            const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);
            return arrayMove(columns, overColumnIndex, activeColumnIndex)
        })
    }

    function ondragover(event: DragOverEvent) {
        const {active, over} = event;
        if (!over) return;

        const activeTaskId = active.id;
        const overTaskId = over.id;

        if (activeTaskId === overTaskId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        // when dropping the task over another task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeTaskIndex = tasks.findIndex((task) => task.id === activeTaskId);
                const overTaskIndex = tasks.findIndex((task) => task.id === overTaskId);

                tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId

                return arrayMove(tasks, overTaskIndex, activeTaskIndex)
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";
        
        // when dropping the task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeTaskIndex = tasks.findIndex((task) => task.id === activeTaskId);

                tasks[activeTaskIndex].columnId = overTaskId;

                return arrayMove(tasks, activeTaskIndex, activeTaskIndex)
            });
        }

    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map((col) => {
            if (col.id !== id) return col
            return {...col, title};
        });

        setColumns(newColumns);
    }

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Enter your Task`
        }

        setTasks([...tasks, newTask])
    }

    function deleteTask(id: Id) {
        const filteredTasks = tasks.filter((task) => task.id !== id);
        setTasks(filteredTasks);
    }

    function updateTask(id: Id, content: string) {
        const newTask = tasks.map((task) => {
            if (task.id !== id) return task
            return {...task, content};
        });

        setTasks(newTask);
    }
}

export default KanbanBoard