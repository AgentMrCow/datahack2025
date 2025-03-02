"use client";

import * as React from "react";
import { Check, ChevronsUpDown, LocateFixed } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// If you're using shadcn/ui for inputs, you might also need imports like:
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";

// ---------------------------------------------------------------------------
// 1. Define the Route Graph and Inherent Risk
// ---------------------------------------------------------------------------
const routeGraph: { [key: string]: string[] } = {
  CUHK: ["New Town Plaza", "Admiralty Station"],
  "New Town Plaza": ["CUHK", "Exhibition Centre", "Admiralty Station"],
  "Hong Kong Museum of Art": ["Exhibition Centre", "Central"],
  "Exhibition Centre": [
    "New Town Plaza",
    "Admiralty Station",
    "Central",
    "Hong Kong Museum of Art",
  ],
  "Admiralty Station": ["CUHK", "New Town Plaza", "Exhibition Centre", "Central", "HKU"],
  "Victoria Harbor": ["Central", "International Airport"],
  Central: [
    "Admiralty Station",
    "Exhibition Centre",
    "Hong Kong Museum of Art",
    "HKU",
    "International Airport",
    "Victoria Harbor",
  ],
  HKU: ["Admiralty Station", "Central"],
  "International Airport": ["Central", "Victoria Harbor"],
};

const locationRisk: { [key: string]: number } = {
  CUHK: 0.3,
  "New Town Plaza": 0.7,
  "Hong Kong Museum of Art": 0.5,
  "Exhibition Centre": 0.6,
  "Admiralty Station": 1.0,
  "Victoria Harbor": 0.4,
  Central: 0.8,
  HKU: 0.3,
  "Ocean Park": 0.7,
  "International Airport": 0.9,
};

// ---------------------------------------------------------------------------
// 2. BFS to find the shortest path (same as your Python logic)
// ---------------------------------------------------------------------------
function getShortestPath(
  graph: { [key: string]: string[] },
  start: string,
  destination: string
): string[] {
  if (!(start in graph) || !(destination in graph)) return [];

  const visited = new Set([start]);
  const queue: string[][] = [[start]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    if (current === destination) {
      return path;
    }
    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return [];
}

// ---------------------------------------------------------------------------
// 3. Calculate route risk
// ---------------------------------------------------------------------------
function calculateRouteRisk(
  start: string,
  destination: string,
  transportationMode: string
): { risk: number; path: string[] } {
  const path = getShortestPath(routeGraph, start, destination);

  let baseRisk = 0;
  if (path.length < 3) {
    // No (or 1) intermediate stops → baseline 0.2
    baseRisk = 0.2;
  } else {
    // Sum only intermediate nodes
    const intermediateNodes = path.slice(1, -1);
    baseRisk = intermediateNodes.reduce((sum, node) => {
      return sum + (locationRisk[node] || 0);
    }, 0);
    // Cap at 1.0
    baseRisk = Math.min(baseRisk, 1.0);
  }

  let multiplier = 1.0;
  const mode = transportationMode.toLowerCase();
  if (mode === "public") multiplier = 1.2;
  else if (mode === "private") multiplier = 0.8;

  let routeRiskValue = baseRisk * multiplier;
  routeRiskValue = Math.min(Math.max(routeRiskValue, 0), 1.0);

  return { risk: routeRiskValue, path };
}

// ---------------------------------------------------------------------------
// 4. User risk
// ---------------------------------------------------------------------------
function computeUserRisk(userInfo: {
  age: number;
  vaccinated: boolean;
  has_preexisting: boolean;
  safe_code: string;
  transportation_mode: string;
}): number {
  let risk = 0.2;
  if (!userInfo.vaccinated) risk += 0.3;
  if (userInfo.has_preexisting) risk += 0.2;
  if (userInfo.age >= 60) risk += 0.2;
  if (userInfo.safe_code.toLowerCase() === "yellow") risk += 0.2;
  return risk;
}

// ---------------------------------------------------------------------------
// 5. Sigmoid + logistic regression
// ---------------------------------------------------------------------------
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function riskAssessment(
  start: string,
  destination: string,
  userInfo: {
    age: number;
    vaccinated: boolean;
    has_preexisting: boolean;
    safe_code: string;
    transportation_mode: string;
  },
  weights?: number[],
  bias?: number
): { probability: number; riskLevel: string; path: string[] } {
  // If safe_code = "red", override
  if (userInfo.safe_code.toLowerCase() === "red") {
    return { probability: 0.99, riskLevel: "red", path: [] };
  }

  const { risk: routeRisk, path } = calculateRouteRisk(
    start,
    destination,
    userInfo.transportation_mode
  );
  const userRisk = computeUserRisk(userInfo);

  // Default weights from your Python code
  const w = weights ?? [2.5, 2.0];
  const b = bias ?? -3.0;

  const z = w[0] * routeRisk + w[1] * userRisk + b;
  const p = sigmoid(z);

  let level = "green";
  if (p < 0.33) level = "green";
  else if (p < 0.66) level = "yellow";
  else level = "red";

  return { probability: p, riskLevel: level, path };
}

// ---------------------------------------------------------------------------
// 6. Reusable ComboBox (ShadCN style) for picking origin/destination
// ---------------------------------------------------------------------------
type ComboBoxProps = {
  value: string;
  onValueChange: (val: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
};

function ComboBox({ value, onValueChange, placeholder, options }: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {options.map((loc) => (
                <CommandItem
                  key={loc.value}
                  value={loc.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {loc.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === loc.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// 7. Main "PlanRoutePage" with user attributes in the UI
// ---------------------------------------------------------------------------

// All known locations
const allLocations = [
  { value: "CUHK", label: "CUHK" },
  { value: "New Town Plaza", label: "New Town Plaza" },
  { value: "Hong Kong Museum of Art", label: "Hong Kong Museum of Art" },
  { value: "Exhibition Centre", label: "Exhibition Centre" },
  { value: "Admiralty Station", label: "Admiralty Station" },
  { value: "Victoria Harbor", label: "Victoria Harbor" },
  { value: "Central", label: "Central" },
  { value: "HKU", label: "HKU" },
  { value: "International Airport", label: "International Airport" },
  { value: "Ocean Park", label: "Ocean Park" },
];

// Don’t restrict to neighbors—let BFS do the real path check.
function getDestinationOptions(origin: string) {
  if (!origin) {
    return allLocations;
  }
  // remove the origin itself from the list
  return allLocations.filter((loc) => loc.value !== origin);
}

// The main page
export default function PlanRoutePage() {
  // Origin/destination
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");

  // Result from riskAssessment
  const [result, setResult] = React.useState<{
    probability: number;
    riskLevel: string;
    path: string[];
  } | null>(null);

  // “Locating…” simulation
  const [isLocating, setIsLocating] = React.useState(false);
  // “Calculating…” simulation
  const [isCalculating, setIsCalculating] = React.useState(false);

  // -------------------------------------------------------------------------
  // NEW: Let user fill in the same data as in your Python examples
  // -------------------------------------------------------------------------
  const [userInfo, setUserInfo] = React.useState({
    age: 30,
    vaccinated: true,
    has_preexisting: false,
    safe_code: "green",
    transportation_mode: "public",
  });

  function handleOriginChange(val: string) {
    setOrigin(val);
    setDestination("");
    setResult(null);
  }

  function handleUseCurrentLocation() {
    setIsLocating(true);
    setTimeout(() => {
      handleOriginChange("CUHK");
      setIsLocating(false);
    }, 1000);
  }

  // call riskAssessment with the user’s data
  function handleFindRoute() {
    if (!origin || !destination) return;
    setIsCalculating(true);

    const assessment = riskAssessment(origin, destination, userInfo);
    setResult(assessment);

    setIsCalculating(false);
  }

  const destinationOptions = React.useMemo(() => {
    return getDestinationOptions(origin);
  }, [origin]);

  // Handler to update userInfo (like handleUserChange('safe_code', 'yellow'))
  function handleUserChange<K extends keyof typeof userInfo>(
    field: K,
    value: typeof userInfo[K]
  ) {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    setResult(null); // reset result when user changes
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Route</CardTitle>
          <CardDescription>
            Now you can set all user attributes to match your Python tests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ORIGIN */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Starting Point</label>
            <div className="flex items-center gap-2">
              <ComboBox
                value={origin}
                onValueChange={handleOriginChange}
                placeholder="Select origin"
                options={allLocations}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleUseCurrentLocation}
                title="Use current location"
              >
                {isLocating ? (
                  <span className="text-xs">Locating...</span>
                ) : (
                  <LocateFixed className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* DESTINATION */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <ComboBox
              value={destination}
              onValueChange={(val) => {
                setDestination(val);
                setResult(null);
              }}
              placeholder="Select destination"
              options={destinationOptions}
            />
          </div>

          {/* --- USER ATTRIBUTES --- */}
          <div className="bg-slate-50 p-4 rounded-md space-y-4">
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Age</label>
              <input
                type="number"
                className="border p-1 rounded w-20"
                value={userInfo.age}
                onChange={(e) => handleUserChange("age", Number(e.target.value))}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Vaccinated?</label>
              <input
                type="checkbox"
                checked={userInfo.vaccinated}
                onChange={(e) => handleUserChange("vaccinated", e.target.checked)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Preexisting?</label>
              <input
                type="checkbox"
                checked={userInfo.has_preexisting}
                onChange={(e) => handleUserChange("has_preexisting", e.target.checked)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Safe Code</label>
              <select
                className="border p-1 rounded"
                value={userInfo.safe_code}
                onChange={(e) => handleUserChange("safe_code", e.target.value)}
              >
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="red">Red</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Transport Mode</label>
              <select
                className="border p-1 rounded"
                value={userInfo.transportation_mode}
                onChange={(e) => handleUserChange("transportation_mode", e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* --- SUBMIT --- */}
          <Button
            className="w-full"
            onClick={handleFindRoute}
            disabled={!origin || !destination || isCalculating || isLocating}
          >
            {isCalculating ? "Calculating..." : "Find Safe Route"}
          </Button>

          {/* --- RESULT --- */}
          {result && (
            <div className="mt-4 text-sm">
              <p>
                <strong>Risk Probability:</strong> {(result.probability * 100).toFixed(2)}%
              </p>
              <p>
                <strong>Risk Level:</strong> {result.riskLevel}
              </p>
              <p>
                <strong>Route:</strong>{" "}
                {result.path.length ? result.path.join(" → ") : "No path found"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
