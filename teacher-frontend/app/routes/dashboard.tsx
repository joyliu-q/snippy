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
import { useEffect, useState } from "react";

export default function Dashboard() {
  // const [students, setStudents] = useState([] as any[])
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const students = [
    {
      id: 1,
      name: "Joy Liu",
      email: "joy.liu@example.com",
      ssh_command: "ssh joy@project1.example.com",
      feedback: "Great job on code organization. Work on improving test coverage.",
      correctness_score: 80,
      readability_score: 90,
    },
    {
      id: 2,
      name: "Shayan Pardis",
      email: "shayan.pardis@example.com",
      ssh_command: "ssh shayan@project2.example.com",
      feedback: "Excellent test coverage. Focus on improving code readability.",
      correctness_score: 85,
      readability_score: 78,
    },
    {
      id: 3,
      name: "Benjamin Xu",
      email: "benjamin.xu@example.com",
      ssh_command: "ssh benjamin@project3.example.com",
      feedback: "Very efficient code. Need to improve unit testing.",
      correctness_score: 92,
      readability_score: 85,
    },
    {
      id: 4,
      name: "Helena Zhou",
      email: "helena.zhou@example.com",
      ssh_command: "ssh helena@project4.example.com",
      feedback: "Exceptionally readable code. Work on optimizing efficiency.",
      correctness_score: 78,
      readability_score: 95,
    },
  ];

  // const handleGetEnvs = async () => {
  //   setLoading(true);
  //   try {
  //     const envs = await fetch("http://localhost:8000/students");

  //     if (!envs.ok) {
  //       throw new Error(`Failed to get environments: ${envs.statusText}`);
  //     }

  //     const data = await envs.json();
  //     if (data.students) {
  //       setStudents(data.students);
  //     }
  //   } catch (error: any) {
  //     setError(`Error: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   handleGetEnvs()
  // }, [])

  return (
    <Layout>
      {loading ? 
      <div className="flex items-center justify-center mt-4">
      <img
        src="https://media.discordapp.net/attachments/1284707830661648424/1284717063658537040/Scripty.png?ex=66e7a580&is=66e65400&hm=369df4cd36880403b2efd4ad0f2cd50ca60c0016a760170a8a3e7666797e8188&=&format=webp&quality=lossless&width=1020&height=980"
        alt="Loading..."
        className="w-16 h-16 animate-spin"
      />
    </div> : (
        <>
      <h1 className="text-2xl font-bold text-center pb-10">Student Feedback</h1>
      <div className="max-w-4xl mx-auto overflow-x-auto pb-20 max-w-6xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead className="w-[400px]">Feedback</TableHead>
              <TableHead>Correctness</TableHead>
              <TableHead>Readability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.envKey}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.ssh_command}</TableCell>
                <TableCell>{student.feedback}</TableCell>
                <TableCell>{student.correctness_score}</TableCell>
                <TableCell>{student.readability_score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <h1 className="text-2xl font-bold text-center pb-20">Class Progress</h1>
      <Charts />
      </>
      )}
    </Layout>
  );
}
