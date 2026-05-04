import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface DonutChartProps {
  invested: number;
  returns: number;
  investedLabel?: string;
  returnsLabel?: string;
}

const DonutChart = ({ invested, returns, investedLabel = "Amount Invested", returnsLabel = "Est. Returns" }: DonutChartProps) => {
  const data = [
    { name: investedLabel, value: invested },
    { name: returnsLabel, value: returns },
  ];

  const COLORS = ["hsl(38, 100%, 50%)", "hsl(38, 100%, 80%)"];

  return (
    <div className="w-full h-[250px] md:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="top"
            align="right"
            layout="horizontal"
            wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
