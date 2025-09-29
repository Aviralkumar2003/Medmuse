import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Heart, 
  Calendar, 
  FileText, 
  Share2, 
  TrendingUp, 
  Shield,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Landing() {
  const features = [
    {
      icon: Calendar,
      title: "Daily Symptom Logging",
      description: "Track your health with simple, guided daily entries. Never forget important symptoms again.",
    },
    {
      icon: TrendingUp,
      title: "Health Insights",
      description: "Visualize patterns and trends in your health data to better understand your condition.",
    },
    {
      icon: FileText,
      title: "Medical Reports",
      description: "Generate comprehensive reports for your healthcare providers with one click.",
    },
    {
      icon: Share2,
      title: "Provider Sharing",
      description: "Securely share your health timeline with doctors and specialists.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your health data is encrypted and secure. You control who sees what.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-medical shadow-dialog">
                <Heart className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-ui font-bold text-foreground mb-6 leading-tight">
              Your Health,{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Documented Daily
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl font-body text-muted-foreground mb-8 leading-relaxed">
              Track symptoms, spot patterns, and share insights with your healthcare team. 
              MedMuse turns your daily health into actionable medical information.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="medical" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/login">
                  Start Tracking Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span>HIPAA compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span>Export anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-ui font-bold text-foreground mb-4">
              Everything you need for better health tracking
            </h2>
            <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
              Simple tools that make a real difference in your healthcare journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card border-border hover:shadow-lg transition-medical">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-medical mb-4">
                    <feature.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-ui text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-body text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-primary rounded-medical p-12 text-center shadow-dialog">
            <h2 className="text-3xl md:text-4xl font-ui font-bold text-primary-foreground mb-4">
              Ready to take control of your health?
            </h2>
            <p className="text-lg font-body text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who are already using MedMuse to improve their healthcare conversations.
            </p>
            <Button variant="outline" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
              <Link to="/login">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-soft border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-ui font-semibold text-foreground">MedMuse</span>
            </div>
            <div className="flex space-x-6 text-sm font-ui text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-fast">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-fast">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-fast">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm font-ui text-muted-foreground">
            © 2024 MedMuse. All rights reserved. Built for better health tracking.
          </div>
        </div>
      </footer>
    </div>
  )
}