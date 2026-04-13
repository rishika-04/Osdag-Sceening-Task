from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import LocationData


# Extra Credit: Full State → District database with wind, seismic, temperature values
# Data sourced from IS 875 (Part 3), IS 1893, and IRC 6 (2017) reference tables
LOCATION_DB = {
    "Andhra Pradesh": {
        "Visakhapatnam": {"wind_speed": 50, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 40, "temp_min": 16},
        "Vijayawada":    {"wind_speed": 44, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 44, "temp_min": 14},
        "Guntur":        {"wind_speed": 44, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 44, "temp_min": 14},
        "Nellore":       {"wind_speed": 50, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 42, "temp_min": 16},
        "Tirupati":      {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 39, "temp_min": 14},
    },
    "Delhi": {
        "New Delhi": {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 42, "temp_min": 0},
        "Dwarka":    {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 42, "temp_min": 0},
        "Rohini":    {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 42, "temp_min": 0},
    },
    "Gujarat": {
        "Ahmedabad": {"wind_speed": 39, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 44, "temp_min": 5},
        "Surat":     {"wind_speed": 44, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 40, "temp_min": 10},
        "Vadodara":  {"wind_speed": 39, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 44, "temp_min": 7},
        "Bhuj":      {"wind_speed": 39, "seismic_zone": "V",   "zone_factor": 0.36, "temp_max": 46, "temp_min": 5},
        "Rajkot":    {"wind_speed": 39, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 44, "temp_min": 6},
    },
    "Karnataka": {
        "Bangalore": {"wind_speed": 33, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 35, "temp_min": 12},
        "Mysore":    {"wind_speed": 33, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 37, "temp_min": 13},
        "Hubli":     {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 38, "temp_min": 12},
        "Mangalore": {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 36, "temp_min": 18},
        "Belgaum":   {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 36, "temp_min": 10},
    },
    "Kerala": {
        "Thiruvananthapuram": {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 36, "temp_min": 20},
        "Kochi":              {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 35, "temp_min": 20},
        "Kozhikode":          {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 36, "temp_min": 20},
        "Thrissur":           {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 36, "temp_min": 19},
    },
    "Madhya Pradesh": {
        "Bhopal":   {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 44, "temp_min": 5},
        "Indore":   {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 44, "temp_min": 6},
        "Jabalpur": {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 45, "temp_min": 5},
        "Gwalior":  {"wind_speed": 47, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 46, "temp_min": 2},
    },
    "Maharashtra": {
        "Mumbai":     {"wind_speed": 44, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 36, "temp_min": 15},
        "Pune":       {"wind_speed": 39, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 40, "temp_min": 8},
        "Nagpur":     {"wind_speed": 44, "seismic_zone": "II",  "zone_factor": 0.10, "temp_max": 46, "temp_min": 6},
        "Nashik":     {"wind_speed": 39, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 42, "temp_min": 8},
        "Aurangabad": {"wind_speed": 39, "seismic_zone": "II",  "zone_factor": 0.10, "temp_max": 42, "temp_min": 8},
        "Latur":      {"wind_speed": 39, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 42, "temp_min": 10},
    },
    "Rajasthan": {
        "Jaipur":  {"wind_speed": 47, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 46, "temp_min": 2},
        "Jodhpur": {"wind_speed": 47, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 48, "temp_min": 3},
        "Udaipur": {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 44, "temp_min": 4},
        "Kota":    {"wind_speed": 47, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 46, "temp_min": 4},
        "Bikaner": {"wind_speed": 47, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 48, "temp_min": 2},
    },
    "Tamil Nadu": {
        "Chennai":         {"wind_speed": 50, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 40, "temp_min": 20},
        "Coimbatore":      {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 37, "temp_min": 16},
        "Madurai":         {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 42, "temp_min": 18},
        "Salem":           {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 40, "temp_min": 16},
        "Tiruchirappalli": {"wind_speed": 39, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 42, "temp_min": 18},
    },
    "Uttar Pradesh": {
        "Lucknow":    {"wind_speed": 47, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 44, "temp_min": 2},
        "Kanpur":     {"wind_speed": 47, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 46, "temp_min": 2},
        "Agra":       {"wind_speed": 47, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 46, "temp_min": 2},
        "Varanasi":   {"wind_speed": 47, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 46, "temp_min": 4},
        "Meerut":     {"wind_speed": 47, "seismic_zone": "IV",  "zone_factor": 0.24, "temp_max": 44, "temp_min": 1},
        "Allahabad":  {"wind_speed": 47, "seismic_zone": "II",  "zone_factor": 0.10, "temp_max": 46, "temp_min": 3},
    },
    "West Bengal": {
        "Kolkata":    {"wind_speed": 50, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 40, "temp_min": 10},
        "Howrah":     {"wind_speed": 50, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 40, "temp_min": 10},
        "Durgapur":   {"wind_speed": 47, "seismic_zone": "III", "zone_factor": 0.16, "temp_max": 42, "temp_min": 8},
        "Siliguri":   {"wind_speed": 47, "seismic_zone": "IV",  "zone_factor": 0.24, "temp_max": 36, "temp_min": 5},
        "Darjeeling": {"wind_speed": 47, "seismic_zone": "IV",  "zone_factor": 0.24, "temp_max": 24, "temp_min": 0},
    },
    "Himachal Pradesh": {
        "Shimla":       {"wind_speed": 39, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 30, "temp_min": -4},
        "Dharamshala":  {"wind_speed": 39, "seismic_zone": "V",  "zone_factor": 0.36, "temp_max": 32, "temp_min": -2},
        "Manali":       {"wind_speed": 39, "seismic_zone": "V",  "zone_factor": 0.36, "temp_max": 28, "temp_min": -10},
    },
    "Uttarakhand": {
        "Dehradun": {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 40, "temp_min": 2},
        "Haridwar": {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 42, "temp_min": 3},
        "Nainital": {"wind_speed": 39, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 30, "temp_min": 0},
        "Roorkee":  {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 42, "temp_min": 2},
    },
    "Punjab": {
        "Amritsar":   {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 44, "temp_min": 0},
        "Ludhiana":   {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 44, "temp_min": 1},
        "Jalandhar":  {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 44, "temp_min": 1},
        "Chandigarh": {"wind_speed": 47, "seismic_zone": "IV", "zone_factor": 0.24, "temp_max": 44, "temp_min": 1},
    },
    "Odisha": {
        "Bhubaneswar": {"wind_speed": 50, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 42, "temp_min": 12},
        "Cuttack":     {"wind_speed": 50, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 42, "temp_min": 12},
        "Puri":        {"wind_speed": 55, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 38, "temp_min": 14},
        "Rourkela":    {"wind_speed": 44, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 44, "temp_min": 8},
    },
    "Telangana": {
        "Hyderabad":  {"wind_speed": 44, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 43, "temp_min": 10},
        "Warangal":   {"wind_speed": 44, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 44, "temp_min": 10},
        "Nizamabad":  {"wind_speed": 44, "seismic_zone": "II", "zone_factor": 0.10, "temp_max": 44, "temp_min": 10},
    },
    "Assam": {
        "Guwahati":   {"wind_speed": 47, "seismic_zone": "V", "zone_factor": 0.36, "temp_max": 38, "temp_min": 8},
        "Dibrugarh":  {"wind_speed": 47, "seismic_zone": "V", "zone_factor": 0.36, "temp_max": 36, "temp_min": 6},
        "Silchar":    {"wind_speed": 47, "seismic_zone": "V", "zone_factor": 0.36, "temp_max": 36, "temp_min": 8},
    },
}

@api_view(['GET'])
def get_states(request):
    states = LocationData.objects.values_list('state', flat=True).distinct().order_by('state')
    return Response(list(states))

@api_view(['GET'])
def get_districts(request):
    state = request.query_params.get('state', '')
    if not state:
        return Response({"error": "state parameter required."}, status=status.HTTP_400_BAD_REQUEST)
    districts = LocationData.objects.filter(state=state).values_list('district', flat=True).order_by('district')
    if not districts.exists():
        return Response({"error": f"State '{state}' not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(list(districts))

@api_view(['GET'])
def get_location_data(request):
    state = request.query_params.get('state', '')
    district = request.query_params.get('district', '')
    if not state:
        return Response({"error": "state parameter required."}, status=status.HTTP_400_BAD_REQUEST)
    if not district:
        return Response({"error": "district parameter required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        loc = LocationData.objects.get(state=state, district=district)
    except LocationData.DoesNotExist:
        return Response({"error": f"District '{district}' not found in {state}."}, status=status.HTTP_404_NOT_FOUND)
    return Response({
        "wind_speed": loc.wind_speed,
        "seismic_zone": loc.seismic_zone,
        "zone_factor": loc.zone_factor,
        "temp_max": loc.temp_max,
        "temp_min": loc.temp_min,
    })

# Legacy path endpoints
@api_view(['GET'])
def get_districts_path(request, state):
    districts = LocationData.objects.filter(state=state).values_list('district', flat=True).order_by('district')
    if not districts.exists():
        return Response({"error": f"State '{state}' not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(list(districts))

@api_view(['GET'])
def get_location_data_path(request, state, district):
    try:
        loc = LocationData.objects.get(state=state, district=district)
    except LocationData.DoesNotExist:
        return Response({"error": f"District '{district}' not found in {state}."}, status=status.HTTP_404_NOT_FOUND)
    return Response({
        "wind_speed": loc.wind_speed,
        "seismic_zone": loc.seismic_zone,
        "zone_factor": loc.zone_factor,
        "temp_max": loc.temp_max,
        "temp_min": loc.temp_min,
    })

@api_view(['GET'])
def get_locations(request):
    flat = {}
    for loc in LocationData.objects.all():
        flat[f"{loc.district}, {loc.state}"] = {
            "wind_speed": loc.wind_speed,
            "seismic_zone": loc.seismic_zone,
            "zone_factor": loc.zone_factor,
            "temp_max": loc.temp_max,
            "temp_min": loc.temp_min,
            "state": loc.state,
        }
    return Response(flat)

@api_view(['GET'])
def get_structure_types(request):
    return Response(["Highway", "Other"])

@api_view(['GET'])
def get_material_options(request):
    return Response({
        "steel_grades": ["E250", "E350", "E450"],
        "concrete_grades": ["M25", "M30", "M35", "M40", "M45", "M50", "M55", "M60"]
    })