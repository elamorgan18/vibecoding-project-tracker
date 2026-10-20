import { STAGES } from '../data/model.js';
import Column from './Column.jsx';

/** The four-column Kanban board for one project. */
export default function Board({ tasks, members }) {
  const membersById = Object.fromEntries(members.map((m) => [m.id, m]));

  return (
    <main className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STAGES.map((stage) => (
        <Column
          key={stage.id}
          stage={stage}
          tasks={tasks.filter((task) => task.status === stage.id)}
          membersById={membersById}
        />
      ))}
    </main>
  );
}
