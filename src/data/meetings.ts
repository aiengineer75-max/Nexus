export interface AvailabilitySlot {
  id: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface MeetingRequest {
  id: string;
  slotId: string;
  requesterId: string;
  requesterName: string;
  receiverId: string;
  receiverName: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
}

// Dummy availability slots (Investor side sy set ki hui)
export const availabilitySlots: AvailabilitySlot[] = [
  {
    id: 'slot-1',
    userId: 'i1',
    userName: 'Michael Rodriguez',
    date: '2026-07-15',
    startTime: '14:00',
    endTime: '15:00',
    isBooked: false,
  },
  {
    id: 'slot-2',
    userId: 'i1',
    userName: 'Michael Rodriguez',
    date: '2026-07-16',
    startTime: '10:00',
    endTime: '11:00',
    isBooked: false,
  },
  {
    id: 'slot-3',
    userId: 'i2',
    userName: 'Jennifer Lee',
    date: '2026-07-17',
    startTime: '16:00',
    endTime: '17:00',
    isBooked: true,
  },
];

// Dummy meeting requests
export const meetingRequests: MeetingRequest[] = [
  {
    id: 'req-1',
    slotId: 'slot-3',
    requesterId: 'e1',
    requesterName: 'Sarah Johnson',
    receiverId: 'i2',
    receiverName: 'Jennifer Lee',
    status: 'accepted',
    message: 'Would love to discuss the TechWave AI platform.',
    createdAt: '2026-07-10',
  },
];