export type EventType = "message" | "photo";

export type PetState = {
  xp: number;
  level: number;
  snacks: number;
};

export type RoomEvent = {
  id: string;
  type: EventType;
  text?: string;
  createdAt: number;
};

let pet: PetState = { xp: 0, level: 1, snacks: 0 };
let events: RoomEvent[] = [];

function recalcLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export function getPet() {
  return pet;
}

export function getEvents() {
  return events;
}

export function addMessage(text: string) {
  const e: RoomEvent = {
    id: crypto.randomUUID(),
    type: "message",
    text,
    createdAt: Date.now(),
  };
  events = [e, ...events];

  // 奖励规则：发消息 -> +1 零食, +5 XP
  pet = {
    ...pet,
    snacks: pet.snacks + 1,
    xp: pet.xp + 5,
  };
  pet.level = recalcLevel(pet.xp);

  return { event: e, pet };
}
