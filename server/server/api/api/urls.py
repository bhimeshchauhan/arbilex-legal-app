from django.urls import path
from server.api.api.views import (
	retrieve_justice_aggregation,
)


app_name = 'justices_data'

urlpatterns = [
	path('justices_data/', retrieve_justice_aggregation, name="alljustice"),
]
