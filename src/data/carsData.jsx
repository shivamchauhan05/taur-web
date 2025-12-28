const carsData = [
  {
    id: 1,
    name: "maruti suzuki",
    image: "download maruti.jfif",
    
    // PER DAY MODEL (Same Pickup & Drop)
    perDayModel: {
      enabled: true,
      pricePerDay: 2000,
      driverChargePerDay: 500,
      tollTaxPerDay: 500,
      stateTaxPerDay: 180,
      maxKmsPerDay: 400, // 400km per day limit
      extraKmRate: 17, // Per extra km beyond 400km/day
      freeKmsPerDay: 100,
      includes: ["Driver", "Fuel for 400km/day", "Basic Insurance", "24/7 Support"]
    },
    
    // PER KM MODEL (Different Pickup & Drop)
    perKmModel: {
      enabled: true,
      pricePerKm: 17,
      driverChargePerKm: 2, // Per km driver charge
      tollTaxPerKm: 0.50,
      stateTaxPerKm: 0.85, // 5% GST
      minKms: 50,
      includes: ["Driver", "Fuel", "Toll Tax", "Basic Insurance"]
    },
    
    // Common Details
    seats: 4,
    transmission: "Manual",
    fuel: "CNG",
    rating: 4.8,
    description: "Perfect for off-road adventures with experienced driver included.",
    features: ["4x4 Drive", "AC", "Music System", "Sunroof"],
    type: "suv",
    assignedDrivers: [1, 5],
    recommendedFor: ["Off-road", "Hill Stations", "Adventure"]
  },
  {
    id: 2,
    name: "wagnor",
    image: "download wagonar.jfif",
    
    perDayModel: {
      enabled: true,
      pricePerDay: 1800,
      driverChargePerDay: 500,
      tollTaxPerDay: 400,
      stateTaxPerDay: 288,
      maxKmsPerDay: 400,
      extraKmRate: 17,
      freeKmsPerDay: 100,
      includes: ["Professional Driver", "Fuel for 400km/day", "Premium Insurance", "WiFi"]
    },
    
    perKmModel: {
      enabled: true,
      pricePerKm: 17,
      driverChargePerKm: 2.5,
      tollTaxPerKm: 0.75,
      stateTaxPerKm: 1.02,
      minKms: 50,
      includes: ["Professional Driver", "Fuel", "Toll Tax", "Premium Insurance"]
    },
    
    seats: 4,
    transmission: "Automatic",
    fuel: "CNG",
    rating: 4.7,
    description: "Premium SUV with luxury features and professional driver.",
    features: ["Premium Sound", "Sunroof", "Leather Seats", "Navigation","AC"],
    type: "suv",
    assignedDrivers: [2, 4],
    recommendedFor: ["Family Trips", "Luxury Travel", "Long Distance"]
  },
  // ... other cars with same structure
];

export default carsData;