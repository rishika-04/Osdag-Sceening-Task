from django.db import models

class LocationData(models.Model):
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    wind_speed = models.FloatField()
    seismic_zone = models.CharField(max_length=10)
    zone_factor = models.FloatField()
    temp_max = models.FloatField()
    temp_min = models.FloatField()

    class Meta:
        unique_together = ('state', 'district')
        ordering = ['state', 'district']

    def __str__(self):
        return f"{self.district}, {self.state}"