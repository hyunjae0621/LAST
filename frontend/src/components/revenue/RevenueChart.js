// frontend/src/components/revenue/RevenueChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 매출</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => 
                new Intl.NumberFormat('ko-KR', { 
                  style: 'currency', 
                  currency: 'KRW' 
                }).format(value)
              }
            />
            <Legend />
            <Bar 
              dataKey="revenue" 
              name="매출" 
              fill="#4F46E5" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
