import { Check, Palette, Bell, Monitor, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@admin/components/ui/select";
import { Button } from "@admin/components/ui/button";
import { useSettings } from "@admin/services/SettingsContext";
import { useToast } from "@shared/hooks/use-toast";

// Custom Toggle Component
function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-foreground">{label}</span>
        {description && <span className="text-[11px] text-muted-foreground mt-0.5">{description}</span>}
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white dark:bg-card shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-3' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

// Custom Color Circle
function ColorCircle({ color, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-6 w-6 rounded-full flex items-center justify-center transition-all ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'hover:scale-110 shadow-sm border border-black/10'}`}
      style={{ backgroundColor: color }}
    >
      {selected && <Check className="h-3 w-3 text-white drop-shadow-md mix-blend-difference" />}
    </button>
  );
}

export default function Settings() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Settings</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* --- SECTION 1: APPEARANCE --- */}
          <Card className="border-primary/20 shadow-sm rounded-xl overflow-hidden bg-card/90 backdrop-blur-md">
            <CardHeader className="pb-3 pt-5 px-5 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2 font-semibold text-foreground">
                <Palette className="h-4 w-4 text-primary" /> Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              
              {/* Theme Mode */}
              <div className="space-y-2.5">
                <label className="text-[13px] font-medium text-foreground">Theme Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => updateSetting('themeMode', 'light')}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${settings.themeMode === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                  >
                    <div className="w-full h-14 bg-slate-100 rounded border border-slate-200 flex overflow-hidden">
                       <div className="w-1/3 bg-white border-r border-slate-200"></div>
                       <div className="w-2/3 bg-slate-50"></div>
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Light Mode</span>
                  </button>
                  <button 
                    onClick={() => updateSetting('themeMode', 'dark')}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${settings.themeMode === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                  >
                    <div className="w-full h-14 bg-slate-900 rounded border border-slate-800 flex overflow-hidden">
                       <div className="w-1/3 bg-slate-950 border-r border-slate-800"></div>
                       <div className="w-2/3 bg-slate-900"></div>
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Theme Colors — only available in Light Mode */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-foreground">Theme Colors</label>
                  {settings.themeMode === 'dark' && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      <Lock className="h-2.5 w-2.5" /> Dark Mode
                    </span>
                  )}
                </div>

                {settings.themeMode === 'dark' ? (
                  // Locked state in dark mode
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border bg-muted/50">
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Fixed blue accent is applied in Dark Mode. Switch to Light Mode to customize colors.
                    </span>
                  </div>
                ) : (
                  // Color pickers in light mode
                  <div className="flex items-center gap-3">
                    <ColorCircle color="#F4EBD0" selected={settings.themeColor === '#F4EBD0'} onClick={() => updateSetting('themeColor', '#F4EBD0')} />
                    <ColorCircle color="#D6AD60" selected={settings.themeColor === '#D6AD60'} onClick={() => updateSetting('themeColor', '#D6AD60')} />
                    <ColorCircle color="#122620" selected={settings.themeColor === '#122620'} onClick={() => updateSetting('themeColor', '#122620')} />
                    
                    <div className="w-px h-6 bg-border/60 mx-1"></div>
                    
                    <div className={`relative h-6 w-6 rounded-full overflow-hidden shadow-sm cursor-pointer transition-transform ${!['#F4EBD0', '#D6AD60', '#122620'].includes(settings.themeColor) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'border border-border hover:scale-110'}`}>
                      <input 
                        type="color" 
                        value={settings.themeColor} 
                        onChange={(e) => updateSetting('themeColor', e.target.value)}
                        className="absolute -top-2 -left-2 h-10 w-10 cursor-pointer"
                        title="Pick Custom Theme Color"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Settings */}
              <div className="pt-4 space-y-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-foreground">Sidebar Color</span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">Custom color for the sidebar background.</span>
                  </div>
                  {settings.themeMode === 'dark' ? (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      <Lock className="h-2.5 w-2.5" /> Dark Mode
                    </span>
                  ) : (
                    <div className="flex items-center gap-3">
                      {settings.sidebarColor && (
                        <button 
                          onClick={() => updateSetting('sidebarColor', '')}
                          className="text-[11px] text-muted-foreground hover:text-foreground underline transition-colors"
                        >
                          Reset
                        </button>
                      )}
                      <div className="relative h-7 w-7 rounded-full overflow-hidden border-2 border-border shadow-sm cursor-pointer hover:scale-110 transition-transform">
                        <input 
                          type="color" 
                          value={settings.sidebarColor || '#12261E'} 
                          onChange={(e) => updateSetting('sidebarColor', e.target.value)}
                          className="absolute -top-2 -left-2 h-12 w-12 cursor-pointer"
                          title="Pick Custom Color"
                        />
                      </div>
                    </div>
                  )}
                </div>

                 <Toggle 
                   label="Collapse Sidebar" 
                   description="Minimize sidebar to icons only." 
                   checked={settings.collapseSidebar} 
                   onChange={(val) => updateSetting('collapseSidebar', val)} 
                 />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* --- SECTION 2: NOTIFICATIONS --- */}
          <Card className="border-primary/20 shadow-sm rounded-xl overflow-hidden bg-card/90 backdrop-blur-md">
            <CardHeader className="pb-3 pt-5 px-5 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2 font-semibold text-foreground">
                <Bell className="h-4 w-4 text-primary" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <Toggle label="Inquiry Notifications" checked={settings.inquiryAlerts} onChange={(val) => updateSetting('inquiryAlerts', val)} />
              <div className="h-px bg-border/50 my-1"></div>
              <Toggle label="Booking Alerts" checked={settings.bookingAlerts} onChange={(val) => updateSetting('bookingAlerts', val)} />
            </CardContent>
          </Card>

          {/* --- SECTION 4: SYSTEM --- */}
          <Card className="border-primary/20 shadow-sm rounded-xl overflow-hidden bg-card/90 backdrop-blur-md">
            <CardHeader className="pb-3 pt-5 px-5 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2 font-semibold text-foreground">
                <Monitor className="h-4 w-4 text-primary" /> System
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Currency</label>
                <Select value={settings.currency} onValueChange={(val) => updateSetting('currency', val)}>
                  <SelectTrigger className="bg-background h-8 text-[12px] border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr" className="text-[12px]">INR (₹)</SelectItem>
                    <SelectItem value="usd" className="text-[12px]">USD ($)</SelectItem>
                    <SelectItem value="eur" className="text-[12px]">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Timezone</label>
                <Select value={settings.timezone} onValueChange={(val) => updateSetting('timezone', val)}>
                  <SelectTrigger className="bg-background h-8 text-[12px] border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist" className="text-[12px]">Asia/Kolkata</SelectItem>
                    <SelectItem value="utc" className="text-[12px]">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date Format</label>
                <Select value={settings.dateFormat} onValueChange={(val) => updateSetting('dateFormat', val)}>
                  <SelectTrigger className="bg-background h-8 text-[12px] border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ddmm" className="text-[12px]">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mmdd" className="text-[12px]">MM/DD/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>

      {/* --- BOTTOM ACTION BAR --- */}
      <div className="sticky bottom-0 -mx-5 sm:-mx-7 mt-8 p-4 bg-background/90 backdrop-blur-md border-t border-border z-10 flex items-center justify-end gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-all">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-lg border-border hover:bg-muted text-foreground transition-all text-xs h-9"
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all settings to default?")) {
               resetSettings();
               toast({ title: "Settings Reset", description: "All settings have been restored to defaults." });
            }
          }}
        >
          Reset Settings
        </Button>
        <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all text-xs h-9">
          Save Changes
        </Button>
      </div>

    </div>
  );
}
