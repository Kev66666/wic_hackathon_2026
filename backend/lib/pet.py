# backend/lib/pet.py

def apply_level_up(pet: dict):
    gained = pet["xp"] // 100
    if gained > 0:
        pet["level"] += gained
        pet["xp"] = pet["xp"] % 100


def add_snack(pet: dict):
    pet["snacks"] += 1
    return pet


def feed_pet(pet: dict):
    if pet["snacks"] <= 0:
        raise ValueError("No snacks")

    pet["snacks"] -= 1
    pet["xp"] += 5
    apply_level_up(pet)
    return pet
