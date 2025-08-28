import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import { Heart } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { loginStart, clearError } from "../store/slices/authSlice"
import { useToast } from "../hooks/use-toast"
import Google from "../assets/Google.svg"

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
                <Button 
                  onClick={handleGoogleLogin}
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  <img src={Google} alt="Google logo" className="h-5 w-5 mr-2" />
                  {isLoading ? "Signing in..." : <>Continue with <span className="google-text">Google</span></>}
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
