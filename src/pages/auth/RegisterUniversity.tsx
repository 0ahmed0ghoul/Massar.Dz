import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const RegisterUniversity = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl">
                        <img src={MassarLogo} alt="Massar Logo" className="w-8" />
            Massar
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>University Registration</CardTitle>
            <CardDescription>Track student outcomes and improve your rankings</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="universityName">University name</Label>
                <Input id="universityName" placeholder="MIT" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Admin first name</Label>
                  <Input id="firstName" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Admin last name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Institutional email</Label>
                <Input id="email" type="email" placeholder="admin@university.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input placeholder="USA" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input placeholder="Cambridge" />
                </div>
              </div>
              <Button type="submit" className="w-full">Register University</Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterUniversity;
