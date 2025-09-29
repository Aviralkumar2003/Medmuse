import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-6xl font-ui font-bold text-foreground mb-4">404</h1>
          <p className="text-xl font-body text-muted-foreground mb-8">Oops! Page not found</p>
          <Button variant="medical" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
