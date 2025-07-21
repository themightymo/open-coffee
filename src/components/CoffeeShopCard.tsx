import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CoffeeShop {
  id: string;
  name: string;
  distance: number;
  isOpen: boolean;
  rating: number;
  imageUrl: string;
  address: string;
}

interface CoffeeShopCardProps {
  shop: CoffeeShop;
}

export function CoffeeShopCard({ shop }: CoffeeShopCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-coffee hover:scale-[1.02] bg-card border-border">
      <CardContent className="p-0">
        <div className="flex gap-3 p-4">
          {/* Coffee shop image */}
          <div className="flex-shrink-0">
            <img
              src={shop.imageUrl}
              alt={shop.name}
              className="w-16 h-16 rounded-xl object-cover bg-muted"
            />
          </div>

          {/* Shop details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-foreground text-base leading-tight truncate">
                {shop.name}
              </h3>
              <Badge 
                variant={shop.isOpen ? "default" : "secondary"}
                className={`text-xs flex-shrink-0 ${
                  shop.isOpen 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Clock className="w-3 h-3 mr-1" />
                {shop.isOpen ? "Open now" : "Closed"}
              </Badge>
            </div>

            {/* Distance and rating */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{shop.distance.toFixed(1)} mi</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(shop.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs ml-1">{shop.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Address */}
            <p className="text-xs text-muted-foreground truncate">
              {shop.address}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}