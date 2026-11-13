"use client";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { number } from "@/lib/model";
const colors = [
  "#c0f65b",
  "#72b8a6",
  "#8b95d6",
  "#d6ad71",
  "#92999b",
  "#d88e9c",
];
const tooltipStyle = {
  background: "#25282a",
  border: "1px solid #45494a",
  borderRadius: 8,
  color: "#f4f6f3",
  fontSize: 12,
};
export type ChartPoint = {
  date: string;
  value: number;
  [key: string]: string | number;
};
export function TrendChart({
  data,
  unit = "kg",
  height = 240,
  label = "最大训练重量",
  emptyText = "添加训练记录后，进步趋势会显示在这里",
}: {
  data: ChartPoint[];
  unit?: string;
  height?: number;
  label?: string;
  emptyText?: string;
}) {
  const [selected, setSelected] = useState("");
  useEffect(() => setSelected(""), [data, label, unit]);
  return (
    <div className="chart-shell">
      <div style={{ height, width: "100%" }} aria-label={`${label}变化曲线`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 15, left: -15, bottom: 0 }}
            onClick={(e) => {
              const p =
                e.activeTooltipIndex != null
                  ? data[Number(e.activeTooltipIndex)]
                  : undefined;
              if (p) setSelected(`${p.date} · ${number(p.value, 1)} ${unit}`);
            }}
          >
            <CartesianGrid
              stroke="#303436"
              strokeDasharray="3 5"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => String(v).slice(5).replace("-", "/")}
              stroke="#44494a"
              tick={{ fill: "#929a9a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={36}
            />
            <YAxis
              stroke="#44494a"
              tick={{ fill: "#929a9a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={data.length ? ["auto", "auto"] : [0, 20]}
              tickCount={5}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: "#b7bfbd" }}
              formatter={(v: any) => [`${number(Number(v), 1)} ${unit}`, label]}
            />
            <Line
              name={label}
              type="monotone"
              dataKey="value"
              stroke="#c0f65b"
              strokeWidth={2.5}
              dot={{
                fill: "#c0f65b",
                r: data.length < 3 ? 5 : 3,
                stroke: "#1b1e1f",
                strokeWidth: 2,
              }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {!data.length && (
        <div className="chart-empty">
          <TrendingUp size={28} />
          <strong>下一条曲线，属于你的突破</strong>
          <span>{emptyText}</span>
        </div>
      )}
      {selected && (
        <div className="chart-selection" role="status">
          {selected}
        </div>
      )}
    </div>
  );
}
export function VolumeChart({
  data,
}: {
  data: { date: string; value: number }[];
}) {
  return (
    <div className="chart-shell">
      <div style={{ height: 185 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, left: -12, right: 8 }}>
            <CartesianGrid
              stroke="#303436"
              strokeDasharray="3 5"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#929a9a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              tick={{ fill: "#929a9a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "#ffffff05" }}
              formatter={(v: any) => [`${number(Number(v))} kg`, "总训练量"]}
            />
            <Bar
              dataKey="value"
              fill="#b6e957"
              radius={[4, 4, 0, 0]}
              maxBarSize={35}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {!data.some((x) => x.value > 0) && (
        <div className="chart-empty small">
          <span>你的每一组训练，都将汇成进步</span>
        </div>
      )}
    </div>
  );
}
export function MuscleChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const total = data.reduce((n, d) => n + d.value, 0);
  return (
    <div className="muscle-layout">
      <div className="donut">
        <div style={{ height: 150, width: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={total ? data : [{ name: "暂无容量", value: 1 }]}
                dataKey="value"
                innerRadius={54}
                outerRadius={69}
                paddingAngle={total ? 4 : 0}
                stroke="none"
                isAnimationActive={false}
              >
                {(total ? data : [{ name: "暂无容量", value: 1 }]).map(
                  (d, i) => (
                    <Cell
                      key={d.name}
                      fill={total ? colors[i % colors.length] : "#303537"}
                    />
                  ),
                )}
              </Pie>
              {!!total && (
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: any) => `${number(Number(v))} kg`}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="donut-center">
          <strong>{total ? data.length : "0"}</strong>
          <span>训练肌群</span>
        </div>
      </div>
      <div className="muscle-legend">
        {data.length ? (
          data.map((d, i) => (
            <div key={d.name}>
              <span>
                <i style={{ background: colors[i % colors.length] }} />
                {d.name}
              </span>
              <strong>
                {Math.round((d.value / total) * 100)}
                <small>%</small>
              </strong>
            </div>
          ))
        ) : (
          <p>
            训练后查看
            <br />
            各肌群容量分配
          </p>
        )}
      </div>
    </div>
  );
}
