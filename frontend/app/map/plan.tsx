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

/* ===========================================================================
   RISK ASSESSMENT LOGIC (Converted from Python)
   ---------------------------------------------------------------------------
   1. Define the Route Graph and Inherent Risk for Each Location
   ========================================================================= */
const routeGraph: { [key: string]: string[] } = {
  "CUHK": ["New Town Plaza", "Admiralty Station"],
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
  "Central": [
    "Admiralty Station",
    "Exhibition Centre",
    "Hong Kong Museum of Art",
    "HKU",
    "International Airport",
    "Victoria Harbor",
  ],
  "HKU": ["Admiralty Station", "Central"],
  "International Airport": ["Central", "Victoria Harbor"],
};

const locationRisk: { [key: string]: number } = {
  "CUHK": 0.3,
  "New Town Plaza": 0.7,
  "Hong Kong Museum of Art": 0.5,
  "Exhibition Centre": 0.6,
  "Admiralty Station": 0.8,
  "Victoria Harbor": 0.4,
  "Central": 0.8,
  "HKU": 0.3,
  "Ocean Park": 0.7,
  "International Airport": 0.9,
};

/* ===========================================================================
   2. Utility: Find the Shortest Path on the Graph (BFS)
   ========================================================================= */
function getShortestPath(
  graph: { [key: string]: string[] },
  start: string,
  destination: string
): string[] {
  if (!(start in graph) || !(destination in graph)) return [];
  const visited = new Set<string>();
  visited.add(start);
  const queue: string[][] = [[start]];
  while (queue.length) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    if (current === destination) return path;
    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return [];
}

/* ===========================================================================
   3. Calculate Route Risk by Summing the Risk of Intermediate Nodes
   ========================================================================= */
function calculateRouteRisk(
  start: string,
  destination: string,
  transportationMode: string = "public"
): { risk: number; path: string[] } {
  const path = getShortestPath(routeGraph, start, destination);
  let baseRisk: number;
  if (!path || path.length < 3) {
    // No intermediate nodes – assign a small baseline risk.
    baseRisk = 0.2;
  } else {
    const intermediateNodes = path.slice(1, -1);
    baseRisk = intermediateNodes.reduce(
      (sum, node) => sum + (locationRisk[node] || 0),
      0
    );
    baseRisk = Math.min(baseRisk, 1.0);
  }
  const mode = transportationMode.toLowerCase();
  let multiplier = 1.0;
  if (mode === "public") multiplier = 1.2;
  else if (mode === "private") multiplier = 0.8;
  let routeRiskValue = baseRisk * multiplier;
  routeRiskValue = Math.min(Math.max(routeRiskValue, 0), 1.0);
  return { risk: routeRiskValue, path };
}

/* ===========================================================================
   4. Compute the User's Personal Risk Factor
   ========================================================================= */
function computeUserRisk(userInfo: any): number {
  let risk = 0.2;
  if (userInfo.vaccinated === false) risk += 0.3;
  if (userInfo.has_preexisting) risk += 0.2;
  if ((userInfo.age || 30) >= 60) risk += 0.2;
  if ((userInfo.safe_code || "green").toLowerCase() === "yellow") risk += 0.2;
  return risk;
}

/* ===========================================================================
   5. Sigmoid Function and Risk Estimator
   ========================================================================= */
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function riskAssessment(
  start: string,
  destination: string,
  userInfo: any,
  weights?: number[],
  bias?: number
): { probability: number; riskLevel: string; path: string[] } {
  // Immediate override: if safe code is red, return high risk.
  if ((userInfo.safe_code || "green").toLowerCase() === "red") {
    return { probability: 0.99, riskLevel: "red", path: [] };
  }
  const transportationMode = userInfo.transportation_mode || "public";
  const { risk: routeRisk, path } = calculateRouteRisk(start, destination, transportationMode);
  const userRisk = computeUserRisk(userInfo);
  const features = [routeRisk, userRisk];
  const defaultWeights = weights || [2.5, 2.0];
  const defaultBias = bias || -3.0;
  const z = defaultWeights[0] * features[0] + defaultWeights[1] * features[1] + defaultBias;
  const p = sigmoid(z);
  let riskLevel = "green";
  if (p < 0.33) riskLevel = "green";
  else if (p < 0.66) riskLevel = "yellow";
  else riskLevel = "red";
  return { probability: p, riskLevel, path };
}

/* ===========================================================================
   UI COMPONENTS: ComboBox (ShadCN style)
   ========================================================================= */
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

/* ===========================================================================
   MAIN PAGE COMPONENT
   ========================================================================= */
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
];

// When origin changes, valid destination options are filtered.
function getDestinationOptions(origin: string) {
  if (origin && routeGraph[origin]) {
    return allLocations.filter((loc) => routeGraph[origin].includes(loc.value));
  }
  return allLocations;
}

// Default user info (adjust as needed)
const defaultUser = {
  age: 30,
  vaccinated: true,
  has_preexisting: false,
  safe_code: "green",
  transportation_mode: "public",
};

export default function PlanRoutePage() {
  // Separate loading states: one for locating, one for calculating.
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [isLocating, setIsLocating] = React.useState(false);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [result, setResult] = React.useState<{
    probability: number;
    riskLevel: string;
    path: string[];
  } | null>(null);

  // Reset destination and result when origin changes.
  const handleOriginChange = (newOrigin: string) => {
    setOrigin(newOrigin);
    setDestination("");
    setResult(null);
  };

  // Filter destination options based on selected origin.
  const destinationOptions = React.useMemo(() => getDestinationOptions(origin), [origin]);

  // Simulate current location request: hard-code to "CUHK" (separate loading state).
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      handleOriginChange("CUHK");
      setIsLocating(false);
    }, 1000);
  };

  // Compute risk assessment using the risk logic.
  const handleFindRoute = () => {
    if (!origin || !destination) return;
    setIsCalculating(true);
    const assessment = riskAssessment(origin, destination, defaultUser);
    setResult(assessment);
    setIsCalculating(false);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Route</CardTitle>
          <CardDescription>
            We'll find the safest path to your destination in Hong Kong.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Starting Point */}
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

          {/* Destination */}
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

          <Button
            className="w-full"
            onClick={handleFindRoute}
            disabled={!origin || !destination || isCalculating || isLocating}
          >
            {isCalculating ? "Calculating..." : "Find Safe Route"}
          </Button>

          {result && (
            <div className="mt-4 text-sm">
              <p>
                <strong>Risk Probability:</strong> {(result.probability * 100).toFixed(0)}%
              </p>
              <p>
                <strong>Risk Level:</strong> {result.riskLevel}
              </p>
              <p>
                <strong>Route:</strong> {result.path.join(" → ")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
