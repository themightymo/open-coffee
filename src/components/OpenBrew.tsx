import { useState, useEffect } from "react";
import { Search, MapPin, RefreshCw, Coffee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CoffeeShopCard } from "./CoffeeShopCard";
import { useToast } from "@/hooks/use-toast";

// Import coffee shop images
import coffeeShop1 from "@/assets/coffee-shop-1.jpg";
import coffeeShop2 from "@/assets/coffee-shop-2.jpg";
import coffeeShop3 from "@/assets/coffee-shop-3.jpg";
import coffeeShop4 from "@/assets/coffee-shop-4.jpg";

interface CoffeeShop {
  id: string;
  name: string;
  distance: number;
  isOpen: boolean;
  rating: number;
  imageUrl: string;
  address: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

export function OpenBrew() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("Detecting location...");
  const { toast } = useToast();

  // Mock coffee shop data
  const mockCoffeeShops: CoffeeShop[] = [
    {
      id: "1",
      name: "Brew & Beans Co.",
      distance: 0.2,
      isOpen: true,
      rating: 4.8,
      imageUrl: coffeeShop1,
      address: "123 Main St, Downtown"
    },
    {
      id: "2",
      name: "The Roastery",
      distance: 0.4,
      isOpen: true,
      rating: 4.6,
      imageUrl: coffeeShop2,
      address: "456 Coffee Ave, Arts District"
    },
    {
      id: "3",
      name: "Corner Café",
      distance: 0.6,
      isOpen: false,
      rating: 4.3,
      imageUrl: coffeeShop3,
      address: "789 Elm St, Riverside"
    },
    {
      id: "4",
      name: "Minimal Coffee",
      distance: 0.8,
      isOpen: true,
      rating: 4.7,
      imageUrl: coffeeShop4,
      address: "321 Design Blvd, Modern Quarter"
    },
    {
      id: "5",
      name: "Morning Glory Café",
      distance: 1.2,
      isOpen: true,
      rating: 4.4,
      imageUrl: coffeeShop1,
      address: "654 Sunrise Dr, East End"
    },
    {
      id: "6",
      name: "Bean There",
      distance: 1.5,
      isOpen: false,
      rating: 4.2,
      imageUrl: coffeeShop2,
      address: "987 Coffee St, Northside"
    }
  ];

  // Get user location
  const requestLocation = async () => {
    setIsLoading(true);
    setLocationStatus("Detecting location...");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      setUserLocation(newLocation);
      setLocationStatus(`Located: ${newLocation.latitude.toFixed(4)}, ${newLocation.longitude.toFixed(4)}`);
      
      // Simulate API call to fetch nearby coffee shops
      setTimeout(() => {
        setCoffeeShops(mockCoffeeShops);
        setIsLoading(false);
        toast({
          title: "Location updated!",
          description: `Found ${mockCoffeeShops.length} coffee shops nearby`,
        });
      }, 1000);

    } catch (error) {
      setLocationStatus("Location access denied");
      setIsLoading(false);
      
      // Show mock data even without location
      setCoffeeShops(mockCoffeeShops);
      
      toast({
        title: "Location unavailable",
        description: "Showing popular coffee shops in your area",
        variant: "destructive",
      });
    }
  };

  // Initial location request
  useEffect(() => {
    requestLocation();
  }, []);

  // Filter coffee shops based on search
  const filteredShops = coffeeShops.filter(shop =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by open status first, then by distance
  const sortedShops = filteredShops.sort((a, b) => {
    if (a.isOpen && !b.isOpen) return -1;
    if (!a.isOpen && b.isOpen) return 1;
    return a.distance - b.distance;
  });

  return (
    <div className="min-h-screen bg-gradient-cream">
      {/* Header */}
      <div className="bg-gradient-coffee text-primary-foreground p-4 pb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Coffee className="w-8 h-8" />
            <h1 className="text-2xl font-bold">OpenBrew</h1>
          </div>
          
          {/* Location status */}
          <div className="flex items-center gap-2 text-sm opacity-90 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{locationStatus}</span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Find coffee near me…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-accent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Refresh button */}
      <div className="max-w-md mx-auto p-4">
        <Button
          onClick={requestLocation}
          disabled={isLoading}
          variant="secondary"
          className="w-full gap-2 shadow-warm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh Location & Results"}
        </Button>
      </div>

      {/* Coffee shop results */}
      <div className="max-w-md mx-auto px-4 pb-8">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-muted rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-muted rounded mb-1 w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedShops.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No coffee shops found</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {searchQuery ? `"${searchQuery}"` : "Nearby Coffee Shops"}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {sortedShops.length} found
                  </span>
                </div>
                
                {sortedShops.map((shop) => (
                  <CoffeeShopCard key={shop.id} shop={shop} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}