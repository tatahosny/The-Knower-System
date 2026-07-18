import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Camera, Save } from "lucide-react";

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    // Mock save logic
    toast.success("Profile updated successfully!");
  };

  const savePassword = () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    // Mock save logic
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Profile Settings"
        description="Manage your personal information and security preferences."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
          <div className="relative group">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary/10 text-4xl font-semibold text-primary shadow-sm">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-sm transition-transform hover:scale-105"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">{name || "User"}</h3>
            <p className="text-sm text-muted-foreground">{user?.role?.replace("_", " ")}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Allowed formats: JPG, PNG, GIF. Max size: 2MB.
          </p>
        </div>

        <div className="space-y-6">
          {/* General Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">General Information</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                />
              </div>
              <Button onClick={saveProfile} className="mt-2 w-fit">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Security</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button onClick={savePassword} variant="secondary" className="mt-2 w-fit">
                <Save className="mr-2 h-4 w-4" /> Update Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
