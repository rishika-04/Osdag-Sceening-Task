from django.urls import path
from . import views

urlpatterns = [
    # Legacy
    path('locations/', views.get_locations),
    path('structure-types/', views.get_structure_types),
    path('material-options/', views.get_material_options),

    # ✅ NEW (query param based — frontend should use this)
    path('states/', views.get_states),
    path('districts/', views.get_districts),
    path('location-data/', views.get_location_data),

    # ✅ LEGACY SUPPORT (so old frontend doesn’t break)
    path('states/<str:state>/districts/', views.get_districts_path),
    path('states/<str:state>/districts/<str:district>/data/', views.get_location_data_path),
]