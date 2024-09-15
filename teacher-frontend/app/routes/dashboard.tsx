import Layout from "~/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Charts } from "~/components/Charts";

export default function Dashboard() {
  // Load from database
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
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center pb-10">Student Feedback</h1>
      <div className="max-w-4xl mx-auto overflow-x-auto pb-20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Environment Key</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.envKey}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.envKey}</TableCell>
                <TableCell>{student.feedback}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <h1 className="text-2xl font-bold text-center pb-10">Class Progress</h1>
      <Charts />
    </Layout>
  );
}
