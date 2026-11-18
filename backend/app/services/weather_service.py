"""
Weather Service: Date-aware climate prediction, seasonal advisories, safety warnings,
and smart packing suggestions for 20 Indian destinations.
"""

from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional


def parse_travel_month(start_date_str: Optional[str]) -> int:
    """Parses date string (YYYY-MM-DD) and extracts month integer (1-12). Defaults to current month."""
    if not start_date_str:
        return datetime.now().month
    try:
        dt = datetime.strptime(start_date_str[:10], "%Y-%m-%d")
        return dt.month
    except Exception:
        return datetime.now().month


def _raw_destination_weather(destination: str, month: int) -> Dict[str, Any]:
    dest_clean = destination.strip()

    # Destination-specific seasonal mappings
    # ── 1. Manali & High Himalayas ──
    if dest_clean.lower() in ["manali", "spiti valley"]:
        if month in [12, 1, 2]:
            return {
                "destination": dest_clean,
                "season": "Winter Peak (Heavy Snow)",
                "temperature": "-4°C to 6°C",
                "condition": "Snowfall & Cold Glacial Air",
                "icon": "❄️",
                "warnings": [
                    "Heavy snow expected across Solang Valley and high passes. Rental vehicles may require snow chains on tyres.",
                    "Sub-zero night temperatures: Ensure hotel accommodation includes central or electric heating.",
                ],
                "suggestions": [
                    "Peak time for snow skiing, snowboarding, and snowmobile rides in Solang Valley.",
                    "Carry heavy down jackets, thermal innerwear, fleece, waterproof gloves, and high-traction boots.",
                ],
                "activity_advisory": {
                    "skiing": "Optimal / Active Winter Slopes",
                    "paragliding": "Operational subject to clear wind visibility",
                    "river_rafting": "Limited / Cold glacier water (dry suits recommended)",
                },
                "packing_list": [
                    "Heavy down feather jacket (-10°C rated)",
                    "2 pairs thermal top & bottom inners",
                    "Waterproof snow boots / sturdy trekking shoes",
                    "Woollen beanies, neck gaiter & thermal socks",
                    "UV-protection polarized sunglasses (snow glare)",
                ],
            }
        elif month in [7, 8]:
            return {
                "destination": dest_clean,
                "season": "Monsoon Mountain Season",
                "temperature": "15°C to 23°C",
                "condition": "Cloudy with Frequent Mountain Showers",
                "icon": "🌧️",
                "warnings": [
                    "⚠️ Safety Alert: White water river rafting on the Beas is suspended by government order during peak monsoon.",
                    "Frequent cloudbursts and landslide risks on NH-3 highway. Check road status before day excursions.",
                ],
                "suggestions": [
                    "Magnificent lush green valleys, roaring Jogini waterfalls, and blooming apple orchards.",
                    "Carry compact rain poncho, quick-dry activewear, and waterproof backpack covers.",
                ],
                "activity_advisory": {
                    "skiing": "Closed (Summer/Monsoon)",
                    "paragliding": "Intermittent (Subject to rain clearance)",
                    "river_rafting": "Suspended for monsoon safety",
                },
                "packing_list": [
                    "Waterproof rain jacket / sturdy windcheater",
                    "Quick-dry hiking trousers",
                    "Water-resistant hiking shoes with deep rubber grip",
                    "Mosquito repellent and waterproof phone pouch",
                ],
            }
        elif month in [3, 4, 5, 6]:
            return {
                "destination": dest_clean,
                "season": "Summer Spring Escapade",
                "temperature": "12°C to 25°C",
                "condition": "Mild, Clear Skies & Pleasant Alpine Breeze",
                "icon": "☀️",
                "warnings": [],
                "suggestions": [
                    "Prime season for high-altitude tandem paragliding and Beas river white water rafting.",
                    "Rohtang Pass opens in late May: Book your online green vehicle permit early.",
                ],
                "activity_advisory": {
                    "skiing": "Available at higher passes (Rohtang/Gulaba)",
                    "paragliding": "Excellent thermal flying conditions",
                    "river_rafting": "Prime Grade II & III rapids active",
                },
                "packing_list": [
                    "Light jackets / cardigans for cool evenings",
                    "Comfortable cotton t-shirts and walking pants",
                    "Sunscreen (SPF 50+) and wide-brim hat",
                    "Sports shoes for walking and adventure trails",
                ],
            }
        else:  # Sep - Nov
            return {
                "destination": dest_clean,
                "season": "Autumn Crisp",
                "temperature": "5°C to 18°C",
                "condition": "Crisp Mountain Air & Golden Sunset Vistas",
                "icon": "🍂",
                "warnings": [
                    "Temperatures drop sharply after sunset. Carry warm outerwear for evening strolls in Old Manali.",
                ],
                "suggestions": [
                    "Spectacular autumn foliage and uncrowded serene viewpoints across Naggar and Solang.",
                ],
                "activity_advisory": {
                    "paragliding": "Optimal clear skies",
                    "river_rafting": "Open until early November",
                },
                "packing_list": [
                    "Fleece jackets and light thermals",
                    "Windproof outer shell",
                    "Moisturizer, lip balm, and sunglasses",
                ],
            }

    # ── 2. Goa & Andaman Islands ──
    if dest_clean.lower() in ["goa", "andaman islands"]:
        if month in [6, 7, 8, 9]:
            return {
                "destination": dest_clean,
                "season": "Southwest Monsoon",
                "temperature": "24°C to 29°C",
                "condition": "Tropical Downpours, Lush Greenery & High Ocean Swell",
                "icon": "🌧️",
                "warnings": [
                    "⚠️ Maritime Safety Warning: High tides and rough seas. All water sports (parasailing, jet-ski, scuba diving) are strictly banned by maritime authorities.",
                    "Ocean swimming is restricted with red flags posted on coastal beaches.",
                ],
                "suggestions": [
                    "Best time for romantic countryside exploration: Dudhsagar Waterfalls is at its thunderous peak volume.",
                    "Enjoy tranquil heritage Latin Quarter walks in Fontainhas and aromatic spice plantation lunches.",
                ],
                "activity_advisory": {
                    "parasailing": "Suspended for monsoon safety",
                    "scuba_diving": "Suspended (Poor underwater visibility)",
                    "waterfall_trek": "Spectacular peak flow at Dudhsagar",
                },
                "packing_list": [
                    "Breathable rain jacket / waterproof umbrella",
                    "Quick-dry shorts and cotton tees",
                    "Anti-skid waterproof sandals / flip-flops",
                    "Waterproof dry-bag for electronics",
                ],
            }
        elif month in [11, 12, 1, 2]:
            return {
                "destination": dest_clean,
                "season": "Winter Peak (Golden Beach Season)",
                "temperature": "21°C to 32°C",
                "condition": "Warm Sunshine, Calm Turquoise Waters & Cool Evening Breeze",
                "icon": "☀️",
                "warnings": [],
                "suggestions": [
                    "Peak season for scuba diving at Grand Island, parasailing, and vibrant night flea markets.",
                    "Calm waters ideal for ocean swimming, kayaking, and sunset dolphin boat cruises.",
                ],
                "activity_advisory": {
                    "parasailing": "Optimal coastal flying conditions",
                    "scuba_diving": "Excellent 10m+ visibility at Grand Island",
                    "beach_shacks": "100% active with live seafood & music",
                },
                "packing_list": [
                    "Swimwear, beach towels, and breathable linen outfits",
                    "Reef-safe sunscreen (SPF 50+) & sunglasses",
                    "Comfortable flip-flops and boat shoes",
                    "Evening casual wear for beach shacks and cafes",
                ],
            }
        else:  # March - May
            return {
                "destination": dest_clean,
                "season": "Tropical Coastal Summer",
                "temperature": "26°C to 36°C",
                "condition": "Hot & Humid Sunshine",
                "icon": "☀️",
                "warnings": [
                    "High midday UV index and humidity. Schedule beach water sports before 11:00 AM or after 4:30 PM.",
                ],
                "suggestions": [
                    "Great season for water sports, uncrowded private resorts, and discounted luxury stays.",
                ],
                "activity_advisory": {
                    "parasailing": "Active morning & late afternoon",
                    "scuba_diving": "Operational with calm morning waters",
                },
                "packing_list": [
                    "Ultra-light cotton / linen clothing",
                    "Sunscreen lotion, aloe vera gel, and hat",
                    "Hydration water bottle and electrolyte sachets",
                ],
            }

    # ── 3. Rishikesh ──
    if dest_clean.lower() == "rishikesh":
        if month in [7, 8, 9]:
            return {
                "destination": dest_clean,
                "season": "Himalayan Monsoon",
                "temperature": "23°C to 30°C",
                "condition": "Heavy Rains & Swollen Holy Ganga Waters",
                "icon": "🌧️",
                "warnings": [
                    "⚠️ Safety Alert: White water river rafting is officially closed by Uttarakhand Tourism from July 1 to mid-September.",
                ],
                "suggestions": [
                    "Spiritual yoga retreats, ashram meditation, and evening Ganga Aarti at Triveni Ghat remain fully vibrant.",
                ],
                "activity_advisory": {
                    "river_rafting": "Closed for monsoon high water levels",
                    "bungee_jumping": "Subject to daily rain & wind clearance",
                },
                "packing_list": [
                    "Raincoat, umbrella, and waterproof footwear",
                    "Comfortable modest yoga & temple wear",
                    "Mosquito repellent and light shawl",
                ],
            }
        else:
            return {
                "destination": dest_clean,
                "season": "Adventure & Spiritual Season",
                "temperature": "14°C to 28°C" if month in [11, 12, 1, 2] else "18°C to 34°C",
                "condition": "Clear Blue Skies & Rapid Mountain Waters",
                "icon": "☀️",
                "warnings": [],
                "suggestions": [
                    "Peak time for 16 km white water river rafting (Grade III rapids) and India's highest 83m bungee jumping.",
                ],
                "activity_advisory": {
                    "river_rafting": "Prime operational rapids active",
                    "bungee_jumping": "Full daily operations at Mohan Chatti",
                },
                "packing_list": [
                    "Quick-dry shorts/t-shirts for river rafting",
                    "Strapped sports shoes (no loose sandals for bungee)",
                    "Modest clothing for evening Ganga Aarti",
                    "Light fleece for winter evenings",
                ],
            }

    # ── 4. Leh Ladakh ──
    if dest_clean.lower() == "leh ladakh":
        if month in [10, 11, 12, 1, 2, 3, 4]:
            return {
                "destination": dest_clean,
                "season": "Sub-Zero Himalayan Winter",
                "temperature": "-16°C to 1°C",
                "condition": "Severe Cold, Frozen Lakes & Heavy Pass Snow",
                "icon": "❄️",
                "warnings": [
                    "⚠️ Severe Climate Alert: Extreme sub-zero temperatures. Manali-Leh and Srinagar-Leh highways closed. Accessible only by flight to Leh.",
                    "High Altitude Acclimatization: Complete 48 hours of rest in Leh before physical excursions.",
                ],
                "suggestions": [
                    "Chadar frozen river trek and mystical snow leopard expeditions operate in this window.",
                ],
                "activity_advisory": {
                    "lake_trips": "Pangong and Tso Moriri frozen solid",
                    "mountain_passes": "Khardung La requires military convoy clearances",
                },
                "packing_list": [
                    "Heavy mountaineering feather down parka (-20°C)",
                    "Thermal base layers (Merino wool recommended)",
                    "Insulated snow boots with wool socks",
                    "High altitude sickness medication (Diamox) & pulse oximeter",
                ],
            }
        else:
            return {
                "destination": dest_clean,
                "season": "Summer High-Altitude Season",
                "temperature": "8°C to 24°C",
                "condition": "Sunny, Dry Mountain Air & Clear High-Altitude Passes",
                "icon": "☀️",
                "warnings": [
                    "Rest for the first 24-36 hours upon arrival to avoid Acute Mountain Sickness (AMS). Drink 3-4 liters of water daily.",
                ],
                "suggestions": [
                    "Best season for road trips across Khardung La (17,982 ft), Pangong Tso lake, and Nubra sand dunes.",
                ],
                "activity_advisory": {
                    "atv_quad_biking": "Active on Hunder Sand Dunes",
                    "camel_safari": "Active with double-humped Bactrian camels",
                    "zanskar_rafting": "Open for Grade III rapids",
                },
                "packing_list": [
                    "Warm fleece jacket and windbreaker",
                    "UV 400 sunglasses and high SPF 50 sunscreen",
                    "Comfortable hiking boots",
                    "Lip balm and heavy moisturizer (dry desert air)",
                ],
            }

    # ── 5. Rajasthan (Jaipur, Udaipur, Jaisalmer) ──
    if dest_clean.lower() in ["jaipur", "udaipur", "jaisalmer"]:
        if month in [4, 5, 6]:
            return {
                "destination": dest_clean,
                "season": "Peak Desert Summer",
                "temperature": "32°C to 44°C",
                "condition": "Intense Desert Heat & Dry Arid Winds",
                "icon": "☀️",
                "warnings": [
                    "⚠️ Heat Advisory: Extreme midday heat. Schedule hill fort visits (Amber, Nahargarh, Mehrangarh) strictly between 07:30 AM – 10:30 AM or after 5:00 PM.",
                    "Avoid prolonged open-sun walks between 12:00 PM and 4:00 PM.",
                ],
                "suggestions": [
                    "Enjoy serene sunset boat cruises on Lake Pichola in Udaipur and shaded royal museum galleries.",
                ],
                "activity_advisory": {
                    "fort_visits": "Best in early mornings",
                    "lake_cruises": "Magical golden hour / sunset breezes",
                },
                "packing_list": [
                    "Loose, breathable light cotton or linen clothing",
                    "Wide-brimmed sun hat and sunglasses",
                    "Sunscreen and personal water flask",
                    "Comfortable walking shoes for stone fort pavements",
                ],
            }
        else:
            return {
                "destination": dest_clean,
                "season": "Royal Heritage Winter Season",
                "temperature": "11°C to 27°C",
                "condition": "Crisp Golden Sunshine & Pleasant Evenings",
                "icon": "☀️",
                "warnings": [],
                "suggestions": [
                    "Peak tourist season with royal fairs, open-air cultural bazaars, and pleasant weather for fort walks.",
                ],
                "activity_advisory": {
                    "elephant_rides": "Operational morning hours at Amber Fort",
                    "folk_shows": "Nightly Dharohar Chari dance shows active",
                },
                "packing_list": [
                    "Comfortable cotton daytime outfits",
                    "Light jacket or shawl for chilly winter evenings",
                    "Walking sneakers for palaces and cobblestone lanes",
                ],
            }

    # ── 6. General / Fallback Indian Destinations (Kerala, Coorg, Munnar, etc.) ──
    if month in [6, 7, 8]:
        return {
            "destination": dest_clean,
            "season": "Southwest Monsoon",
            "temperature": "22°C to 28°C",
            "condition": "Tropical Monsoons & Lush Rainforest Vistas",
            "icon": "🌧️",
            "warnings": [
                "Periodic heavy rainfall. Carry rain protection for outdoor excursions.",
            ],
            "suggestions": [
                "Lush green tea plantations and misty backwaters at their most scenic and therapeutic.",
            ],
            "activity_advisory": {
                "sightseeing": "Enjoyable with light rainwear",
                "houseboats": "Scenic rain cruises with Karimeen fish curry meals",
            },
            "packing_list": [
                "Sturdy umbrella / raincoat",
                "Waterproof footwear",
                "Quick-dry fabrics",
            ],
        }
    else:
        return {
            "destination": dest_clean,
            "season": "Pleasant Travel Season",
            "temperature": "18°C to 30°C",
            "condition": "Gentle Sunshine & Clear Skies",
            "icon": "☀️",
            "warnings": [],
            "suggestions": [
                "Optimal weather for full-day sightseeing, cultural exploration, and local dining.",
            ],
            "activity_advisory": {
                "sightseeing": "Optimal conditions across all outdoor attractions",
            },
            "packing_list": [
                "Comfortable travel wear",
                "Sun protection (shades, sunscreen)",
                "Comfortable walking footwear",
            ],
        }


def predict_destination_weather(
    destination: str,
    start_date_str: Optional[str] = None,
    end_date_str: Optional[str] = None,
    days: int = 3,
) -> Dict[str, Any]:
    """
    Predicts destination weather, temperature range, seasonal conditions,
    safety warnings, activity advisories, and packing lists based on travel dates.
    Guarantees activity_advisory is always string / string list and never an unrendered object.
    """
    month = parse_travel_month(start_date_str)
    dest_clean = destination.strip()

    try:
        s_dt = datetime.strptime(start_date_str[:10], "%Y-%m-%d") if start_date_str else datetime.now()
    except Exception:
        s_dt = datetime.now()

    if end_date_str:
        try:
            e_dt = datetime.strptime(end_date_str[:10], "%Y-%m-%d")
        except Exception:
            e_dt = s_dt + timedelta(days=max(1, days))
    else:
        e_dt = s_dt + timedelta(days=max(1, days))

    date_range_label = f"{s_dt.strftime('%b %d, %Y')} – {e_dt.strftime('%b %d, %Y')}"

    raw = _raw_destination_weather(dest_clean, month)
    res = dict(raw)
    res["start_date"] = s_dt.strftime("%Y-%m-%d")
    res["end_date"] = e_dt.strftime("%Y-%m-%d")
    res["date_range_label"] = date_range_label
    res["duration_days"] = max(1, (e_dt - s_dt).days)

    # Convert activity advisory into safe string and list
    act = res.get("activity_advisory")
    if isinstance(act, dict):
        res["activity_advisory_list"] = [f"{k.replace('_', ' ').title()}: {v}" for k, v in act.items()]
        res["activity_advisory"] = " • ".join(f"{k.replace('_', ' ').title()}: {v}" for k, v in act.items())
    elif isinstance(act, list):
        res["activity_advisory_list"] = act
        res["activity_advisory"] = " • ".join(str(x) for x in act)
    elif act:
        res["activity_advisory_list"] = [str(act)]
        res["activity_advisory"] = str(act)
    else:
        res["activity_advisory_list"] = []
        res["activity_advisory"] = ""

    return res

