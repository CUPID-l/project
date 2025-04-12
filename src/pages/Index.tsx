
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Sprout, 
  BarChart3, 
  Zap, 
  LayoutDashboard, 
  LineChart,
  ArrowRight
} from "lucide-react";
import Logo from "@/components/Logo";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-screen-xl px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-soilsync-primary/10 text-soilsync-primary px-3 py-1 rounded-full text-sm font-medium">
                <Sprout size={16} />
                <span>Smart Farming Solution</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Optimize Your Fertilizer Usage with <span className="text-soilsync-primary">Soil Sync</span>
              </h1>
              
              <p className="text-lg text-foreground/70">
                Make data-driven decisions for your crops with our AI-powered soil analysis and fertilizer recommendation system.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-soilsync-primary hover:bg-soilsync-primary/90">
                  <Link to="/data-entry">Try Data Entry</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/reports">View Reports</Link>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-soilsync-primary/20 blur-3xl rounded-full"></div>
                <Logo size={280} className="relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-screen-xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Soil Sync provides comprehensive tools to analyze soil conditions and optimize fertilizer applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Leaf className="text-soilsync-primary" size={24} />}
              title="Precise Fertilizer Recommendations"
              description="Get AI-powered recommendations for the perfect fertilizer type and application rate based on your soil parameters."
            />
            
            <FeatureCard 
              icon={<BarChart3 className="text-soilsync-primary" size={24} />}
              title="Data Visualization"
              description="View comprehensive charts and graphs to understand trends in your soil health over time."
            />
            
            <FeatureCard 
              icon={<Zap className="text-soilsync-primary" size={24} />}
              title="Quick Manual Entry"
              description="Easily input soil parameters manually when sensor data isn't available for instant recommendations."
            />
            
            <FeatureCard 
              icon={<Sprout className="text-soilsync-primary" size={24} />}
              title="Crop-Specific Guidance"
              description="Tailored recommendations based on your specific crop type and growth stage requirements."
            />
            
            <FeatureCard 
              icon={<LayoutDashboard className="text-soilsync-primary" size={24} />}
              title="Comprehensive Dashboard"
              description="All your soil data and recommendations in one place for easy access and management."
            />
            
            <FeatureCard 
              icon={<LineChart className="text-soilsync-primary" size={24} />}
              title="Historical Analysis"
              description="Track changes in soil health and fertilizer effectiveness over growing seasons."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container max-w-screen-xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Easy steps to get started with Soil Sync and optimize your fertilizer application.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number={1}
              title="Enter Your Soil Data"
              description="Input soil parameters like pH, nitrogen, phosphorus, and potassium levels."
            />
            
            <StepCard 
              number={2}
              title="Get Recommendations"
              description="Receive AI-powered fertilizer recommendations based on your soil data and crop type."
            />
            
            <StepCard 
              number={3}
              title="Apply and Monitor"
              description="Apply the recommended fertilizer and track improvements in soil health over time."
            />
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-soilsync-primary hover:bg-soilsync-primary/90">
              <Link to="/data-entry" className="inline-flex items-center gap-2">
                Get Started Now
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-soilsync-primary/10">
        <div className="container max-w-screen-xl px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">
                Ready to optimize your crop yield?
              </h2>
              <p className="text-foreground/70 mb-6">
                Start making data-driven decisions for your farm today with Soil Sync's fertilizer optimization tools.
              </p>
              <Button asChild size="lg" className="bg-soilsync-primary hover:bg-soilsync-primary/90">
                <Link to="/data-entry">Try Data Entry Now</Link>
              </Button>
            </div>
            
            <div className="flex-1 flex justify-center">
              <Logo size={200} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string;
  description: string;
}) => {
  return (
    <Card className="border border-border/40 bg-card/50">
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-foreground/70">{description}</p>
      </CardContent>
    </Card>
  );
};

const StepCard = ({ number, title, description }: {
  number: number;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-soilsync-primary text-white flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-foreground/70">{description}</p>
    </div>
  );
};

export default Index;
