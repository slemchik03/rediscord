import { clsx } from "@/lib/utils";
interface TabGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
}

export default function TabGroup({
  gap = "4",
  className,
  children,
  ...props
}: TabGroupProps) {
  return (
    <div
      className="w-full"
      {...props}
    >
      <div
        className={clsx(
          `relative flex gap-${gap}`,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
