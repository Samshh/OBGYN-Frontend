import { ReactNode } from "react";

interface DashCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

interface DashCardTitleProps {
  children: ReactNode;
  className?: string;
}

interface DashCardContentProps {
  children: ReactNode;
  className?: string;
}

export default function DashCard({
  children,
  className,
  id,
}: DashCardProps) {
  return (
      <div
        id={id}
        className={`flex flex-col p-[1rem] bg-white border border-border rounded-lg gap-[1rem] w-full ${className}`}
      >
        {children}
      </div>
  );
}

function DashCardTitle({ children, className }: DashCardTitleProps) {
  return <h2 className={className}>{children}</h2>;
}

function DashCardContent({ children, className }: DashCardContentProps) {
  return <div className={className}>{children}</div>;
}

function Separator() {
  return <div className="bg-border h-[1px] w-full" />;
}

DashCard.Title = DashCardTitle;
DashCard.Separator = Separator;
DashCard.Content = DashCardContent;
