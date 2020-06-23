from rest_framework import serializers
from server.api.models import URLScraped


class URLSerializer(serializers.ModelSerializer):
	class Meta:
		model = URLScraped
		fields = [
			'url',
			'columns',
		]