"""
Traffic Sign Detection — Sign Data & Explanations

Maps YOLO class names from best.pt to display names,
categories, color coding, and detailed driver explanations.
"""

# ─── Sign database for YOLO best.pt classes ───────────────────────────────────
# The model detects 15 classes:
#   Green Light, Red Light, Speed Limit 10, Speed Limit 100, Speed Limit 110,
#   Speed Limit 120, Speed Limit 20, Speed Limit 30, Speed Limit 40,
#   Speed Limit 50, Speed Limit 60, Speed Limit 70, Speed Limit 80,
#   Speed Limit 90, Stop

SIGN_DATABASE = {
    "Green Light": {
        "label": "Green Light",
        "type": "regulatory",
        "color": "blue",
        "explanation": (
            "The traffic signal is green. You may proceed through the "
            "intersection with caution. Watch for pedestrians and turning "
            "vehicles before entering."
        ),
    },
    "Red Light": {
        "label": "Red Light",
        "type": "regulatory",
        "color": "red",
        "explanation": (
            "The traffic signal is red. You must come to a complete stop "
            "before the stop line or intersection. Do not proceed until the "
            "light turns green. Right turns on red may be permitted unless "
            "a sign indicates otherwise."
        ),
    },
    "Speed Limit 10": {
        "label": "Speed Limit 10",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 10 km/h. Typically found in "
            "parking garages, private driveways, and pedestrian-heavy zones. "
            "Drive at walking pace."
        ),
    },
    "Speed Limit 20": {
        "label": "Speed Limit 20",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 20 km/h. Commonly found in "
            "school zones, residential areas, and parking lots. Reduce "
            "speed immediately upon entering this zone."
        ),
    },
    "Speed Limit 30": {
        "label": "Speed Limit 30",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 30 km/h. Typically enforced in "
            "urban residential streets. Watch for pedestrians and cyclists."
        ),
    },
    "Speed Limit 40": {
        "label": "Speed Limit 40",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 40 km/h. Often found in urban "
            "areas near schools, hospitals, and busy intersections. Stay "
            "alert for sudden stops."
        ),
    },
    "Speed Limit 50": {
        "label": "Speed Limit 50",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 50 km/h. This is the default "
            "urban speed limit in many countries. Maintain safe following "
            "distance and be prepared for sudden stops."
        ),
    },
    "Speed Limit 60": {
        "label": "Speed Limit 60",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 60 km/h. Often found on major "
            "urban roads and suburban arterials. Stay alert for merging "
            "traffic and changing speed zones."
        ),
    },
    "Speed Limit 70": {
        "label": "Speed Limit 70",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 70 km/h. Common on dual "
            "carriageways and semi-rural roads. Keep to the correct lane "
            "and signal before any lane changes."
        ),
    },
    "Speed Limit 80": {
        "label": "Speed Limit 80",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 80 km/h. Frequently posted on "
            "rural roads and highway on-ramps. Road surface and weather "
            "conditions may require lower speeds."
        ),
    },
    "Speed Limit 90": {
        "label": "Speed Limit 90",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 90 km/h. Common on rural "
            "highways and national roads. Maintain concentration and keep "
            "a safe following distance from the vehicle ahead."
        ),
    },
    "Speed Limit 100": {
        "label": "Speed Limit 100",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 100 km/h. Typical highway speed "
            "limit. Ensure your vehicle is roadworthy and maintain "
            "concentration during high-speed driving."
        ),
    },
    "Speed Limit 110": {
        "label": "Speed Limit 110",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 110 km/h. Found on expressways "
            "and divided highways. Use mirrors frequently and maintain safe "
            "lane discipline."
        ),
    },
    "Speed Limit 120": {
        "label": "Speed Limit 120",
        "type": "speed",
        "color": "red",
        "explanation": (
            "The maximum permitted speed is 120 km/h. Found on motorways "
            "and expressways. Use the left lane for overtaking only and "
            "return to the right lane after passing."
        ),
    },
    "Stop": {
        "label": "Stop Sign",
        "type": "regulatory",
        "color": "red",
        "explanation": (
            "Drivers must come to a complete halt at the stop line or before "
            "entering the intersection. Proceed only when it is safe and the "
            "right-of-way rules are satisfied. Rolling stops are illegal in "
            "most jurisdictions."
        ),
    },
}


def get_sign_info(class_name: str) -> dict:
    """Look up sign info by the YOLO class name. Returns a default entry if unknown."""
    if class_name in SIGN_DATABASE:
        return SIGN_DATABASE[class_name]
    return {
        "label": class_name,
        "type": "warning",
        "color": "blue",
        "explanation": (
            f"'{class_name}' was detected in the frame. Exercise caution "
            "and observe your surroundings carefully."
        ),
    }
