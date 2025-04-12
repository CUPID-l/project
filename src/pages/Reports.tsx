
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, AlertCircle } from "lucide-react";

const Reports = () => {
  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Soil Reports Dashboard</h1>
        <p className="text-foreground/70 mb-8">
          Track your soil health and fertilizer effectiveness over time.
        </p>
        
        <Card className="border border-border/40 mb-8">
          <CardHeader>
            <CardTitle>Reports Dashboard</CardTitle>
            <CardDescription>
              Your soil analysis history and fertilizer effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex flex-col items-center text-center max-w-md">
              <AlertCircle className="text-foreground/50 mb-2" size={48} />
              <h3 className="text-lg font-medium mb-2">No Reports Available</h3>
              <p className="text-foreground/70 mb-6">
                You haven't generated any reports yet. Enter soil data to create your first soil analysis report.
              </p>
              <Button asChild className="bg-soilsync-primary hover:bg-soilsync-primary/90">
                <a href="/data-entry" className="flex items-center gap-2">
                  <FileBarChart size={18} />
                  Create Your First Report
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/40 bg-muted/30">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Features that will be available in future updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-soilsync-primary font-bold">•</span>
                <span className="text-foreground/80">Historical soil data visualization with charts and graphs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-soilsync-primary font-bold">•</span>
                <span className="text-foreground/80">Seasonal comparison of soil health parameters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-soilsync-primary font-bold">•</span>
                <span className="text-foreground/80">Fertilizer effectiveness tracking over time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-soilsync-primary font-bold">•</span>
                <span className="text-foreground/80">Crop yield correlation with soil parameters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-soilsync-primary font-bold">•</span>
                <span className="text-foreground/80">Custom report generation and export options</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
