// features/university/pages/DepartmentSpecialitiesPage.tsx

import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Search,
  Users,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { universityAnalyticsService } from '../services/university.analysis.service';

import {
  DEPARTMENT_SPECIALITIES,
} from '@/constants/university.constants';

type SpecialityItem = {
  speciality: string;
  count: number;
  hasStudents: boolean;
  isConnected: boolean;
};

export default function DepartmentSpecialitiesPage() {
  const { departmentName } = useParams();
  const { user } = useAuth();

  const decodedDepartment = useMemo(
    () => decodeURIComponent(departmentName || ''),
    [departmentName]
  );

  const [specialities, setSpecialities] = useState<SpecialityItem[]>([]);
  const [filteredSpecialities, setFilteredSpecialities] = useState<
    SpecialityItem[]
  >([]);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !decodedDepartment) return;

    const fetchData = async () => {
      try {
        // fetch connected speciality stats from DB
        const connectedSpecialities =
          await universityAnalyticsService.getSpecialitiesByDepartment(
            user.id,
            decodedDepartment
          );

        // convert to quick lookup
        const countsMap: Record<string, number> = {};

        connectedSpecialities.forEach((item) => {
          countsMap[item.speciality] = item.count;
        });

        // get all constant specialities for this department
        const departmentSpecialities =
          DEPARTMENT_SPECIALITIES[decodedDepartment] || [];

        // merge constants + connected data
        const merged: SpecialityItem[] = departmentSpecialities.map(
          (speciality) => ({
            speciality,
            count: countsMap[speciality] || 0,
            hasStudents: (countsMap[speciality] || 0) > 0,
            isConnected: (countsMap[speciality] || 0) > 0,
          })
        );

        // add DB specialities not existing in constants
        connectedSpecialities.forEach((item) => {
          const alreadyExists = merged.some(
            (s) => s.speciality === item.speciality
          );

          if (!alreadyExists) {
            merged.push({
              speciality: item.speciality,
              count: item.count,
              hasStudents: true,
              isConnected: true,
            });
          }
        });

        // sort connected first
        merged.sort((a, b) => {
          if (a.hasStudents && !b.hasStudents) return -1;
          if (!a.hasStudents && b.hasStudents) return 1;
          return a.speciality.localeCompare(b.speciality);
        });

        setSpecialities(merged);
        setFilteredSpecialities(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, decodedDepartment]);

  // search filter
  useEffect(() => {
    const filtered = specialities.filter((item) =>
      item.speciality.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredSpecialities(filtered);
  }, [search, specialities]);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading specialities...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/university/analytics"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold">{decodedDepartment}</h1>

          <p className="text-muted-foreground">
            Browse specialities and connected student counts
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search speciality..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Specialities
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {specialities.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Specialities
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {
                specialities.filter((s) => s.hasStudents)
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {specialities.reduce(
                (sum, s) => sum + s.count,
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specialities List */}
      <Card>
        <CardHeader>
          <CardTitle>Department Specialities</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="divide-y">
            {filteredSpecialities.map((spec) => (
              <Link
                key={spec.speciality}
                to={`/university/analytics/departments/${encodeURIComponent(
                  decodedDepartment
                )}/${encodeURIComponent(spec.speciality)}`}
                className="group flex items-center justify-between rounded px-3 py-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {spec.speciality}
                  </span>

                  {spec.isConnected ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />

                    <span>{spec.count}</span>
                  </div>

                  <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    View statistics →
                  </span>
                </div>
              </Link>
            ))}

            {filteredSpecialities.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No specialities found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}