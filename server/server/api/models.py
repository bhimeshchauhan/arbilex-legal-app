from django.db import models


class Justice(models.Model):
    avg_service_duration = models.FloatField()

    @property
    def avg_is_active(self):
        return {}

    @property
    def avg_nominating_party(self):
        return {}

    @property
    def avg_military_service(self):
        return {}
    
    @property
    def avg_law_school(self):
        return {}
    
    @property
    def avg_state_of_birth(self):
        return {}

    def __str__(self):
        return self.avg_service_duration