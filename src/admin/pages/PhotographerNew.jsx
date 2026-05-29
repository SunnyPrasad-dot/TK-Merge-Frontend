import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/hooks/use-toast";
import { useCreatePhotographer } from "@admin/services/api";
import { ArrowLeft, Save } from "lucide-react";

export default function PhotographerNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createPhotographer = useCreatePhotographer();

  const handleSave = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      avatar: form.get("avatar"),
      email: form.get("email"),
      phone: form.get("phone"),
      city: form.get("city"),
      role: form.get("role"),
      bookedDates: [],
      isActive: true,
      perDayRate: Number(form.get("perDayRate")),
    };
    createPhotographer.mutate(payload, {
      onSuccess: () => {
        toast({ title: "Photographer Created", description: "Successfully added new photographer." });
        navigate("/admin/photographers");
      },
      onError: (err) => toast({ title: "Create failed", description: err.message }),
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/photographers")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Add New Photographer</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create a new photographer profile</p>
        </div>
      </div>
      
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Photographer Details</CardTitle>
            <CardDescription>Enter the personal and professional details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input name="name" placeholder="Rahul Patel" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" placeholder="rahul@gmail.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input name="phone" placeholder="9876543210" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input name="city" placeholder="Ahmedabad" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select name="role" required className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm">
                <option value="candid_photographer">Candid Photographer</option>
                <option value="traditional_photographer">Traditional Photographer</option>
                <option value="traditional_videographer">Traditional Videographer</option>
                <option value="cinematographer">Cinematographer</option>
                <option value="drone">Drone</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar</label>
              <Input name="avatar" placeholder="image.png" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Per Day Rate</label>
              <Input name="perDayRate" type="number" placeholder="3000" required />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-5">
            <Button variant="outline" type="button" onClick={() => navigate("/admin/photographers")}>Cancel</Button>
            <Button type="submit" disabled={createPhotographer.isPending} className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Save className="h-4 w-4" /> {createPhotographer.isPending ? "Saving..." : "Save Photographer"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
