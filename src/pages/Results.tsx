export default function Results() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Results</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Latest Recommendation</h2>
            <p className="text-muted-foreground">
              No recommendations available yet. Please submit soil data first.
            </p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">History</h2>
            <p className="text-muted-foreground">
              Your previous recommendations will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
