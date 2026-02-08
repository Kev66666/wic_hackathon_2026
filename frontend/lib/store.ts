// frontend/lib/store.ts

export type RoomEvent = {
  id: string;
  type: "message" | "photo";
  text?: string;
  createdAt: number;
  sender: "me" | "partner";
};

export type PetState = {
  xp: number;
  level: number;
  snacks: number;
};

const eventsKey = (relationshipId: string) => `events:${relationshipId}`;
const petKey = (relationshipId: string) => `pet:${relationshipId}`;

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/* ---------------------------
   Events
---------------------------- */

export function getEvents(relationshipId: string): RoomEvent[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(eventsKey(relationshipId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RoomEvent[];
  } catch {
    return [];
  }
}

function saveEvents(relationshipId: string, events: RoomEvent[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(eventsKey(relationshipId), JSON.stringify(events));
}

export function addMessage(relationshipId: string, event: RoomEvent) {
  const prev = getEvents(relationshipId);
  const next = [...prev, event];
  saveEvents(relationshipId, next);

  // ✅ 规则：每新增一条聊天记录 -> snacks +1
  rewardSnackOnMessage(relationshipId);
}

/* ---------------------------
   Pet
---------------------------- */

function defaultPet(): PetState {
  return { xp: 0, level: 1, snacks: 0 };
}

export function getPet(relationshipId: string): PetState {
  if (!canUseStorage()) return defaultPet();

  const raw = localStorage.getItem(petKey(relationshipId));
  if (!raw) {
    const init = defaultPet();
    localStorage.setItem(petKey(relationshipId), JSON.stringify(init));
    return init;
  }

  try {
    return JSON.parse(raw) as PetState;
  } catch {
    const init = defaultPet();
    localStorage.setItem(petKey(relationshipId), JSON.stringify(init));
    return init;
  }
}

function savePet(relationshipId: string, pet: PetState) {
  if (!canUseStorage()) return;
  localStorage.setItem(petKey(relationshipId), JSON.stringify(pet));
}

function applyLevelUp(pet: PetState): PetState {
  const gained = Math.floor(pet.xp / 100);
  if (gained <= 0) return pet;
  return { ...pet, level: pet.level + gained, xp: pet.xp % 100 };
}

export function rewardSnackOnMessage(relationshipId: string): PetState {
  const pet = getPet(relationshipId);
  const next = { ...pet, snacks: pet.snacks + 1 };
  savePet(relationshipId, next);
  return next;
}

export function feedPet(relationshipId: string): PetState | null {
  const pet = getPet(relationshipId);
  if (pet.snacks <= 0) return null;

  const next = applyLevelUp({ ...pet, snacks: pet.snacks - 1, xp: pet.xp + 5 });
  savePet(relationshipId, next);
  return next;
}
