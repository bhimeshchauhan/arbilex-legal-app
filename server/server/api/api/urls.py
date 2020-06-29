from django.urls import path
from server.api.api.views import (
	retrieve_justice_aggregation,
	scrape_urls,
	retrieve_case_url,
	retrieve_columns,
	retrieve_columns_data,
	retrieve_all_columns
)


app_name = 'justices_data'

urlpatterns = [
	path('justices_data/', retrieve_justice_aggregation, name="alljustice"),
	path('scrape_urls/', scrape_urls, name="allUrls"),
	path('case_urls/', retrieve_case_url, name="allCaseURL"),
	path('columns/', retrieve_columns, name="urlColumns"),
	path('columns_data/', retrieve_columns_data, name="urlColumns"),
	path('columns_graph_data/', retrieve_all_columns, name="urlColumns"),
]
