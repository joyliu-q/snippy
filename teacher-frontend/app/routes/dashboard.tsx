import Layout from "~/components/Layout";

export default function Dashboard() {
  const students = [
    {
      name: "Alice Smith",
      email: "alice@example.com",
      envKey: "abcd1234",
      feedback: "Alice has been doing great in the Python module.",
    },
    {
      name: "John Doe",
      email: "john@example.com",
      envKey: "efgh5678",
      feedback: "John needs improvement in the JavaScript module.",
    },
    // Add more student data as needed
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Environment Key</th>
              <th className="px-4 py-2">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.envKey} className="border-t dark:border-gray-700">
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2">{student.envKey}</td>
                <td className="px-4 py-2">{student.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
