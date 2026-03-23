"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { IPCDataPoint } from "@/lib/types";
import { MESES } from "@/lib/types";

interface IPCLineChartProps {
  data: IPCDataPoint[];
}

function formatTooltipLabel(periodo: unknown) {
  if (typeof periodo !== "string") return "";
  const year = periodo.slice(0, 4);
  const month = parseInt(periodo.slice(4, 6), 10);
  return `${MESES[month - 1]} ${year}`;
}

export function IPCLineChart({ data }: IPCLineChartProps) {
  const chartData = data.map((d) => ({
    periodo: d.periodo,
    label: `${d.year}`,
    indice: d.indice,
    variacion: d.variacionInteranual,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="ipcGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(0, 0%, 98%)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="hsl(0, 0%, 98%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(0, 0%, 14.9%)"
          vertical={false}
        />
        <XAxis
          dataKey="periodo"
          tickFormatter={(v: string) => v.slice(0, 4)}
          stroke="hsl(0, 0%, 40%)"
          tick={{ fontSize: 12 }}
          interval={11}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke="hsl(0, 0%, 40%)"
          tick={{ fontSize: 12 }}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
          }
          axisLine={false}
          tickLine={false}
          width={45}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(0, 0%, 5.9%)",
            border: "1px solid hsl(0, 0%, 14.9%)",
            borderRadius: "8px",
            color: "hsl(0, 0%, 98%)",
            fontSize: 13,
          }}
          labelFormatter={formatTooltipLabel}
          formatter={(value) => [
            `${Number(value).toLocaleString("es-AR")}`,
            "Índice IPC",
          ]}
        />
        <Area
          type="monotone"
          dataKey="indice"
          stroke="hsl(0, 0%, 98%)"
          strokeWidth={2}
          fill="url(#ipcGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "hsl(0, 0%, 98%)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
