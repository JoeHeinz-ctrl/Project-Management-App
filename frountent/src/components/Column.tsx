
import TaskCard from "./TaskCard";

interface ColumnProps {
  title: string;
  tasks: any[];
}

export default function Column({ title, tasks }: ColumnProps) {
  return (
    <div style={styles.column}>
      <h3>{title}</h3>

      <div>
        {tasks.length === 0 && <p style={{ color: "#888" }}>No tasks</p>}

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  column: {
    background: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    width: "250px",
    minHeight: "300px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
};
