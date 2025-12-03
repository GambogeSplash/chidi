"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface AnalyticsDashboardChartsProps {
  orderTrend: { date: string; amount: number }[]
  topProducts: any[]
  customerSegments: any
  metrics: any
}

export function AnalyticsDashboardCharts({
  orderTrend,
  topProducts,
  customerSegments,
  metrics,
}: AnalyticsDashboardChartsProps) {
  const chartColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend Line Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Revenue Trend (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={orderTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Products Bar Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orderCount" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Customer Segments Pie Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Customer Segments</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "New", value: customerSegments.new },
                { name: "Repeat", value: customerSegments.repeat },
                { name: "Inactive", value: customerSegments.inactive },
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
            >
              {chartColors.map((color) => (
                <Cell key={color} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Key Metrics */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Avg Order Value</p>
            <p className="text-xl font-bold">₦{Math.round(metrics.averageOrderValue).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <p className="text-xl font-bold">{metrics.totalCustomers}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-xl font-bold">{metrics.totalOrders}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
