#!/usr/bin/env python3
import os, sys, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from api.views import LOCATION_DB
from api.models import LocationData

def load_data():
    created = skipped = 0
    for state, districts in LOCATION_DB.items():
        for district, data in districts.items():
            obj, was_created = LocationData.objects.get_or_create(
                state=state, district=district,
                defaults={
                    'wind_speed': data['wind_speed'],
                    'seismic_zone': data['seismic_zone'],
                    'zone_factor': data['zone_factor'],
                    'temp_max': data['temp_max'],
                    'temp_min': data['temp_min'],
                }
            )
            if was_created: created += 1
            else: skipped += 1
    print(f"Created: {created}, Skipped: {skipped}, Total: {LocationData.objects.count()}")

if __name__ == '__main__':
    load_data()