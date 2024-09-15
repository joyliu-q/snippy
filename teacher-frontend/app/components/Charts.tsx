"use client"

import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
    ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"
import { Separator } from "~/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select"

const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "Correctness",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Readability",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

const chartData = [
{ date: "2024-04-01", desktop: 222, mobile: 150 },
{ date: "2024-04-02", desktop: 97, mobile: 180 },
{ date: "2024-04-03", desktop: 167, mobile: 120 },
{ date: "2024-04-04", desktop: 242, mobile: 260 },
{ date: "2024-04-05", desktop: 373, mobile: 290 },
{ date: "2024-04-06", desktop: 301, mobile: 340 },
{ date: "2024-04-07", desktop: 245, mobile: 180 },
{ date: "2024-04-08", desktop: 409, mobile: 320 },
{ date: "2024-04-09", desktop: 59, mobile: 110 },
{ date: "2024-04-10", desktop: 261, mobile: 190 },
{ date: "2024-04-11", desktop: 327, mobile: 350 },
{ date: "2024-04-12", desktop: 292, mobile: 210 },
{ date: "2024-04-13", desktop: 342, mobile: 380 },
{ date: "2024-04-14", desktop: 137, mobile: 220 },
{ date: "2024-04-15", desktop: 120, mobile: 170 },
{ date: "2024-04-16", desktop: 138, mobile: 190 },
{ date: "2024-04-17", desktop: 446, mobile: 360 },
{ date: "2024-04-18", desktop: 364, mobile: 410 },
{ date: "2024-04-19", desktop: 243, mobile: 180 },
{ date: "2024-04-20", desktop: 89, mobile: 150 },
{ date: "2024-04-21", desktop: 137, mobile: 200 },
{ date: "2024-04-22", desktop: 224, mobile: 170 },
{ date: "2024-04-23", desktop: 138, mobile: 230 },
{ date: "2024-04-24", desktop: 387, mobile: 290 },
{ date: "2024-04-25", desktop: 215, mobile: 250 },
{ date: "2024-04-26", desktop: 75, mobile: 130 },
{ date: "2024-04-27", desktop: 383, mobile: 420 },
{ date: "2024-04-28", desktop: 122, mobile: 180 },
{ date: "2024-04-29", desktop: 315, mobile: 240 },
{ date: "2024-04-30", desktop: 454, mobile: 380 },
{ date: "2024-05-01", desktop: 165, mobile: 220 },
{ date: "2024-05-02", desktop: 293, mobile: 310 },
{ date: "2024-05-03", desktop: 247, mobile: 190 },
{ date: "2024-05-04", desktop: 385, mobile: 420 },
{ date: "2024-05-05", desktop: 481, mobile: 390 },
{ date: "2024-05-06", desktop: 498, mobile: 520 },
{ date: "2024-05-07", desktop: 388, mobile: 300 },
{ date: "2024-05-08", desktop: 149, mobile: 210 },
{ date: "2024-05-09", desktop: 227, mobile: 180 },
{ date: "2024-05-10", desktop: 293, mobile: 330 },
{ date: "2024-05-11", desktop: 335, mobile: 270 },
{ date: "2024-05-12", desktop: 197, mobile: 240 },
{ date: "2024-05-13", desktop: 197, mobile: 160 },
{ date: "2024-05-14", desktop: 448, mobile: 490 },
{ date: "2024-05-15", desktop: 473, mobile: 380 },
{ date: "2024-05-16", desktop: 338, mobile: 400 },
{ date: "2024-05-17", desktop: 499, mobile: 420 },
{ date: "2024-05-18", desktop: 315, mobile: 350 },
{ date: "2024-05-19", desktop: 235, mobile: 180 },
{ date: "2024-05-20", desktop: 177, mobile: 230 },
{ date: "2024-05-21", desktop: 82, mobile: 140 },
{ date: "2024-05-22", desktop: 81, mobile: 120 },
{ date: "2024-05-23", desktop: 252, mobile: 290 },
{ date: "2024-05-24", desktop: 294, mobile: 220 },
{ date: "2024-05-25", desktop: 201, mobile: 250 },
{ date: "2024-05-26", desktop: 213, mobile: 170 },
{ date: "2024-05-27", desktop: 420, mobile: 460 },
{ date: "2024-05-28", desktop: 233, mobile: 190 },
{ date: "2024-05-29", desktop: 78, mobile: 130 },
{ date: "2024-05-30", desktop: 340, mobile: 280 },
{ date: "2024-05-31", desktop: 178, mobile: 230 },
{ date: "2024-06-01", desktop: 178, mobile: 200 },
{ date: "2024-06-02", desktop: 470, mobile: 410 },
{ date: "2024-06-03", desktop: 103, mobile: 160 },
{ date: "2024-06-04", desktop: 439, mobile: 380 },
{ date: "2024-06-05", desktop: 88, mobile: 140 },
{ date: "2024-06-06", desktop: 294, mobile: 250 },
{ date: "2024-06-07", desktop: 323, mobile: 370 },
{ date: "2024-06-08", desktop: 385, mobile: 320 },
{ date: "2024-06-09", desktop: 438, mobile: 480 },
{ date: "2024-06-10", desktop: 155, mobile: 200 },
{ date: "2024-06-11", desktop: 92, mobile: 150 },
{ date: "2024-06-12", desktop: 492, mobile: 420 },
{ date: "2024-06-13", desktop: 81, mobile: 130 },
{ date: "2024-06-14", desktop: 426, mobile: 380 },
{ date: "2024-06-15", desktop: 307, mobile: 350 },
{ date: "2024-06-16", desktop: 371, mobile: 310 },
{ date: "2024-06-17", desktop: 475, mobile: 520 },
{ date: "2024-06-18", desktop: 107, mobile: 170 },
{ date: "2024-06-19", desktop: 341, mobile: 290 },
{ date: "2024-06-20", desktop: 408, mobile: 450 },
{ date: "2024-06-21", desktop: 169, mobile: 210 },
{ date: "2024-06-22", desktop: 317, mobile: 270 },
{ date: "2024-06-23", desktop: 480, mobile: 530 },
{ date: "2024-06-24", desktop: 132, mobile: 180 },
{ date: "2024-06-25", desktop: 141, mobile: 190 },
{ date: "2024-06-26", desktop: 434, mobile: 380 },
{ date: "2024-06-27", desktop: 448, mobile: 490 },
{ date: "2024-06-28", desktop: 149, mobile: 200 },
{ date: "2024-06-29", desktop: 103, mobile: 160 },
{ date: "2024-06-30", desktop: 446, mobile: 400 },
]

const envHistories = [
    {
      env_name: "Joy Liu",
      ssh_command: "ssh joy.liu@192.168.1.10",
      entries: [
        {
          env_name: "Joy Liu",
          ssh_command: "ssh joy.liu@192.168.1.10",
          readability_score: 85,
          correctness_score: 90,
          timestamp: 1694025600,
        },
      ],
    },
  ];

function processEnvHistory(envHistory: any) {
    return envHistory.entries.map((entry: any) => ({
        date: new Date(entry.timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        }),
        readability: entry.readability_score,
        correctness: entry.correctness_score,
    }));
}

export function Charts() {
    const [selectedStudent, setSelectedStudent] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const studentData = envHistories.find((history) => history.env_name.toLowerCase() === selectedStudent.toLowerCase());
        if (studentData) {
        setFilteredData(processEnvHistory(studentData));
        }
    }, [selectedStudent]);
    
    return (
    <div className="flex flex-col items-center justify-center">
    <Card className="w-[1090px]">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Student Progress</CardTitle>
          <CardDescription>
            Showing student correctness & readability for the last month
          </CardDescription>
        </div>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a student"
          >
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="joy" className="rounded-lg">
              Joy Liu
            </SelectItem>
            <SelectItem value="shayan" className="rounded-lg">
                Shayan Pardis
            </SelectItem>
            <SelectItem value="ben" className="rounded-lg">
              Benjamin Xu
            </SelectItem>
            <SelectItem value="helena" className="rounded-lg">
              Helena Zhou
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <Card
          className="lg:max-w-md" x-chunk="charts-01-chunk-0"
        >
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Active Coding Time Today</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              2.5{" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                hours
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                steps: {
                  label: "Hours",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    steps: 1.2,
                  },
                  {
                    date: "2024-01-02",
                    steps: 1.5,
                  },
                  {
                    date: "2024-01-03",
                    steps: 3,
                  },
                  {
                    date: "2024-01-04",
                    steps: 2.4,
                  },
                  {
                    date: "2024-01-05",
                    steps: 2.3,
                  },
                  {
                    date: "2024-01-06",
                    steps: 1.8,
                  },
                  {
                    date: "2024-01-07",
                    steps: 2.0,
                  },
                ]}
              >
                <Bar
                  dataKey="steps"
                  fill="var(--color-steps)"
                  radius={5}
                  fillOpacity={0.6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  }}
                />
                <ChartTooltip
                  defaultIndex={2}
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      }}
                    />
                  }
                  cursor={false}
                />
                <ReferenceLine
                  y={1200}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Last week, each student spent 19.5 hours coding{" "}
            </CardDescription>
          </CardFooter>
        </Card>
        <Card
          className="flex flex-col lg:max-w-md" x-chunk="charts-01-chunk-1"
        >
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
            <div>
              <CardDescription>Time on Computer</CardDescription>
              <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                5
                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                  hours
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <ChartContainer
              config={{
                resting: {
                  label: "Resting",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="w-full"
            >
              <LineChart
                accessibilityLayer
                margin={{
                  left: 14,
                  right: 14,
                  top: 10,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    resting: 62,
                  },
                  {
                    date: "2024-01-02",
                    resting: 72,
                  },
                  {
                    date: "2024-01-03",
                    resting: 35,
                  },
                  {
                    date: "2024-01-04",
                    resting: 62,
                  },
                  {
                    date: "2024-01-05",
                    resting: 52,
                  },
                  {
                    date: "2024-01-06",
                    resting: 62,
                  },
                  {
                    date: "2024-01-07",
                    resting: 70,
                  },
                ]}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                />
                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  }}
                />
                <Line
                  dataKey="resting"
                  type="natural"
                  fill="var(--color-resting)"
                  stroke="var(--color-resting)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    fill: "var(--color-resting)",
                    stroke: "var(--color-resting)",
                    r: 4,
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      }}
                    />
                  }
                  cursor={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
        <Card
          className="max-w-xs" x-chunk="charts-01-chunk-2"
        >
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>
              Your students are averaging more lines of code per hour this week than last week.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                128
                <span className="text-sm font-normal text-muted-foreground">
                  lines/hour
                </span>
              </div>
              <ChartContainer
                config={{
                  steps: {
                    label: "Lines",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="aspect-auto h-[32px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  layout="vertical"
                  margin={{
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  data={[
                    {
                      date: "2024",
                      steps: 12435,
                    },
                  ]}
                >
                  <Bar
                    dataKey="steps"
                    fill="var(--color-steps)"
                    radius={4}
                    barSize={32}
                  >
                    <LabelList
                      position="insideLeft"
                      dataKey="date"
                      offset={8}
                      fontSize={12}
                      fill="white"
                    />
                  </Bar>
                  <YAxis dataKey="date" type="category" tickCount={1} hide />
                  <XAxis dataKey="steps" type="number" hide />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                110
                <span className="text-sm font-normal text-muted-foreground">
                  lines/hour
                </span>
              </div>
              <ChartContainer
                config={{
                  steps: {
                    label: "Steps",
                    color: "hsl(var(--muted))",
                  },
                }}
                className="aspect-auto h-[32px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  layout="vertical"
                  margin={{
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  data={[
                    {
                      date: "2023",
                      steps: 10103,
                    },
                  ]}
                >
                  <Bar
                    dataKey="steps"
                    fill="var(--color-steps)"
                    radius={4}
                    barSize={32}
                  >
                    <LabelList
                      position="insideLeft"
                      dataKey="date"
                      offset={8}
                      fontSize={12}
                      fill="hsl(var(--muted-foreground))"
                    />
                  </Bar>
                  <YAxis dataKey="date" type="category" tickCount={1} hide />
                  <XAxis dataKey="steps" type="number" hide />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card
          className="max-w-xs" x-chunk="charts-01-chunk-3"
        >
          <CardHeader className="p-4 pb-0">
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Over the last 7 days, your students completed 14 projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              2
              <span className="text-sm font-normal text-muted-foreground">
                projects/day
              </span>
            </div>
            <ChartContainer
              config={{
                steps: {
                  label: "Steps",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="ml-auto w-[72px]"
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    steps: 2000,
                  },
                  {
                    date: "2024-01-02",
                    steps: 2100,
                  },
                  {
                    date: "2024-01-03",
                    steps: 2200,
                  },
                  {
                    date: "2024-01-04",
                    steps: 1300,
                  },
                  {
                    date: "2024-01-05",
                    steps: 1400,
                  },
                  {
                    date: "2024-01-06",
                    steps: 2500,
                  },
                  {
                    date: "2024-01-07",
                    steps: 1600,
                  },
                ]}
              >
                <Bar
                  dataKey="steps"
                  fill="var(--color-steps)"
                  radius={2}
                  fillOpacity={0.2}
                  activeIndex={6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  hide
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="max-w-xs" x-chunk="charts-01-chunk-4">
  <CardContent className="flex gap-4 p-4 pb-2">
    <ChartContainer
      config={{
        efficiency: {
          label: "Efficiency",
          color: "hsl(var(--chart-1))",
        },
        readability: {
          label: "Readability",
          color: "hsl(var(--chart-2))",
        },
        testing: {
          label: "Testing",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[140px] w-full"
    >
      <BarChart
        margin={{
          left: 20,
          right: 0,
          top: 0,
          bottom: 10,
        }}
        data={[
          {
            metric: "efficiency",
            value: (80 / 100) * 100,
            label: "80%",
            fill: "var(--color-efficiency)",
          },
          {
            metric: "readability",
            value: (90 / 100) * 100,
            label: "90%",
            fill: "var(--color-readability)",
          },
          {
            metric: "testing",
            value: (75 / 100) * 100,
            label: "75%",
            fill: "var(--color-testing)",
          },
        ]}
        layout="vertical"
        barSize={32}
        barGap={2}
      >
        <XAxis type="number" dataKey="value" hide />
        <YAxis
          dataKey="metric"
          type="category"
          tickLine={false}
          tickMargin={4}
          axisLine={false}
          className="capitalize"
        />
        <Bar dataKey="value" radius={5}>
          <LabelList
            position="insideLeft"
            dataKey="label"
            fill="white"
            offset={8}
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  </CardContent>
  <CardFooter className="flex flex-row border-t p-4">
    <div className="flex w-full items-center gap-2">
      <div className="grid flex-1 auto-rows-min gap-0.5">
        <div className="text-xs text-muted-foreground">Efficiency</div>
        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
          80
          <span className="text-sm font-normal text-muted-foreground">%</span>
        </div>
      </div>
      <Separator orientation="vertical" className="mx-2 h-10 w-px" />
      <div className="grid flex-1 auto-rows-min gap-0.5">
        <div className="text-xs text-muted-foreground">Readability</div>
        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
          90
          <span className="text-sm font-normal text-muted-foreground">%</span>
        </div>
      </div>
      <Separator orientation="vertical" className="mx-2 h-10 w-px" />
      <div className="grid flex-1 auto-rows-min gap-0.5">
        <div className="text-xs text-muted-foreground">Testing</div>
        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
          75
          <span className="text-sm font-normal text-muted-foreground">%</span>
        </div>
      </div>
    </div>
  </CardFooter>
</Card>
      </div>
      <div className="grid w-full flex-1 gap-6">
      <Card className="max-w-xs" x-chunk="charts-01-chunk-5">
  <CardContent className="flex gap-4 p-4">
    <div className="grid items-center gap-2">
      <div className="grid flex-1 auto-rows-min gap-0.5">
        <div className="text-sm text-muted-foreground">Efficiency</div>
        <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
          80/100
          <span className="text-sm font-normal text-muted-foreground">%</span>
        </div>
      </div>
      <div className="grid flex-1 auto-rows-min gap-0.5">
        <div className="text-sm text-muted-foreground">Readability</div>
        <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
          90/100
          <span className="text-sm font-normal text-muted-foreground">%</span>
        </div>
      </div>
      <div className="grid flex-1 auto-rows-min gap-0.5">
        <div className="text-sm text-muted-foreground">Testing</div>
        <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
          75/100
          <span className="text-sm font-normal text-muted-foreground">%</span>
        </div>
      </div>
    </div>
    <ChartContainer
      config={{
        efficiency: {
          label: "Efficiency",
          color: "hsl(var(--chart-1))",
        },
        readability: {
          label: "Readability",
          color: "hsl(var(--chart-2))",
        },
        testing: {
          label: "Testing",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="mx-auto aspect-square w-full max-w-[80%]"
    >
      <RadialBarChart
        margin={{
          left: -10,
          right: -10,
          top: -10,
          bottom: -10,
        }}
        data={[
          {
            activity: "testing",
            value: (75 / 100) * 100,
            fill: "var(--color-testing)",
          },
          {
            activity: "readability",
            value: (90 / 100) * 100,
            fill: "var(--color-readability)",
          },
          {
            activity: "efficiency",
            value: (80 / 100) * 100,
            fill: "var(--color-efficiency)",
          },
        ]}
        innerRadius="20%"
        barSize={24}
        startAngle={90}
        endAngle={450}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} dataKey="value" tick={false} />
        <RadialBar dataKey="value" background cornerRadius={5} />
      </RadialBarChart>
    </ChartContainer>
  </CardContent>
</Card>

        <Card
          className="max-w-xs" x-chunk="charts-01-chunk-6"
        >
          <CardHeader className="p-4 pb-0">
            <CardTitle>Targets Reached</CardTitle>
            <CardDescription>
              You're reaching 18 targets per day. Good job!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
            <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
              18
              <span className="text-sm font-normal text-muted-foreground">
                targets/day
              </span>
            </div>
            <ChartContainer
              config={{
                calories: {
                  label: "Calories",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="ml-auto w-[64px]"
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    calories: 354,
                  },
                  {
                    date: "2024-01-02",
                    calories: 514,
                  },
                  {
                    date: "2024-01-03",
                    calories: 345,
                  },
                  {
                    date: "2024-01-04",
                    calories: 734,
                  },
                  {
                    date: "2024-01-05",
                    calories: 645,
                  },
                  {
                    date: "2024-01-06",
                    calories: 456,
                  },
                  {
                    date: "2024-01-07",
                    calories: 345,
                  },
                ]}
              >
                <Bar
                  dataKey="calories"
                  fill="var(--color-calories)"
                  radius={2}
                  fillOpacity={0.2}
                  activeIndex={6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  hide
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card
          className="max-w-xs" x-chunk="charts-01-chunk-7"
        >
          <CardHeader className="space-y-0 pb-0">
            <CardDescription>Time on Break</CardDescription>
            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
              2
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                hr
              </span>
              35
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                min
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={{
                time: {
                  label: "Time",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <AreaChart
                accessibilityLayer
                data={[
                  {
                    date: "2024-01-01",
                    time: 8.5,
                  },
                  {
                    date: "2024-01-02",
                    time: 7.2,
                  },
                  {
                    date: "2024-01-03",
                    time: 8.1,
                  },
                  {
                    date: "2024-01-04",
                    time: 6.2,
                  },
                  {
                    date: "2024-01-05",
                    time: 5.2,
                  },
                  {
                    date: "2024-01-06",
                    time: 8.1,
                  },
                  {
                    date: "2024-01-07",
                    time: 7.0,
                  },
                ]}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="date" hide />
                <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
                <defs>
                  <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-time)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-time)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="time"
                  type="natural"
                  fill="url(#fillTime)"
                  fillOpacity={0.4}
                  stroke="var(--color-time)"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => (
                    <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                      Time in bed
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">
                          hr
                        </span>
                      </div>
                    </div>
                  )}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
