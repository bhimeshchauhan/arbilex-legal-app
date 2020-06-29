import json
import requests
from .utility import Utility
from rest_framework import status
from .parse import RecursiveScraper
from django.core import serializers
from datetime import datetime, timedelta
from collections import Counter, defaultdict
from rest_framework.response import Response
from rest_framework.decorators import api_view
from server.api.models import URLScraped, ColumnData
from .serializers import URLSerializer, ColumnSerializer, ColumnDataSerializer


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
def scrape_urls(request):
    if request.method == 'POST':
        url = request.data['url']
        rscraper = RecursiveScraper(url)
        data = rscraper.scrape()
        if(len(data) == 0):
            res = {"status": status.HTTP_200_OK , "data": "No urls found with the specified search term."}
            return Response(res)
        for item in data:
            submitData = {
                'url': item['url'],
                'columns': item['columns'],
                'active': item['active']
            }
            print('submit ', submitData)
            serializer = URLSerializer(data=submitData)
            qs = URLScraped.objects.filter(url=item['url'])
            retrieve_serializer = URLSerializer(instance=qs, many=True)
            if serializer.is_valid():
                serializer.save()
            else:
                print('*** ', serializer.errors)
        return Response(serializer.data)

@api_view(['GET', ])
def retrieve_case_url(request):
	try:
		links = URLScraped.objects.all()
	except URLScraped.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	
	if request.method == 'GET':
		serializer = URLSerializer(links, many=True)
		return Response(serializer.data)

@api_view(['GET', ])
def retrieve_columns_data(request):
    if request.method == 'GET':
        data = {
            'count': ColumnData.objects.count()
        }
        serializer = ColumnDataSerializer(data=data)
        if serializer.is_valid():
            return Response(json.dumps(serializer.data), status = status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', ])
def retrieve_all_columns(request):
    querySet = ColumnData.objects.all()
    print(querySet)
    if request.method == 'GET':
        data = serializers.serialize('json', querySet)
        return Response(json.dumps(data), status = status.HTTP_200_OK)

@api_view(['POST', 'DELETE', ])
def retrieve_columns(request):
    if request.method == 'POST':
        url = request.data['url']
        isValid = Utility.isValidURL(url)
        if not isValid:
            error = {
                "err": "Invalid URL."
            }
            return Response(error, status = status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        else:
            try:
                rscraper = RecursiveScraper(url)
                data = rscraper.get_data()
                for item in data:
                    serializer = ColumnSerializer(data=item)
                    if serializer.is_valid():
                        serializer.save()
            except Exception as e:
                error = {
                    "err": e
                }
                return Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status = status.HTTP_200_OK)
    elif request.method == 'DELETE':
        try:
            ColumnData.objects.all().delete()
        except Exception as e:
            error = {
                "err": e
            }
            return Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status = status.HTTP_200_OK)
    