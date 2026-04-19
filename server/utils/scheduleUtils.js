const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const findOverlapSlots = (availabilityA, availabilityB) => {
  const overlap = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (const day of days) {
    const slotsA = availabilityA.filter((s) => s.day === day);
    const slotsB = availabilityB.filter((s) => s.day === day);

    for (const slotA of slotsA) {
      for (const slotB of slotsB) {
        const overlapStart = Math.max(timeToMinutes(slotA.startTime), timeToMinutes(slotB.startTime));
        const overlapEnd = Math.min(timeToMinutes(slotA.endTime), timeToMinutes(slotB.endTime));

        if (overlapEnd - overlapStart >= 120) {
          overlap.push({ day, startTime: minutesToTime(overlapStart), endTime: minutesToTime(overlapEnd) });
        }
      }
    }
  }
  return overlap;
};

module.exports = { findOverlapSlots };