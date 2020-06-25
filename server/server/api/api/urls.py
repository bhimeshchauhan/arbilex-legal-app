from django.urls import path
from server.api.api.views import (
	retrieve_justice_aggregation,
	scrape_urls,
	retrieve_case_url,
	retrieve_columns
)


app_name = 'justices_data'

urlpatterns = [
	path('justices_data/', retrieve_justice_aggregation, name="alljustice"),
	path('scrape_urls/', scrape_urls, name="allUrls"),
	path('case_urls/', retrieve_case_url, name="allCaseURL"),
	path('columns/', retrieve_columns, name="urlColumns"),
]
