import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KundliMilan from "@/components/KundliMilan";
import { useT } from "@/hooks/useLang";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => 2024 - i);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const seconds = Array.from({ length: 60 }, (_, i) => i);

const popularPlaces = [
  "Delhi, DL, India",
  "Mumbai, MH, India",
  "Kolkata, WB, India",
  "Chennai, TN, India",
  "Bangalore, KA, India",
  "Hyderabad, TS, India",
  "Pune, MH, India",
  "Jaipur, RJ, India",
  "Lucknow, UP, India",
  "Ranchi, JH, India",
  "Patna, BR, India",
  "Bhopal, MP, India",
];

const FreeKundli = () => {
  const tr = useT();
  const [tab, setTab] = useState<"kundli" | "milan">("kundli");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("Jan");
  const [year, setYear] = useState("1990");
  const [hour, setHour] = useState("0");
  const [minute, setMinute] = useState("0");
  const [second, setSecond] = useState("0");
  const [birthPlace, setBirthPlace] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handlePlaceChange = (value: string) => {
    setBirthPlace(value);
    if (value.length > 0) {
      const filtered = popularPlaces.filter(place =>
        place.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPlaces(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectPlace = (place: string) => {
    setBirthPlace(place);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate Kundli logic would go here
    console.log({
      name,
      gender,
      day,
      month,
      year,
      hour,
      minute,
      second,
      birthPlace
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className={tab === "milan" ? "max-w-4xl mx-auto" : "max-w-xl mx-auto"}>
          <h1 className="text-3xl font-bold text-center mb-6 text-foreground">
            {tr("Free Kundli", "फ्री कुंडली")}
          </h1>

          <div className="mx-auto mb-8 flex max-w-md gap-2 rounded-full border border-border bg-secondary/50 p-1">
            {[
              { id: "kundli" as const, label: "Kundli / Birth Chart" },
              { id: "milan" as const, label: "Match Kundli" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "milan" ? (
            <KundliMilan />
          ) : (
          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  Gender<span className="text-red-500">*</span>
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Birth Details */}
              <div className="space-y-3">
                <Label className="text-foreground font-medium">Birth Details</Label>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* Day */}
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Day<span className="text-red-500">*</span>
                    </Label>
                    <Select value={day} onValueChange={setDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((d) => (
                          <SelectItem key={d} value={d.toString()}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Month */}
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Month<span className="text-red-500">*</span>
                    </Label>
                    <Select value={month} onValueChange={setMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Year<span className="text-red-500">*</span>
                    </Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Hour */}
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Hour<span className="text-red-500">*</span>
                    </Label>
                    <Select value={hour} onValueChange={setHour}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((h) => (
                          <SelectItem key={h} value={h.toString()}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Minute */}
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Minute<span className="text-red-500">*</span>
                    </Label>
                    <Select value={minute} onValueChange={setMinute}>
                      <SelectTrigger>
                        <SelectValue placeholder="Minute" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map((m) => (
                          <SelectItem key={m} value={m.toString()}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Second */}
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Second<span className="text-red-500">*</span>
                    </Label>
                    <Select value={second} onValueChange={setSecond}>
                      <SelectTrigger>
                        <SelectValue placeholder="Second" />
                      </SelectTrigger>
                      <SelectContent>
                        {seconds.map((s) => (
                          <SelectItem key={s} value={s.toString()}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Birth Place */}
              <div className="space-y-2 relative">
                <Label htmlFor="birthPlace" className="text-foreground font-medium">
                  Birth Place <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birthPlace"
                  placeholder="Ranchi, JH, India"
                  value={birthPlace}
                  onChange={(e) => handlePlaceChange(e.target.value)}
                  onFocus={() => birthPlace && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  required
                  className="w-full"
                />
                <p className="text-sm text-amber-500">
                  Please type initial of your birth place to get suggestions
                </p>
                
                {showSuggestions && filteredPlaces.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-auto">
                    {filteredPlaces.map((place, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-muted cursor-pointer text-foreground"
                        onClick={() => selectPlace(place)}
                      >
                        {place}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6 text-lg rounded-lg"
              >
                Generate the Kundli
              </Button>
            </form>
          </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FreeKundli;
