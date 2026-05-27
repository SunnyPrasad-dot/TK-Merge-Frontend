import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

export default function PhotographerNew() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    toast({ title: "Photographer Created", description: "Successfully added new photographer." });
    navigate("/admin/photographers");
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
              <Input name="role" placeholder="candid_photographer" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar</label>
              <Input name="avatar" placeholder="image.png" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-5">
            <Button variant="outline" type="button" onClick={() => navigate("/admin/photographers")}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Save className="h-4 w-4" /> Save Photographer
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
