import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-28 text-center">
      <Seo title="Page not found" />
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Leaf className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-heading text-4xl font-bold text-primary">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you are looking for may have been moved. Let's get you back to familiar ground.
      </p>
      <Button asChild className="mt-8 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}
