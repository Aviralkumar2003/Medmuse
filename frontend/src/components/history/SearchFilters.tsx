import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
}

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  onFilterClick
}: SearchFiltersProps) => {
  return (
    <Card className="mb-8 shadow-card border-border">
      <CardHeader>
        <CardTitle className="font-ui text-foreground">Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symptoms or notes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 font-body"
            />
          </div>
          <Button variant="outline" className="sm:w-auto" onClick={onFilterClick}>
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};