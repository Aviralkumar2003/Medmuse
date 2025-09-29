interface WelcomeSectionProps {
  userName?: string;
  subtitle?: string;
}

export const WelcomeSection = ({ userName, subtitle = "Here's your health summary for today" }: WelcomeSectionProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-ui font-bold text-foreground mb-2">
        Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}! 👋
      </h1>
      <p className="text-lg font-body text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
};