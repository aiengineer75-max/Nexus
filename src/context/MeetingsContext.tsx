import React, { createContext, useState, useContext, useEffect } from 'react';
import { availabilitySlots as initialSlots, meetingRequests as initialRequests, AvailabilitySlot, MeetingRequest } from '../data/meetings';

interface MeetingsContextType {
  slots: AvailabilitySlot[];
  requests: MeetingRequest[];
  addSlot: (slot: AvailabilitySlot) => void;
  addRequest: (request: MeetingRequest) => void;
  acceptRequest: (reqId: string) => void;
  declineRequest: (reqId: string) => void;
}

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

const SLOTS_KEY = 'business_nexus_slots';
const REQUESTS_KEY = 'business_nexus_requests';

export const MeetingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(() => {
    const stored = localStorage.getItem(SLOTS_KEY);
    return stored ? JSON.parse(stored) : initialSlots;
  });

  const [requests, setRequests] = useState<MeetingRequest[]>(() => {
    const stored = localStorage.getItem(REQUESTS_KEY);
    return stored ? JSON.parse(stored) : initialRequests;
  });

  // Jab bhi slots/requests change hon, localStorage mein save karo
  useEffect(() => {
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  }, [requests]);

  const addSlot = (slot: AvailabilitySlot) => {
    setSlots((prev) => [...prev, slot]);
  };

  const addRequest = (request: MeetingRequest) => {
    setRequests((prev) => [...prev, request]);
  };

  const acceptRequest = (reqId: string) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'accepted' } : r))
    );
    setSlots((prev) =>
      prev.map((s) => (s.id === req.slotId ? { ...s, isBooked: true } : s))
    );
  };

  const declineRequest = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'declined' } : r))
    );
  };

  const value = {
    slots,
    requests,
    addSlot,
    addRequest,
    acceptRequest,
    declineRequest,
  };

  return <MeetingsContext.Provider value={value}>{children}</MeetingsContext.Provider>;
};

export const useMeetings = (): MeetingsContextType => {
  const context = useContext(MeetingsContext);
  if (context === undefined) {
    throw new Error('useMeetings must be used within a MeetingsProvider');
  }
  return context;
};