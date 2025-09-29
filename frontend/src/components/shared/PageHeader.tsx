interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-ui font-bold text-foreground mb-2">
        {title}
      </h1>
      <p className="text-lg font-body text-muted-foreground">
        {description}
      </p>
    </div>
  );
};