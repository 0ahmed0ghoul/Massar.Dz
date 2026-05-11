// features/university/pages/UniversityAnalyticsPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, Building2, Search, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { universityAnalyticsService } from '../services/university.analysis.service';

type ConnectionFilter = 'all' | 'connected' | 'not_connected';

export default function UniversityAnalyticsPage() {
  const { user } = useAuth();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalGraduates, setTotalGraduates] = useState(0);
  const [allDepartments, setAllDepartments] = useState<{ department: string; count: number; hasConnection: boolean }[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<typeof allDepartments>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const [students, graduates, depts] = await Promise.all([
          universityAnalyticsService.getTotalConnectedStudents(user.id),
          universityAnalyticsService.getTotalGraduates(user.id),
          universityAnalyticsService.getAllDepartmentsWithStats(user.id),
        ]);
        setTotalStudents(students);
        setTotalGraduates(graduates);
        setAllDepartments(depts);
        setFilteredDepartments(depts);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [user]);

  // Apply filters whenever searchTerm or connectionFilter changes
  useEffect(() => {
    let filtered = [...allDepartments];
    if (searchTerm.trim()) {
      filtered = filtered.filter(d => d.department.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (connectionFilter === 'connected') {
      filtered = filtered.filter(d => d.hasConnection);
    } else if (connectionFilter === 'not_connected') {
      filtered = filtered.filter(d => !d.hasConnection);
    }
    setFilteredDepartments(filtered);
  }, [searchTerm, connectionFilter, allDepartments]);

  if (loading) return <div className="p-8 text-center">Loading statistics...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">University Analytics</h1>
        <p className="text-muted-foreground">Overview of student data and graduate outcomes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graduates</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGraduates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allDepartments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={connectionFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setConnectionFilter('all')}
          >
            All
          </Button>
          <Button
            variant={connectionFilter === 'connected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setConnectionFilter('connected')}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Connected
          </Button>
          <Button
            variant={connectionFilter === 'not_connected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setConnectionFilter('not_connected')}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Not Connected
          </Button>
        </div>
      </div>

      {/* Departments List */}
      <Card>
        <CardHeader>
          <CardTitle>Departments & Student Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {filteredDepartments.map((dept) => (
              <Link
                key={dept.department}
                to={`/university/analytics/departments/${encodeURIComponent(dept.department)}`}
                className="flex items-center justify-between py-3 hover:bg-muted/50 px-2 rounded transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{dept.department}</span>
                  {dept.hasConnection && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">{dept.count} students</span>
                  <span className="text-xs text-muted-foreground group-hover:underline">
                    View details →
                  </span>
                </div>
              </Link>
            ))}
            {filteredDepartments.length === 0 && (
              <div className="py-6 text-center text-muted-foreground">
                No departments match the current filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}