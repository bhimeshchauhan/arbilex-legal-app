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

class URLScraped(models.Model):
    id = models.IntegerField(primary_key=True)
    url = models.CharField(max_length=2000)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.url

class ColumnData(models.Model):
    id = models.IntegerField(primary_key=True)
    adminAction = models.IntegerField(default=0)
    adminActionState = models.IntegerField(default=0)
    authorityDecision1 = models.FloatField(default=0)
    authorityDecision2 = models.IntegerField(default=0) 
    caseDisposition = models.FloatField(default=0) 
    caseDispositionUnusual = models.FloatField(default=0)
    caseId = models.CharField(max_length=2000, unique=True)
    caseIssuesId = models.CharField(max_length=2000)
    caseName = models.CharField(max_length=2000)
    caseOrigin = models.FloatField(default=0)
    caseOriginState = models.IntegerField(default=0)
    caseSource = models.FloatField(default=0)
    caseSourceState = models.IntegerField(default=0)
    certReason = models.FloatField(default=0)
    chief = models.CharField(max_length=2000)
    dateArgument = models.CharField(max_length=2000)
    dateDecision = models.CharField(max_length=2000)
    dateRearg = models.CharField(max_length=2000)
    decisionDirection = models.FloatField(default=0)
    decisionDirectionDissent = models.FloatField(default=0)
    decisionType = models.FloatField(default=0)
    declarationUncon = models.FloatField(default=0)
    docket = models.CharField(max_length=2000)
    docketId = models.CharField(max_length=2000)
    issue = models.FloatField(default=0)
    issueArea = models.FloatField(default=0)
    jurisdiction = models.FloatField(default=0)
    lawMinor = models.CharField(max_length=2000)
    lawSupp = models.FloatField(default=0)
    lawType = models.FloatField(default=0)
    lcDisagreement = models.FloatField(default=0)
    lcDisposition = models.IntegerField(default=0)
    lcDispositionDirection = models.FloatField(default=0)
    ledCite = models.CharField(max_length=2000)
    lexisCite = models.CharField(max_length=2000)
    majOpinAssigner = models.FloatField(default=0)
    majOpinWriter = models.FloatField(default=0)
    majVotes = models.FloatField(default=0)
    minVotes = models.FloatField(default=0)
    naturalCourt = models.IntegerField(default=0)
    partyWinning = models.FloatField(default=0)
    petitioner = models.FloatField(default=0)
    petitionerState = models.IntegerField(default=0)
    precedentAlteration = models.FloatField(default=0)
    respondent = models.FloatField(default=0)
    respondentState = models.IntegerField(default=0)
    sctCite = models.CharField(max_length=2000)
    splitVote = models.IntegerField(default=0)
    term = models.IntegerField(default=0)
    threeJudgeFdc = models.FloatField(default=0)
    usCite = models.CharField(max_length=2000)
    voteId = models.CharField(max_length=2000)
    voteUnclear = models.FloatField(default=0)

    def __int__(self):
        return self.id


class ColumnDataDetail(models.Model):
    count = models.IntegerField()

    def __str__(self):
        return self.data