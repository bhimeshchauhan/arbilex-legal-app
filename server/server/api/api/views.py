from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from .parse import RecursiveScraper

import requests


def data_aggregation(data):
    aggregated_data = defaultdict(dict)
    aggregated_data['count'] = len(data)
    military_service = [d['military_service'] for d in data]
    tally = Counter(military_service)
    aggregated_data['avg_military_service']['data'] = tally
    aggregated_data['avg_military_service']['max'] = tally[max(tally, key=tally.get)]

    is_active = [d['is_active'] for d in data]
    tally = Counter(is_active)
    aggregated_data['avg_is_active']['data'] = tally
    aggregated_data['avg_is_active']['max'] =  tally[max(tally, key=tally.get)]

    nominating_party = [d['nominating_party'] for d in data]
    tally = Counter(nominating_party)
    aggregated_data['avg_nominating_party']['data'] = tally
    aggregated_data['avg_nominating_party']['max'] =  tally[max(tally, key=tally.get)]

    law_school = [d['law_school'] for d in data]
    tally = Counter(law_school)
    aggregated_data['avg_law_school']['data'] = tally
    aggregated_data['avg_law_school']['max'] =  tally[max(tally, key=tally.get)]

    state_of_birth = [d['state_of_birth'] for d in data]
    tally = Counter(state_of_birth)
    aggregated_data['avg_state_of_birth']['data'] = tally
    aggregated_data['avg_state_of_birth']['max'] =  tally[max(tally, key=tally.get)]

    for d in data:
        if d['finish_date'] and d['start_date']:
            avg_service_duration = [datetime.strptime(d['finish_date'], "%Y-%m-%dT%H:%M:%S") - datetime.strptime(d['start_date'], "%Y-%m-%dT%H:%M:%S")]
    avg_time = (sum(avg_service_duration, timedelta()) / len(avg_service_duration)).total_seconds()
    aggregated_data['avg_service_duration'] = avg_time//(365.25*24*60*60)
    return aggregated_data

@api_view(['GET', ])
def retrieve_justice_aggregation(request):
    try:
        url = "http://frontend-exercise-api.herokuapp.com/justices/"
        response = requests.get(url)
        justice = {"status": status.HTTP_200_OK , "data": data_aggregation(response.json())}
    except requests.exceptions.RequestException as e:
        return Response(status=status.HTTP_404_NOT_FOUND, error=e)

    if request.method == 'GET':
        return Response(justice)


@api_view(['POST', ])
def retrieve_urls(request):
    if request.method == 'POST':
        return Response(request.data)
        # rscraper = RecursiveScraper("http://scdb.wustl.edu/")
        # data = rscraper.scrape()
        # return Response(data)