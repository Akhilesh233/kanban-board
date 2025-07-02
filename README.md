# Kanban Board

A simple Kanban board application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Drag and drop columns and tasks to organize your workflow visually.

## Features

- Create, update, and delete columns and tasks
- Drag and drop columns and tasks to reorder or move between columns
- Responsive and modern UI with Tailwind CSS
- Powered by [@dnd-kit](https://dndkit.com/) for drag-and-drop interactions

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/kanban-board.git
   cd kanban-board

2. Install dependencies:
    npm install
    # or
    yarn install

3. Running the App
    Start the development Server:
    npm run dev
    # or
    yarn dev

3. Open http://localhost:5000 in your browser

# Project Structure

├── public/
│   └── kanban.jpg
├── src/
│   ├── assets/react.svg
│   ├── components/
|   |      ├── [ColumnContainer.tsx]
|   |      ├── [KanbanBoard.tsx]
|   |      ├── [TaskCard.tsx]
│   ├── icons/
|   |    ├── [delete.tsx]
|   |    ├── [plus.tsx]
│   ├── [App.tsx]
│   ├── [main.tsx]
│   ├── [types.ts]
│   └── ...
├── [index.html]
├── [package.json]
├── [tailwind.config.js]
├── [vite.config.ts]
└── ...

## License

This project is licensed under the MIT License.