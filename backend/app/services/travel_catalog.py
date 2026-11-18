"""
Travel Catalog: Curated accommodations, vehicle/transport options, and place activities.
Provides real-world hotel tariffs, private vs rental vehicle calculations, and attraction activity pricing.
"""

from typing import Dict, Any, List, Optional
import math

# ─── Stays Catalog for 20 Indian Destinations ─────────────────────────────────

DESTINATION_STAYS: Dict[str, Dict[str, Dict[str, Any]]] = {
    "Manali": {
        "Budget": {
            "name": "The Hosteller Manali (Old Manali)",
            "tariff": 850,
            "rating": 4.6,
            "type": "Backpacker Hostel & Cafe",
            "location": "Old Manali, near Manu Temple",
        },
        "Standard": {
            "name": "Snow Valley Resorts & Spa",
            "tariff": 2600,
            "rating": 4.5,
            "type": "4-Star Alpine Resort",
            "location": "Log Huts Area, Manali",
        },
        "Luxury": {
            "name": "The Himalayan Castle & Luxury Cottages",
            "tariff": 7800,
            "rating": 4.8,
            "type": "5-Star Victorian Castle Resort",
            "location": "Hadimba Road, Manali",
        },
    },
    "Goa": {
        "Budget": {
            "name": "Zostel Goa / The Hosteller Calangute",
            "tariff": 900,
            "rating": 4.5,
            "type": "Social Backpacker Hostel",
            "location": "Calangute-Baga Strip",
        },
        "Standard": {
            "name": "Fairfield by Marriott Goa Anjuna",
            "tariff": 3200,
            "rating": 4.4,
            "type": "4-Star Modern Hotel",
            "location": "Anjuna, North Goa",
        },
        "Luxury": {
            "name": "Taj Exotica Resort & Spa",
            "tariff": 9500,
            "rating": 4.9,
            "type": "5-Star Mediterranean Beachfront Resort",
            "location": "Benaulim, South Goa",
        },
    },
    "Rishikesh": {
        "Budget": {
            "name": "Live Free Hostel Rishikesh",
            "tariff": 750,
            "rating": 4.6,
            "type": "Riverside Backpacker Hostel",
            "location": "Tapovan, Rishikesh",
        },
        "Standard": {
            "name": "Aloha On The Ganges",
            "tariff": 2800,
            "rating": 4.5,
            "type": "4-Star Ganges View Resort",
            "location": "Tapovan, near Laxman Jhula",
        },
        "Luxury": {
            "name": "Ananda in the Himalayas",
            "tariff": 12000,
            "rating": 4.9,
            "type": "World-Class Luxury Wellness Palace",
            "location": "Palace Estate, Narendra Nagar",
        },
    },
    "Jaipur": {
        "Budget": {
            "name": "Moustache Hostel Jaipur",
            "tariff": 700,
            "rating": 4.6,
            "type": "Heritage Hostel with Rooftop",
            "location": "MI Road, Pink City",
        },
        "Standard": {
            "name": "Umaid Bhawan Heritage House Hotel",
            "tariff": 2500,
            "rating": 4.5,
            "type": "Traditional Rajput Haveli Hotel",
            "location": "Bani Park, Jaipur",
        },
        "Luxury": {
            "name": "Rambagh Palace (Taj Luxury Heritage)",
            "tariff": 11500,
            "rating": 4.9,
            "type": "Former Royal Residence & 5-Star Palace",
            "location": "Bhawani Singh Road, Jaipur",
        },
    },
    "Udaipur": {
        "Budget": {
            "name": "Moustache Udaipur / Bunkyard Lake Hostel",
            "tariff": 800,
            "rating": 4.6,
            "type": "Lakeside Backpacker Hostel",
            "location": "Lal Ghat, Lake Pichola",
        },
        "Standard": {
            "name": "Hotel Lakend Udaipur",
            "tariff": 3000,
            "rating": 4.5,
            "type": "4-Star Fatehsagar Waterfront Hotel",
            "location": "Fateh Sagar Lake, Udaipur",
        },
        "Luxury": {
            "name": "The Leela Palace Udaipur",
            "tariff": 14000,
            "rating": 4.9,
            "type": "5-Star Ultra-Luxury Palace on Pichola",
            "location": "Lake Pichola West Bank",
        },
    },
    "Kerala Backwaters": {
        "Budget": {
            "name": "Alleppey Beach Garden Homestay",
            "tariff": 850,
            "rating": 4.4,
            "type": "Traditional Kerala Homestay",
            "location": "Alappuzha Beach Coast",
        },
        "Standard": {
            "name": "Lake Palace Resort Alleppey",
            "tariff": 3400,
            "rating": 4.5,
            "type": "Waterfront Island Resort",
            "location": "Thirumala Ward, Alappuzha",
        },
        "Luxury": {
            "name": "Kumarakom Lake Resort",
            "tariff": 9800,
            "rating": 4.9,
            "type": "5-Star Heritage Luxury Canal Retreat",
            "location": "Vembanad Lake, Kumarakom",
        },
    },
    "Leh Ladakh": {
        "Budget": {
            "name": "Raybo Hostel Leh",
            "tariff": 900,
            "rating": 4.6,
            "type": "Himalayan Backpacker Base",
            "location": "Upper Changspa Road, Leh",
        },
        "Standard": {
            "name": "The Grand Dragon Ladakh",
            "tariff": 4200,
            "rating": 4.6,
            "type": "Eco-Friendly 4-Star Mountain Hotel",
            "location": "Sheynam, Old Road, Leh",
        },
        "Luxury": {
            "name": "The Chamba Camp Thiksey",
            "tariff": 13500,
            "rating": 4.9,
            "type": "Glamping Luxury Tented Palace",
            "location": "Thiksey Monastery Foothills",
        },
    },
    "Agra": {
        "Budget": {
            "name": "Joey's Hostel Agra (Taj View)",
            "tariff": 650,
            "rating": 4.5,
            "type": "Taj Mahal View Hostel",
            "location": "Taj East Gate Road, Agra",
        },
        "Standard": {
            "name": "Crystal Sarovar Premiere Agra",
            "tariff": 2400,
            "rating": 4.4,
            "type": "4-Star Hotel with Taj View Pool",
            "location": "Fatehabad Road, Agra",
        },
        "Luxury": {
            "name": "The Oberoi Amarvilas",
            "tariff": 12500,
            "rating": 4.9,
            "type": "5-Star Luxury Resort Facing Taj Mahal",
            "location": "Taj East Gate Road, Agra",
        },
    },
    "Mumbai": {
        "Budget": {
            "name": "Cohostel / Zostel Mumbai",
            "tariff": 1100,
            "rating": 4.4,
            "type": "Boutique Urban Hostel",
            "location": "Bandra West, Mumbai",
        },
        "Standard": {
            "name": "Trident Hotel Nariman Point",
            "tariff": 4500,
            "rating": 4.6,
            "type": "Marine Drive View 4-Star Hotel",
            "location": "Marine Drive, South Mumbai",
        },
        "Luxury": {
            "name": "The Taj Mahal Palace & Tower",
            "tariff": 13000,
            "rating": 4.9,
            "type": "Iconic 1903 Landmark 5-Star Hotel",
            "location": "Colaba Waterfront, Mumbai",
        },
    },
    "Varanasi": {
        "Budget": {
            "name": "Stops Hostel Varanasi",
            "tariff": 700,
            "rating": 4.5,
            "type": "Heritage Ghat Hostel",
            "location": "Bhadaini, near Assi Ghat",
        },
        "Standard": {
            "name": "BrijRama Palace Heritage Hotel",
            "tariff": 3800,
            "rating": 4.7,
            "type": "18th-Century Historical Palace on Ghat",
            "location": "Darbhanga Ghat, Varanasi",
        },
        "Luxury": {
            "name": "Taj Nadesar Palace",
            "tariff": 10500,
            "rating": 4.9,
            "type": "Royal Palace of the Maharaja of Benares",
            "location": "Nadesar Palace Grounds",
        },
    },
    "Andaman Islands": {
        "Budget": {
            "name": "Emerald Gecko Resort Havelock",
            "tariff": 1200,
            "rating": 4.4,
            "type": "Eco Beach Bamboo Huts",
            "location": "Vijay Nagar Beach, Havelock",
        },
        "Standard": {
            "name": "Symphony Palms Beach Resort",
            "tariff": 3800,
            "rating": 4.5,
            "type": "Oceanfront Cottage Resort",
            "location": "Govind Nagar Beach, Havelock",
        },
        "Luxury": {
            "name": "Taj Exotica Resort & Spa Andamans",
            "tariff": 14000,
            "rating": 4.9,
            "type": "5-Star Luxury Villas on Radhanagar",
            "location": "Radhanagar Beach No. 7, Havelock",
        },
    },
    "Coorg": {
        "Budget": {
            "name": "Coffee Country Homestay Coorg",
            "tariff": 950,
            "rating": 4.5,
            "type": "Plantation Estate Homestay",
            "location": "Madikeri, Coorg",
        },
        "Standard": {
            "name": "Heritage Resort Coorg",
            "tariff": 3200,
            "rating": 4.5,
            "type": "Hilltop Coffee Estate Cottages",
            "location": "Galibeedu, Madikeri",
        },
        "Luxury": {
            "name": "The Tamara Coorg",
            "tariff": 9200,
            "rating": 4.9,
            "type": "5-Star Luxury Eco-Resort in Rainforest",
            "location": "Kabbinakad Estate, Yavakapadi",
        },
    },
    "Darjeeling": {
        "Budget": {
            "name": "Hideout Travel Cafe & Hostel",
            "tariff": 800,
            "rating": 4.5,
            "type": "Panoramic Mountain View Hostel",
            "location": "HD Lama Road, Darjeeling",
        },
        "Standard": {
            "name": "Windamere Hotel (Colonial Heritage)",
            "tariff": 3100,
            "rating": 4.6,
            "type": "Historic Colonial Estate on Observatory Hill",
            "location": "Observatory Hill, Darjeeling",
        },
        "Luxury": {
            "name": "Glenburn Tea Estate & Boutique Hotel",
            "tariff": 11000,
            "rating": 4.9,
            "type": "Exclusive Luxury Tea Planter's Bungalow",
            "location": "Glenburn Tea Estate, Darjeeling",
        },
    },
    "Hampi": {
        "Budget": {
            "name": "Rocky Guesthouse & Cafe",
            "tariff": 750,
            "rating": 4.5,
            "type": "Hippie Island Riverside Guesthouse",
            "location": "Sanapur / Hampi Island",
        },
        "Standard": {
            "name": "Heritage Resort Hampi",
            "tariff": 2800,
            "rating": 4.5,
            "type": "Heritage Cottages near Vijayanagara Ruins",
            "location": "Hosapete Road, Hampi",
        },
        "Luxury": {
            "name": "Evolve Back Kamalapura Palace",
            "tariff": 10500,
            "rating": 4.9,
            "type": "5-Star Fort-Palace Inspired by Vijayanagara",
            "location": "Kamalapura, Hampi",
        },
    },
    "Jaisalmer": {
        "Budget": {
            "name": "Mystic Jaisalmer Hotel & Rooftop",
            "tariff": 750,
            "rating": 4.6,
            "type": "Sandstone Haveli Hostel with Fort View",
            "location": "Airforce Road, Jaisalmer",
        },
        "Standard": {
            "name": "Hotel Rang Mahal Jaisalmer",
            "tariff": 2700,
            "rating": 4.5,
            "type": "Yellow Sandstone Palace Hotel",
            "location": "Sam Road, Jaisalmer",
        },
        "Luxury": {
            "name": "Suryagarh Jaisalmer",
            "tariff": 11500,
            "rating": 4.9,
            "type": "5-Star Desert Fort Resort in Thar",
            "location": "Kahala Phata, Sam Road",
        },
    },
    "Munnar": {
        "Budget": {
            "name": "Munnar Black Forest Resort & Hostel",
            "tariff": 850,
            "rating": 4.4,
            "type": "Tea Valley Eco Lodge",
            "location": "Chithirapuram, Munnar",
        },
        "Standard": {
            "name": "Tea County Munnar (KTDC)",
            "tariff": 2900,
            "rating": 4.5,
            "type": "Valley-View Colonial Cottages",
            "location": "KTDC Hill, Munnar",
        },
        "Luxury": {
            "name": "Spice Tree Munnar",
            "tariff": 8800,
            "rating": 4.9,
            "type": "5-Star Mountain Resort & Spa",
            "location": "Muttukad-Periakanal Road, Munnar",
        },
    },
    "Ooty": {
        "Budget": {
            "name": "Reflections Guest House Ooty",
            "tariff": 800,
            "rating": 4.4,
            "type": "Lakeside Backpacker Lodge",
            "location": "North Lake Road, Ooty",
        },
        "Standard": {
            "name": "Savoy - IHCL SeleQtions (Taj Heritage)",
            "tariff": 3400,
            "rating": 4.6,
            "type": "180-Year-Old English Colonial Hotel",
            "location": "Sylks Road, Ooty",
        },
        "Luxury": {
            "name": "Fernhills Royal Palace Ooty",
            "tariff": 8200,
            "rating": 4.8,
            "type": "Summer Palace of the Maharajas of Mysore",
            "location": "Fernhill Post, Ooty",
        },
    },
    "Spiti Valley": {
        "Budget": {
            "name": "Zostel Spiti (Kaza)",
            "tariff": 900,
            "rating": 4.7,
            "type": "Highest Social Backpacker Hostel",
            "location": "Kaza Main Market, Spiti",
        },
        "Standard": {
            "name": "Hotel Deyzor Kaza",
            "tariff": 3100,
            "rating": 4.7,
            "type": "Renowned Boutique Himalayan Hotel",
            "location": "Near Kaza Petrol Pump",
        },
        "Luxury": {
            "name": "Spiti Heritage Himalayan Camp",
            "tariff": 6500,
            "rating": 4.7,
            "type": "Deluxe Heated Luxury Swiss Tents",
            "location": "Rangrik Village, Spiti Valley",
        },
    },
    "Kolkata": {
        "Budget": {
            "name": "Broadway Hotel / Central Bnb",
            "tariff": 900,
            "rating": 4.3,
            "type": "Heritage City Hostel",
            "location": "Ganesh Chandra Ave, Central Kolkata",
        },
        "Standard": {
            "name": "The Peerless Inn Kolkata",
            "tariff": 2800,
            "rating": 4.4,
            "type": "4-Star Esplanade City Hotel",
            "location": "Chowringhee, Esplanade",
        },
        "Luxury": {
            "name": "The Oberoi Grand Kolkata",
            "tariff": 9500,
            "rating": 4.9,
            "type": "1880 Grande Dame 5-Star Heritage Hotel",
            "location": "Jawaharlal Nehru Road, New Market",
        },
    },
    "Mysore": {
        "Budget": {
            "name": "Mansion 1907 Heritage Hostel",
            "tariff": 750,
            "rating": 4.6,
            "type": "100-Year-Old Mysore Villa Hostel",
            "location": "Nazarbad, Mysore",
        },
        "Standard": {
            "name": "Radisson Blu Plaza Hotel Mysore",
            "tariff": 3200,
            "rating": 4.6,
            "type": "4-Star Hotel overlooking Chamundi Hills",
            "location": "MG Road, Mysore",
        },
        "Luxury": {
            "name": "Lalitha Mahal Palace Hotel",
            "tariff": 8000,
            "rating": 4.8,
            "type": "Pure White Italian Marble Royal Palace",
            "location": "Lalitha Mahal Nagar, Mysore",
        },
    },
}

# Fallback default stays if destination not explicitly configured
DEFAULT_STAYS = {
    "Budget": {
        "name": "Curated Backpacker Inn & Homestay",
        "tariff": 800,
        "rating": 4.4,
        "type": "Budget Homestay / Hostel",
        "location": "City Centre / Tourist Zone",
    },
    "Standard": {
        "name": "Comfort City Centre 3-4★ Hotel",
        "tariff": 2600,
        "rating": 4.5,
        "type": "Premium Boutique Hotel",
        "location": "Central Tourist Hub",
    },
    "Luxury": {
        "name": "Heritage Palace & Luxury Spa Resort",
        "tariff": 7500,
        "rating": 4.8,
        "type": "5-Star Luxury Resort",
        "location": "Prime Scenic Location",
    },
}


# ─── Vehicle & Transport Catalog (Private vs Rental) ──────────────────────────

VEHICLE_SPECS: Dict[str, Dict[str, Any]] = {
    "Two-Wheeler": {
        "label": "Two-Wheeler (Scooter / Royal Enfield)",
        "capacity": 2,
        "icon": "🛵",
        "models": "Honda Activa 6G / Royal Enfield Hunter 350",
        "rental_fee_per_day": 500,
        "fuel_estimate_per_day": 180,
    },
    "Hatchback": {
        "label": "Hatchback (Compact Car - up to 4 persons)",
        "capacity": 4,
        "icon": "🚗",
        "models": "Maruti Swift / Hyundai Grand i10",
        "rental_fee_per_day": 1400,
        "fuel_estimate_per_day": 550,
    },
    "Sedan": {
        "label": "Sedan (Comfort Car - up to 5 persons)",
        "capacity": 5,
        "icon": "🚘",
        "models": "Honda City / Maruti Dzire",
        "rental_fee_per_day": 2000,
        "fuel_estimate_per_day": 650,
    },
    "SUV": {
        "label": "SUV / MUV (Large Group - up to 7 persons)",
        "capacity": 7,
        "icon": "🚙",
        "models": "Toyota Innova Crysta / Maruti Ertiga",
        "rental_fee_per_day": 3200,
        "fuel_estimate_per_day": 850,
    },
}


def calculate_transport_costs(
    mode: str,
    vehicle_type: str,
    days: int,
    group_size: int,
) -> Dict[str, Any]:
    """
    Computes exact daily and total transport costs based on:
    - Mode: 'Private' (own vehicle) or 'Rental' (self-drive rental) or 'Cab' or 'Public Transport'
    - Vehicle Type: 'Two-Wheeler', 'Hatchback', 'Sedan', 'SUV'
    """
    days = max(1, days)
    group_size = max(1, group_size)

    # Normalize mode
    norm_mode = mode.strip().title() if mode else "Rental"
    if "Private" in norm_mode or "Own" in norm_mode:
        selected_mode = "Private"
    elif "Public" in norm_mode:
        selected_mode = "Public Transport"
    elif "Cab" in norm_mode or "Taxi" in norm_mode:
        selected_mode = "Cab"
    else:
        selected_mode = "Rental"

    # Auto-recommend vehicle type if group size exceeds chosen vehicle capacity
    chosen_type = vehicle_type if vehicle_type in VEHICLE_SPECS else "Hatchback"
    auto_adjusted = False
    adjustment_note = ""

    if selected_mode in ["Private", "Rental"]:
        if group_size > 4 and chosen_type in ["Two-Wheeler", "Hatchback"]:
            chosen_type = "SUV"
            auto_adjusted = True
            adjustment_note = f"Auto-selected 7-Seater SUV to comfortably accommodate your group of {group_size}."
        elif group_size > 2 and chosen_type == "Two-Wheeler":
            chosen_type = "Hatchback"
            auto_adjusted = True
            adjustment_note = f"Auto-selected 4-Seater Hatchback to fit group of {group_size}."

    if selected_mode == "Public Transport":
        rental_fee_per_day = 0
        fuel_per_day = 0
        cost_per_day = 300 * math.ceil(group_size / 2)
        total_cost = cost_per_day * days
        return {
            "mode": "Public Transport",
            "vehicle_type": "Bus & Metro",
            "vehicle_name": "Local Buses, Metro & Shared Rickshaws",
            "rental_fee_per_day": 0,
            "fuel_per_day": 0,
            "cost_per_day": cost_per_day,
            "total_cost": total_cost,
            "note": "Public transit passes and local transit tickets.",
        }

    if selected_mode == "Cab":
        rental_fee_per_day = 1500
        fuel_per_day = 0
        cost_per_day = 1500
        total_cost = cost_per_day * days
        return {
            "mode": "Cab / Taxi",
            "vehicle_type": "Cab",
            "vehicle_name": "On-Demand Cabs & Point-to-Point Taxis",
            "rental_fee_per_day": 1500,
            "fuel_per_day": 0,
            "cost_per_day": cost_per_day,
            "total_cost": total_cost,
            "note": "Estimated city cab fares and sightseeing drops.",
        }

    # Private or Rental
    spec = VEHICLE_SPECS[chosen_type]
    fuel_per_day = spec["fuel_estimate_per_day"]

    if selected_mode == "Private":
        rental_fee_per_day = 0
        cost_per_day = fuel_per_day
        vehicle_name = f"Your Private {chosen_type} ({spec['models']})"
        note = f"Personal vehicle: Rental fee is ₹0. Budget only accounts for estimated fuel, tolls, and parking (₹{fuel_per_day}/day)."
    else:  # Rental
        rental_fee_per_day = spec["rental_fee_per_day"]
        cost_per_day = rental_fee_per_day + fuel_per_day
        vehicle_name = f"Rental {chosen_type} ({spec['models']})"
        note = f"Self-drive rental: ₹{rental_fee_per_day}/day vehicle rent + ₹{fuel_per_day}/day estimated fuel/tolls = ₹{cost_per_day}/day total."

    total_cost = cost_per_day * days

    return {
        "mode": selected_mode,
        "vehicle_type": chosen_type,
        "vehicle_name": vehicle_name,
        "rental_fee_per_day": rental_fee_per_day,
        "fuel_per_day": fuel_per_day,
        "cost_per_day": cost_per_day,
        "total_cost": total_cost,
        "auto_adjusted": auto_adjusted,
        "adjustment_note": adjustment_note,
        "note": note,
    }


def calculate_stay_costs(
    destination: str,
    accommodation_type: str,
    days: int,
    group_size: int,
) -> Dict[str, Any]:
    """
    Computes exact daily and total staying costs, with concrete hotel names and per-night tariffs.
    """
    days = max(1, days)
    group_size = max(1, group_size)
    tier = accommodation_type.strip().title() if accommodation_type else "Standard"
    if tier not in ["Budget", "Standard", "Luxury"]:
        tier = "Standard"

    dest_stays = DESTINATION_STAYS.get(destination, DEFAULT_STAYS)
    stay_info = dest_stays.get(tier, DEFAULT_STAYS[tier])

    rooms_needed = math.ceil(group_size / 2)
    tariff_per_night = stay_info["tariff"]
    cost_per_day = tariff_per_night * rooms_needed
    total_cost = cost_per_day * days

    return {
        "name": stay_info["name"],
        "category": tier,
        "type": stay_info["type"],
        "location": stay_info["location"],
        "rating": stay_info["rating"],
        "rooms": rooms_needed,
        "price_per_night": tariff_per_night,
        "cost_per_day": cost_per_day,
        "total_cost": total_cost,
        "note": f"{rooms_needed} room(s) at ₹{tariff_per_night:,}/night for {days} nights ({stay_info['name']}).",
    }


# ─── Place Activities & Adventure Catalog ─────────────────────────────────────
# Distinguishes between free sightseeing/entry and optional paid activities/sports.

PLACE_ACTIVITIES_CATALOG: Dict[str, Dict[str, Any]] = {
    # ── Manali ──
    "Solang Valley Adventure Hub": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Entry (Valley & Viewpoint)",
        "activities": [
            {"name": "Paragliding (Tandem High Flight)", "cost": 2500, "desc": "15-minute scenic flight from Solang Peak over apple valleys"},
            {"name": "Zorbing", "cost": 500, "desc": "Giant transparent inflatable ball rolling down lush alpine slope"},
            {"name": "ATV / Quad Biking", "cost": 1000, "desc": "Off-road mountain dirt trail ride on 4x4 quad"},
            {"name": "Skiing & Snowboarding (Seasonal)", "cost": 1200, "desc": "Includes ski equipment, poles, and on-slope guide"},
        ],
    },
    "Beas River White Water Rafting Pirdi": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Riverbank Access",
        "activities": [
            {"name": "White Water River Rafting (14 km)", "cost": 1200, "desc": "Thrilling Grade II & III rapid descent through cold glacial Beas waters with lifejackets"},
        ],
    },
    "Rohtang Pass High-Altitude Crest": {
        "is_free_entry": True,
        "entry_fee": 50,
        "entry_label": "Green Pass Permit: ₹50",
        "activities": [
            {"name": "Snow Scooter Ride", "cost": 1000, "desc": "High-altitude snowmobile ride over glacial snow fields"},
            {"name": "Tube Sledging", "cost": 500, "desc": "High speed tube slide on snow tracks"},
        ],
    },
    "Hadimba Devi Cedar Forest Temple": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Entry",
        "activities": [],
        "note": "Free to explore ancient 1553 pagoda temple and towering deodar cedar woods. Photography is free.",
    },
    "Jogini Waterfall Pine Forest Trek": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Trek / Nature Trail",
        "activities": [],
        "note": "Scenic self-guided hike through pine woods and apple orchards with natural cascade pool.",
    },
    "Vashisht Village & Hot Sulphur Springs": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Entry",
        "activities": [],
        "note": "Free to visit 4,000-year-old wooden temples and take medicinal hot sulphur spring baths.",
    },
    "Old Manali Bohemian Village & Cafes": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Entry (Village Walk)",
        "activities": [],
        "note": "Free to explore rustic cobbled streets, wooden architecture, and live acoustic music cafes.",
    },
    "Atal Tunnel & Sissu Lahaul Valley": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Highway Transit",
        "activities": [
            {"name": "Sissu Waterfall Zip-line", "cost": 800, "desc": "Exciting valley zipline facing the magnificent Sissu waterfall"},
        ],
    },
    "Naggar Castle & Roerich Art Gallery": {
        "is_free_entry": False,
        "entry_fee": 50,
        "entry_label": "Entry Ticket: ₹50",
        "activities": [
            {"name": "Roerich Heritage Gallery Entry", "cost": 50, "desc": "View historical paintings and vintage car of Russian artist Nicholas Roerich"},
        ],
    },

    # ── Rishikesh ──
    "Shivpuri River Beach & Rafting Hub": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Riverbank Access",
        "activities": [
            {"name": "White Water Rafting (Shivpuri to Rishikesh 16 km)", "cost": 1000, "desc": "Grade III rapids including Roller Coaster, Golf Course & Club House with cliff jumping"},
        ],
    },
    "Mohan Chatti Adventure Arena": {
        "is_free_entry": True,
        "entry_fee": 100,
        "entry_label": "Entry / Spectator: ₹100",
        "activities": [
            {"name": "Bungee Jumping (India's Highest 83m)", "cost": 3550, "desc": "Fixed cantilever platform jump designed and operated by Jumpin Heights ex-army captains"},
            {"name": "Giant Canyon Swing", "cost": 3000, "desc": "Tandem or solo 83-meter pendulum swing over the gorge"},
            {"name": "Flying Fox (Asia's Longest Zipline)", "cost": 2000, "desc": "1 km tandem wire flight reaching speeds of 140 km/h"},
        ],
    },
    "Triveni Ghat Evening Ganga Aarti": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Entry",
        "activities": [],
        "note": "Free public attendance at the grand musical Maha Aarti ceremony with floating diya lamps on the sacred Ganges.",
    },

    # ── Goa ──
    "Baga Beach Strip & Watersports": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Beach Entry",
        "activities": [
            {"name": "Parasailing with Speedboat Dip", "cost": 1500, "desc": "High altitude ocean flight with refreshing water dip"},
            {"name": "Jet Ski (Water Scooter)", "cost": 800, "desc": "High-powered 15-minute ocean ride across the waves"},
            {"name": "Banana Boat Ride", "cost": 400, "desc": "6-seater group tube towed by high-speed boat"},
            {"name": "Bumper Ride", "cost": 500, "desc": "Inflatable ocean tube bouncing over rolling breakers"},
        ],
    },
    "Grand Island Scuba & Marine Expedition": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Island Boat Access",
        "activities": [
            {"name": "Scuba Diving with Underwater Video & Photos", "cost": 3000, "desc": "Full guided dive with PADI certified instructor, equipment and underwater video"},
            {"name": "Snorkeling & Dolphin Spotting", "cost": 1200, "desc": "Coral reef snorkeling tour with boat cruise"},
        ],
    },
    "Dudhsagar Waterfalls Trek & Safari": {
        "is_free_entry": True,
        "entry_fee": 50,
        "entry_label": "Forest Entry: ₹50",
        "activities": [
            {"name": "4x4 Jungle Jeep Safari", "cost": 800, "desc": "Off-road ride through river crossings in Bhagwan Mahaveer Wildlife Sanctuary"},
        ],
    },
    "Fort Aguada & 1864 Lighthouse": {
        "is_free_entry": True,
        "entry_fee": 50,
        "entry_label": "Entry Ticket: ₹50",
        "activities": [],
        "note": "17th-century Portuguese coastal fort with panoramic ocean views and historic freshwater reservoir.",
    },
    "Anjuna Beach & Flea Market": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Beach Entry",
        "activities": [],
        "note": "Free to explore red laterite cliffs, trance beach cafes, and the open-air bohemian Wednesday flea market.",
    },
    "Palolem Beach & Butterfly Beach": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Beach Entry",
        "activities": [
            {"name": "Kayak Rental on Calm Waters", "cost": 400, "desc": "Self-paddle kayak through South Goa's tranquil turquoise cove"},
            {"name": "Boat Ride to Butterfly Beach & Dolphin Island", "cost": 700, "desc": "Local fishing boat tour to secluded coves"},
        ],
    },

    # ── Kerala Backwaters ──
    "Vembanad Lake Houseboat Cruise": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Lagoon View",
        "activities": [
            {"name": "Shikara Boat Canal Cruise (2 Hours)", "cost": 800, "desc": "Private covered wooden shikara cruising through narrow village canals"},
            {"name": "Full-Day Private Houseboat Cruise with Meals", "cost": 6500, "desc": "Traditional kettuvallam cruise with freshly cooked Karimeen fish lunch"},
            {"name": "Village Canal Kayaking", "cost": 1200, "desc": "Guided kayak tour through peaceful backwater hamlets"},
        ],
    },
    "Marari Beach Coastal Village": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Beach Entry",
        "activities": [],
        "note": "Pristine white sand beach fringed with coconut palms. Free for swimming, sunbathing, and sunset walks.",
    },

    # ── Jaipur ──
    "Amber Fort & Sheesh Mahal": {
        "is_free_entry": False,
        "entry_fee": 100,
        "entry_label": "Entry Ticket: ₹100",
        "activities": [
            {"name": "Royal Elephant Ride to Courtyard", "cost": 1200, "desc": "Traditional morning ascent up Amber ramparts (2 persons)"},
            {"name": "Light & Sound Evening Show", "cost": 250, "desc": "Dramatic night narration of Jaipur royal history"},
        ],
    },
    "Nahargarh Fort Sunset Viewpoint": {
        "is_free_entry": False,
        "entry_fee": 50,
        "entry_label": "Entry Ticket: ₹50",
        "activities": [
            {"name": "Aravalli Ridge Cycling Tour", "cost": 600, "desc": "Guided sunset cycle expedition along fortress walls"},
        ],
    },
    "Chokhi Dhani Ethnic Village": {
        "is_free_entry": False,
        "entry_fee": 1100,
        "entry_label": "Carnival & Feast Ticket: ₹1,100",
        "activities": [
            {"name": "All-Inclusive Cultural Carnival & Royal Thali", "cost": 1100, "desc": "Includes Kalbeliya dance, puppet show, camel ride, acrobats, and authentic multi-course royal thali feast"},
        ],
    },

    # ── Udaipur ──
    "Lake Pichola & Boat Cruise": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Ghat Access",
        "activities": [
            {"name": "Sunset Lake Boat Cruise", "cost": 400, "desc": "Golden-hour cruise gliding past Taj Lake Palace and Jag Mandir island"},
        ],
    },
    "Bagore Ki Haveli & Dharohar Dance": {
        "is_free_entry": False,
        "entry_fee": 100,
        "entry_label": "Museum Ticket: ₹100",
        "activities": [
            {"name": "Dharohar Folk & Chari Fire Dance Show", "cost": 200, "desc": "Nightly theatrical show with Rajasthani folk musicians and brass pot fire dancers"},
        ],
    },
    "Karni Mata Ropeway & Sunset Point": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Hilltop Access",
        "activities": [
            {"name": "Cable Car Ropeway Return Ticket", "cost": 150, "desc": "Scenic aerial red cable car ascending Machla Magra hill"},
        ],
    },

    # ── Leh Ladakh ──
    "Pangong Tso & High-Altitude Lake": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Scenic Access",
        "activities": [],
        "note": "World's highest saltwater lake changing colors from blue to green. Free for photography and scenic walks.",
    },
    "Nubra Valley & Hunder Sand Dunes": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Desert Access",
        "activities": [
            {"name": "Bactrian Double-Humped Camel Safari", "cost": 500, "desc": "Ride across silver cold desert dunes in Hunder"},
            {"name": "ATV Desert Dune Riding", "cost": 1200, "desc": "Quad bike racing across high altitude sand dunes"},
        ],
    },
    "Zanskar River White Water Rafting": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Gorge View",
        "activities": [
            {"name": "Zanskar Chilling to Sangam Rafting (Grade III+)", "cost": 1800, "desc": "High adrenaline glacier river rapid descent through vertical canyon walls"},
        ],
    },

    # ── Andaman Islands ──
    "Elephant Beach Watersports Marine Hub": {
        "is_free_entry": True,
        "entry_fee": 0,
        "entry_label": "Free Beach Entry",
        "activities": [
            {"name": "Sea Walking with Oxygen Helmet", "cost": 3500, "desc": "Walk on the ocean bed among coral formations and reef fishes"},
            {"name": "Discovery Scuba Dive", "cost": 3500, "desc": "Guided coral reef scuba dive with underwater photographer"},
            {"name": "Glass Bottom Coral Viewing Boat", "cost": 1000, "desc": "View exotic marine life through glass hull without getting wet"},
            {"name": "Parasailing over Andaman Sea", "cost": 2500, "desc": "Towed high over turquoise ocean waters"},
        ],
    },
}


def get_place_activity_details(place_name: str, category: str = "", cost_hint: int = 0) -> Dict[str, Any]:
    """
    Returns activity details for any attraction:
    - is_free_entry: whether visiting the spot is free
    - entry_fee: 0 or nominal admission
    - entry_label: 'Free Entry' or 'Entry Ticket: ₹50'
    - activities: list of specific adventures/sports with exact costs
    """
    # Check exact name match first
    for catalog_name, info in PLACE_ACTIVITIES_CATALOG.items():
        if catalog_name.lower() in place_name.lower() or place_name.lower() in catalog_name.lower():
            return {
                "is_free_entry": info.get("is_free_entry", True),
                "entry_fee": info.get("entry_fee", 0),
                "entry_label": info.get("entry_label", "Free Entry" if info.get("entry_fee", 0) == 0 else f"Entry: ₹{info.get('entry_fee')}"),
                "activities": info.get("activities", []),
                "note": info.get("note", ""),
            }

    # Keyword based matching for general activities
    p_lower = place_name.lower()
    cat_lower = category.lower()

    if any(k in p_lower for k in ["rafting", "river"]):
        return {
            "is_free_entry": True,
            "entry_fee": 0,
            "entry_label": "Free Riverbank Access",
            "activities": [
                {"name": "White Water River Rafting", "cost": max(800, cost_hint), "desc": "Guided rapid descent with lifejackets and equipment"}
            ],
            "note": "River viewing is free. Rafting activity is payable to registered operators.",
        }

    if any(k in p_lower for k in ["valley", "adventure", "snow", "pass"]):
        return {
            "is_free_entry": True,
            "entry_fee": 0,
            "entry_label": "Free Entry (Valley & Viewpoint)",
            "activities": [
                {"name": "Valley Adventure Activities", "cost": max(500, cost_hint), "desc": "Optional quad biking, zipline, or snow sledging"},
            ],
            "note": "Visiting and walking the viewpoint is completely free.",
        }

    if any(k in p_lower for k in ["beach"]):
        return {
            "is_free_entry": True,
            "entry_fee": 0,
            "entry_label": "Free Beach Entry",
            "activities": [
                {"name": "Coastal Watersports (Parasailing / Jet Ski)", "cost": max(800, cost_hint), "desc": "Water activities available at beach shacks"},
            ] if "adventure" in cat_lower or cost_hint > 300 else [],
            "note": "Beach entry, sunbathing, and ocean swimming are 100% free.",
        }

    if any(k in p_lower for k in ["waterfall", "trek", "forest", "lake", "ghat", "promenade"]):
        return {
            "is_free_entry": True,
            "entry_fee": 0,
            "entry_label": "Free Entry (Nature & Viewpoint)",
            "activities": [],
            "note": "Free to explore • Sightseeing, nature walk & photography.",
        }

    if any(k in p_lower for k in ["temple", "monastery", "church", "shrine", "ashram"]):
        return {
            "is_free_entry": True,
            "entry_fee": 0,
            "entry_label": "Free Entry (Spiritual Shrine)",
            "activities": [],
            "note": "Free entry for prayers and architecture viewing.",
        }

    if any(k in p_lower for k in ["fort", "palace", "museum"]):
        fee = cost_hint if cost_hint > 0 else 50
        return {
            "is_free_entry": False,
            "entry_fee": fee,
            "entry_label": f"Entry Ticket: ₹{fee}",
            "activities": [],
            "note": f"Nominal admission ticket (₹{fee}) for heritage maintenance.",
        }

    # Default fallback
    return {
        "is_free_entry": cost_hint == 0,
        "entry_fee": cost_hint,
        "entry_label": "Free Entry" if cost_hint == 0 else f"Entry Ticket: ₹{cost_hint}",
        "activities": [],
        "note": "Sightseeing and photography.",
    }
