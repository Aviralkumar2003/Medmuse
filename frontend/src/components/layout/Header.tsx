import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Menu, User, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../../hooks/redux"
import { logout, getCurrentUser } from "../../store/slices/authSlice"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user === undefined && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [user, isLoading, dispatch]);

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-medical">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-ui font-semibold text-foreground">
              MedMuse
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-fast font-ui">Dashboard</Link>
                <Link to="/log-symptoms" className="text-muted-foreground hover:text-foreground transition-fast font-ui">Log Symptoms</Link>
                <Link to="/history" className="text-muted-foreground hover:text-foreground transition-fast font-ui">History</Link>
                <Link to="/reports" className="text-muted-foreground hover:text-foreground transition-fast font-ui">Reports</Link>
              </>
            ) : (
              <>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isLoading ? (
              <Button variant="medical" size="sm" asChild><Link to="/login">Get Started</Link></Button>
            ) : null}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-fast font-ui" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  <Link to="/log-symptoms" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-fast font-ui" onClick={() => setIsMenuOpen(false)}>Log Symptoms</Link>
                  <Link to="/history" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-fast font-ui" onClick={() => setIsMenuOpen(false)}>History</Link>
                  <Link to="/reports" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-fast font-ui" onClick={() => setIsMenuOpen(false)}>Reports</Link>
                  {user && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profilePicture} alt={user.name} />
                          <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
                        <LogOut className="mr-2 h-4 w-4" />Log out
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1" asChild><Link to="/login">Sign In</Link></Button>
                  <Button variant="medical" size="sm" className="flex-1" asChild><Link to="/signup">Get Started</Link></Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}