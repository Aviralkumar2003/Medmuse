import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import { Heart, ArrowRight } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { loginStart, clearError } from "../store/slices/authSlice"
import { useToast } from "../hooks/use-toast"

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const { toast } = useToast()

  console.log('[Login] Redux user:', user);

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    // Show error toast if there's an error
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      })
      dispatch(clearError())
    }
  }, [error, toast, dispatch])

  const handleGoogleLogin = () => {
    localStorage.setItem('returnUrl', from)
    dispatch(loginStart())
  }

  return (
    <div className="min-h-screen bg-background-soft">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-medical shadow-dialog">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-ui font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-lg font-body text-muted-foreground">
              Sign in to continue tracking your health
            </p>
          </div>

          <Card className="shadow-dialog border-border">
            <CardHeader>
              <CardTitle className="font-ui text-foreground">Sign In</CardTitle>
              <CardDescription className="font-body">
                Continue with Google to access your health dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Google Login Button */}
                <Button 
                  onClick={handleGoogleLogin}
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </Button>
                {error && (
                  <div className="text-destructive text-center mt-2">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-background-blue rounded-medical border border-primary/20">
            <p className="text-xs font-body text-muted-foreground text-center">
              Your health data is encrypted and secure. We comply with HIPAA regulations 
              and never share your personal information without your explicit consent.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}