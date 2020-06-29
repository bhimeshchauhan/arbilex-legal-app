from rest_framework import serializers
from server.api.models import URLScraped, ColumnData, ColumnDataDetail


class URLSerializer(serializers.ModelSerializer):
	class Meta:
		model = URLScraped
		fields = [
			'url',
            'active',
		]

class ColumnDataSerializer(serializers.ModelSerializer):
	class Meta:
		model = ColumnDataDetail
		fields = [
            'count',
		]

class ColumnSerializer(serializers.ModelSerializer):
	class Meta:
		model = ColumnData
		fields = [
			'adminAction',
			'adminActionState',
			'authorityDecision1',
			'authorityDecision2',
			'caseDisposition',
			'caseDispositionUnusual',
			'caseId',
			'caseIssuesId',
			'caseName',
			'caseOrigin',
			'caseOriginState',
			'caseSource',
			'caseSourceState',
			'certReason',
			'chief',
			'dateArgument',
			'dateDecision',
			'dateRearg',
			'decisionDirection',
			'decisionDirectionDissent',
			'decisionType',
			'declarationUncon',
			'docket',
			'docketId',
			'issue',
			'issueArea',
			'jurisdiction',
			'lawMinor',
			'lawSupp',
			'lawType',
			'lcDisagreement',
			'lcDisposition',
			'lcDispositionDirection',
			'ledCite',
			'lexisCite',
			'majOpinAssigner',
			'majOpinWriter',
			'majVotes',
			'minVotes',
			'naturalCourt',
			'partyWinning',
			'petitioner',
			'petitionerState',
			'precedentAlteration',
			'respondent',
			'respondentState',
			'sctCite',
			'splitVote',
			'term',
			'threeJudgeFdc',
			'usCite',
			'voteId',
			'voteUnclear',
		]