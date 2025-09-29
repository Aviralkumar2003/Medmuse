import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfileDetails = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<
    "account" | "demographics"
  >("account");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const countryNames: string[] = data
          .map((country: { name: { common: string } }) => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const [form, setForm] = useState({
    age: "",
    weight: "",
    heightUnit: "cm", // "cm" | "ft-in"
    heightCm: "",
    heightFt: "",
    heightIn: "",
    gender: "",
    nationality: "",
  });

  return (
    <>
      <div className="container max-w-5xl mx-auto py-6 px-4 lg:py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 lg:border-r lg:border-border lg:pr-6">
          <nav className="flex lg:flex-col gap-2">
            <Button
              variant={activeSection === "account" ? "default" : "ghost"}
              className={`w-full justify-start rounded-lg transition-colors ${
                activeSection === "account"
                  ? "bg-primary text-white"
                  : "hover:bg-muted"
              }`}
              onClick={() => setActiveSection("account")}
            >
              Account Details
            </Button>
            <Button
              variant={activeSection === "demographics" ? "default" : "ghost"}
              className={`w-full justify-start rounded-lg transition-colors ${
                activeSection === "demographics"
                  ? "bg-primary text-white"
                  : "hover:bg-muted"
              }`}
              onClick={() => setActiveSection("demographics")}
            >
              User Demographics
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {activeSection === "account" && (
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-20 w-20 ring-2 ring-muted">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left space-y-1">
                  <p className="font-semibold text-lg">{user?.name ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email ?? "—"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "demographics" && (
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  User Demographics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Row 1: Age + Gender */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <Label className="mb-1 block">Age</Label>
                    <Select
                      value={form.age}
                      onValueChange={(val) => setForm({ ...form, age: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {Array.from({ length: 100 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Label className="mb-1 block">Gender</Label>
                    <Select
                      value={form.gender}
                      onValueChange={(val) =>
                        setForm({ ...form, gender: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Weight + Height */}
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Weight */}
                  <div className="flex-1">
                    <Label className="mb-1 block">Weight (kg)</Label>
                    <Input
                      placeholder="e.g. 70"
                      value={form.weight}
                      onChange={(e) =>
                        setForm({ ...form, weight: e.target.value })
                      }
                    />
                  </div>

                  {/* Height */}
                  <div className="flex-1">
                    <Label className="mb-1 block">Height</Label>
                    <div className="flex flex-col gap-3">
                      {/* Height Dropdowns */}
                      <div className="flex gap-2">
                        {form.heightUnit === "cm" && (
                          <Select
                            value={form.heightCm}
                            onValueChange={(val) =>
                              setForm({ ...form, heightCm: val })
                            }
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="cm" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {Array.from(
                                { length: 151 },
                                (_, i) => 100 + i
                              ).map((cm) => (
                                <SelectItem key={cm} value={String(cm)}>
                                  {cm} cm
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {form.heightUnit === "ft-in" && (
                          <>
                            {/* Feet */}
                            <Select
                              value={form.heightFt}
                              onValueChange={(val) =>
                                setForm({ ...form, heightFt: val })
                              }
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="ft" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 6 }, (_, i) => i + 3).map(
                                  (ft) => (
                                    <SelectItem key={ft} value={String(ft)}>
                                      {ft} ft
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>

                            {/* Inches */}
                            <Select
                              value={form.heightIn}
                              onValueChange={(val) =>
                                setForm({ ...form, heightIn: val })
                              }
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="in" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => i).map(
                                  (inch) => (
                                    <SelectItem key={inch} value={String(inch)}>
                                      {inch} in
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </>
                        )}
                      </div>

                      {/* Height Unit Toggle */}
                      <div className="flex gap-4 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="heightUnit"
                            value="cm"
                            checked={form.heightUnit === "cm"}
                            onChange={() =>
                              setForm({ ...form, heightUnit: "cm" })
                            }
                          />
                          <span>cm</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="heightUnit"
                            value="ft-in"
                            checked={form.heightUnit === "ft-in"}
                            onChange={() =>
                              setForm({ ...form, heightUnit: "ft-in" })
                            }
                          />
                          <span>ft + in</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Nationality */}
                <div>
                  <Label className="mb-1 block">Nationality</Label>
                  <Select
                    value={selectedCountry || ""}
                    onValueChange={(value) => {
                      setSelectedCountry(value);
                      setForm({ ...form, nationality: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save / Cancel Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="w-full sm:w-auto">Save Changes</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
