import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
} 