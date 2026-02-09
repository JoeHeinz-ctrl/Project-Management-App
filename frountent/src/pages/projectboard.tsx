import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Column from "../components/Column";
import { getTasks } from "../services/taskService";
import { useSocket } from "../hooks/useSocket";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "done";
}

export default function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (id) {
      getTasks(id).then((res) => setTasks(res.data));
    }
  }, [id]);

  // Optional: real-time updates via socket
  useEffect(() => {
    if (!socket) return;

    socket.on("task_updated", (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    });

    socket.on("task_created", (newTask: Task) => {
      setTasks((prev) => [...prev, newTask]);
    });

    return () => {
      socket.off("task_updated");
      socket.off("task_created");
    };
  }, [socket]);

  const todo = tasks.filter((t) => t.status === "todo");
  const inprogress = tasks.filter((t) => t.status === "inprogress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ padding: "20px", flex: 1 }}>
          <h2>Project Board {connected ? "🟢" : "⚪"}</h2>

          <div style={styles.board}>
            <Column title="To Do" tasks={todo} />
            <Column title="In Progress" tasks={inprogress} />
            <Column title="Done" tasks={done} />
          </div>
        </main>
      </div>
    </div>
  );
}

const styles: any = {
  board: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
};

