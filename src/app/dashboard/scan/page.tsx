"use client";

import { useEffect, useState, Suspense } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EventServices } from "@/services/event.service";

function ScannerContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText: string) {
      scanner.clear();
      setIsScanning(false);
      handleVerify(decodedText);
    }

    function onScanFailure(error: any) {
      // Quietly fail
    }

    return () => {
      scanner.clear().catch(e => console.error(e));
    };
  }, [eventId]);

  const handleVerify = async (ticketId: string) => {
    if (!eventId) return;
    setIsLoading(true);
    try {
      const result = await EventServices.verifyTicket(eventId, ticketId);
      setScanResult(result);
      if (result.alreadyCheckedIn) {
        toast.warning("Participant already checked in!");
      } else {
        toast.success("Ticket verified!");
      }
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      setScanResult({ success: false });
    } finally {
      setIsLoading(false);
    }
  };

  if (!eventId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">No Event Selected</h1>
        <p className="text-zinc-500 mt-2">Please go to your event dashboard and click "Scan Tickets".</p>
        <Link href="/dashboard" className="mt-6 text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard`} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Ticket Scanner</h1>
      </div>

      {isScanning ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-lg p-4">
            <div id="reader" className="w-full"></div>
          </div>
          <p className="text-center text-sm text-zinc-500">
            Align the QR code within the frame to scan.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-lg text-center space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="font-medium text-zinc-600">Verifying ticket...</p>
            </div>
          ) : scanResult ? (
            <div className="space-y-6">
              {scanResult.success || scanResult.alreadyCheckedIn ? (
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
              ) : (
                <XCircle className="w-20 h-20 text-red-500 mx-auto" />
              )}
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold">
                  {scanResult.alreadyCheckedIn ? "Already Checked In" : scanResult.success ? "Verified Successfully" : "Invalid Ticket"}
                </h2>
                {scanResult.participant && (
                  <p className="text-zinc-500">Participant: <span className="text-zinc-900 dark:text-zinc-100 font-medium">{scanResult.participant.name}</span></p>
                )}
              </div>

              <button
                onClick={() => {
                  setScanResult(null);
                  setIsScanning(true);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Scan Next
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
      <ScannerContent />
    </Suspense>
  );
}
