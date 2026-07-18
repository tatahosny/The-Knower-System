import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useCollection, add, update, remove } from "@/mocks/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export default function CalendarPage() {
  const { t } = useTranslation();
  const meetings = useCollection("meetings");
  const projects = useCollection("projects");
  const user = useAuth((s) => s.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{ start: string; end: string } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_id: "none",
    type: "meeting", // meeting, deadline, event
  });

  const events = meetings?.map((m: any) => ({
    id: String(m.id),
    title: m.title,
    start: m.start_time,
    end: m.end_time,
    extendedProps: {
      description: m.description,
      project_id: m.project_id,
    },
    backgroundColor: m.project_id ? "var(--primary)" : "var(--chart-2)",
  })) || [];

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });
    setFormData({ ...formData, title: "", description: "" });
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      remove("meetings", clickInfo.event.id).then(() => {
        toast.success("Event deleted");
      });
    }
  };

  const handleSaveEvent = async () => {
    if (!formData.title) return toast.error("Title is required");
    
    try {
      await add("meetings", {
        title: formData.title,
        description: formData.description,
        project_id: formData.project_id === "none" ? null : Number(formData.project_id),
        start_time: selectedDate?.start,
        end_time: selectedDate?.end,
        user_id: user?.id,
        status: "scheduled"
      });
      toast.success("Event added successfully");
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Failed to add event");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Manage your meetings, project deadlines, and team events."
      />

      <div className="rounded-xl border border-border bg-card p-5">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={(info) => {
            update("meetings", info.event.id, {
              start_time: info.event.startStr,
              end_time: info.event.endStr || info.event.startStr,
            });
            toast.success("Event rescheduled");
          }}
          height="auto"
          themeSystem="standard"
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder="Client meeting..."
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Optional description"
              />
            </div>
            <div className="space-y-2">
              <Label>Related Project (Optional)</Label>
              <Select value={formData.project_id} onValueChange={(v) => setFormData({...formData, project_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project</SelectItem>
                  {projects?.map((p: any) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
