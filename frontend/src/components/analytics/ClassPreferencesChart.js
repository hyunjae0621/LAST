
// frontend/src/components/analytics/ClassPreferencesChart.js
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function ClassPreferencesChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">수업 선호도</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="dance_class__name" 
            />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="student_count" 
              name="수강생 수" 
              fill="#4F46E5" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}