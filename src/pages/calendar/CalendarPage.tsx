import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AvailabilitySlot, MeetingRequest } from '../../data/meetings';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useMeetings } from '../../context/MeetingsContext';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const { slots, requests, addSlot, addRequest, acceptRequest, declineRequest } = useMeetings();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];
  const selectedDateStr = formatDate(selectedDate);

  const slotsForSelectedDate = slots.filter(
    (slot) => slot.date === selectedDateStr
  );

  const isInvestor = user?.role === 'investor';

  const handleRequestMeeting = (slot: AvailabilitySlot) => {
    const newRequest: MeetingRequest = {
      id: `req-${Date.now()}`,
      slotId: slot.id,
      requesterId: user?.id || 'unknown',
      requesterName: user?.name || 'You',
      receiverId: slot.userId,
      receiverName: slot.userName,
      status: 'pending',
      message: 'Meeting request sent.',
      createdAt: new Date().toISOString().split('T')[0],
    };
    addRequest(newRequest);
    alert('Meeting request sent! Waiting for confirmation.');
  };

  const handleAddSlot = () => {
    if (!startTime || !endTime) {
      alert('Please enter both start and end time.');
      return;
    }
    if (startTime >= endTime) {
      alert('End time must be after start time.');
      return;
    }

    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      userId: user?.id || 'unknown',
      userName: user?.name || 'You',
      date: selectedDateStr,
      startTime,
      endTime,
      isBooked: false,
    };

    addSlot(newSlot);
    setStartTime('');
    setEndTime('');
    setShowAddForm(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting Calendar</h1>
      <p className="text-gray-600 mb-6">View availability and schedule meetings</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            className="w-full border-none"
          />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Availability on {selectedDate.toDateString()}
            </h2>

            {isInvestor && (
              <Button size="sm" variant="outline" onClick={() => setShowAddForm((prev) => !prev)}>
                {showAddForm ? 'Cancel' : '+ Add Slot'}
              </Button>
            )}
          </div>

          {isInvestor && showAddForm && (
            <div className="border border-gray-200 rounded-md p-3 mb-4 bg-gray-50">
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-600 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <Button size="sm" onClick={handleAddSlot}>
                Save Slot
              </Button>
            </div>
          )}

          {slotsForSelectedDate.length === 0 ? (
            <p className="text-gray-500">No slots available on this date.</p>
          ) : (
            <div className="space-y-3">
              {slotsForSelectedDate.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between border border-gray-200 rounded-md p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{slot.userName}</p>
                    <p className="text-sm text-gray-600">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>

                  {slot.isBooked ? (
                    <span className="text-sm text-secondary-600 font-medium">Booked</span>
                  ) : isInvestor ? (
                    <span className="text-sm text-gray-500">Available</span>
                  ) : (
                    <Button size="sm" onClick={() => handleRequestMeeting(slot)}>
                      Request
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">Your Meeting Requests</h2>
        <div className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-gray-500">No meeting requests yet.</p>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between border border-gray-200 rounded-md p-3"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {req.requesterName} → {req.receiverName}
                  </p>
                  <p className="text-sm text-gray-600">{req.message}</p>
                </div>

                {req.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="success" onClick={() => acceptRequest(req.id)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="error" onClick={() => declineRequest(req.id)}>
                      Decline
                    </Button>
                  </div>
                ) : (
                  <span
                    className={`text-sm font-medium capitalize ${
                      req.status === 'accepted' ? 'text-secondary-600' : 'text-error-500'
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};