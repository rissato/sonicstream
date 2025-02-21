import { Card, CardContent } from "@/components/ui/card";

export default function Library() {
  return (
    <div className="space-y-8">
      <section>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Library</h2>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
