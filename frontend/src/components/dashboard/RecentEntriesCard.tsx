import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RecentEntry {
  entryDate: string;
  symptomName: string;
  severity: number;
}

interface RecentEntriesCardProps {
  entries: RecentEntry[];
  isLoading?: boolean;
}

export const RecentEntriesCard = ({ entries, isLoading = false }: RecentEntriesCardProps) => {
  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-ui text-foreground">Recent Entries</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/history">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground text-center py-4">Loading entries...</p>
        ) : entries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-body mb-4">No symptom entries yet</p>
            <Button variant="medical" size="sm" asChild>
              <Link to="/log-symptoms">
                Log First Symptom
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-ui text-foreground">{entry.symptomName}</p>
                  <p className="text-sm text-muted-foreground">{entry.entryDate}</p>
                </div>
                <div className={`text-sm font-medium ${
                  entry.severity <= 3 ? 'text-secondary' :
                  entry.severity <= 6 ? 'text-attention' :
                  'text-warning'
                }`}>
                  Severity: {entry.severity}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};