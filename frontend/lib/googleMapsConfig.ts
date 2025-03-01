import type { LoadScriptProps } from "@react-google-maps/api"

export const googleMapsConfig: LoadScriptProps = {
  id: "google-map-script",
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  libraries: ["places", "maps"],
}

export const mapCenter = {
  lat: 22.419722,
  lng: 114.206792, // Coordinates for CUHK
}

export const hkDistricts = [
  "Central and Western",
  "Eastern",
  "Southern",
  "Wan Chai",
  "Kowloon City",
  "Kwun Tong",
  "Sham Shui Po",
  "Wong Tai Sin",
  "Yau Tsim Mong",
  "Islands",
  "Kwai Tsing",
  "North",
  "Sai Kung",
  "Sha Tin",
  "Tai Po",
  "Tsuen Wan",
  "Tuen Mun",
  "Yuen Long",
]

