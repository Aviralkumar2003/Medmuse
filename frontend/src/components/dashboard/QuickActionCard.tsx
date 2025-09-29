import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActionCard = () => {
  return (
    <Card className="bg-gradient-primary shadow-card border-0 mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-ui font-semibold text-primary-foreground mb-2">
              Ready to log today's symptoms?
            </h2>
            <p className="text-primary-foreground/90 font-body">
              Keep your health tracking consistent
            </p>
          </div>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0"
            asChild
          >
            <Link to="/log-symptoms">
              <Plus className="h-5 w-5 mr-2" />
              Log Symptoms
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};