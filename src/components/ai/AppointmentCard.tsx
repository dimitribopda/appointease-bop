import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatFCFA } from "@/lib/mock-data";
import type { MockAppointment } from "@/mock/aiBookings";

/** Carte rendez-vous affichée dans le chat IA */
export function AppointmentCard({ appointment }: { appointment: MockAppointment }) {
  const cancelled = appointment.status === "cancelled";
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border bg-white/60 p-3 shadow-soft backdrop-blur-md dark:bg-white/5 ${
        cancelled
          ? "border-red-300/40 opacity-70 dark:border-red-500/30"
          : "border-white/30 dark:border-white/10"
      }`}
    >
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white ${
          cancelled ? "bg-red-500/80" : "bg-gradient-to-br from-[#6B2D8E] to-[#F5A623]"
        }`}
      >
        {cancelled ? <XCircle className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-bold ${cancelled ? "line-through" : ""}`}>
          {appointment.providerName}
        </p>
        <p className="truncate text-xs text-muted-foreground">{appointment.service}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {appointment.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {appointment.time}
          </span>
          <span className="font-semibold text-foreground">{formatFCFA(appointment.price)}</span>
        </div>
      </div>
      {!cancelled && (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
      )}
    </div>
  );
}
