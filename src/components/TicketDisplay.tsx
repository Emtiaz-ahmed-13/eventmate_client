"use client";

import { QRCodeSVG } from 'qrcode.react';
import { Ticket, Calendar, MapPin, User } from 'lucide-react';

interface TicketProps {
  eventName: string;
  userName: string;
  date: string;
  location: string;
  ticketId: string;
}

export const TicketDisplay = ({ eventName, userName, date, location, ticketId }: TicketProps) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto">
      <div className="bg-blue-600 p-4 text-white flex items-center gap-2">
        <Ticket className="w-6 h-6" />
        <h3 className="font-bold text-lg">Event Ticket</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
            {eventName}
          </h2>
          <p className="text-zinc-500 text-sm flex items-center gap-1">
            <User className="w-3 h-3" /> {userName}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-sm">{new Date(date).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <QRCodeSVG value={ticketId} size={150} level="H" includeMargin />
          <p className="mt-4 text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
            Ticket ID: {ticketId}
          </p>
        </div>
        
        <p className="text-center text-xs text-zinc-400">
          Show this QR code at the entrance for verification.
        </p>
      </div>
      
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 text-center border-t border-zinc-100 dark:border-zinc-800">
        <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">
          Powered by EventMate
        </p>
      </div>
    </div>
  );
};
