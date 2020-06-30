import axios from 'axios';

const aggregatedData = [
    {
        'name': 'Number of Justice',
        'value': 0,
        'id': 'count_justice'
    },
    {
        'name': 'Number of Cases',
        'value': 0,
        'id': 'count_cases'
    },
    {
        'name': 'Average duration of justice team (in years)',
        'value': 0,
        'id': 'avg_service_duration'
    },
    {
        'name': 'Most represented nominating party',
        'value': 0,
        'id': 'avg_nominating_party'
    },
    {
        'name': 'Most represented law school',
        'value': 0,
        'id': 'avg_law_school'
    }
]

const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

const getColumnData = async () => {
    return await axios.get('http://localhost:8000/api/columns_data/')
    .then((response) => {
        return JSON.parse(response.data)
    })
}

const getAggregratedData = async () => {
    return await axios.get('http://localhost:8000/api/justices_data/')
    .then(async (response) => {
        const res = response.data.data
        var column_data = {}
        await getColumnData().then(data => {
            column_data = data
        })
        aggregatedData.find(someobject => someobject.id == 'count_justice').value = res.count
        aggregatedData.find(someobject => someobject.id == 'count_cases').value = column_data.count
        aggregatedData.find(someobject => someobject.id == 'avg_service_duration').value = res.avg_service_duration
        aggregatedData.find(someobject => someobject.id == 'avg_nominating_party').value = getKeyByValue(res.avg_nominating_party.data, res.avg_nominating_party.max)
        aggregatedData.find(someobject => someobject.id == 'avg_law_school').value = getKeyByValue(res.avg_law_school.data, res.avg_law_school.max)
        return aggregatedData;
    });
}

const colorData = {
    "0": "Millitary Experience",
    "1": "Law School",
    "2": "Party Appointed By"
}

const colorDataString = {
    '4': {
        'federalist': '#E2BFF1',
        'democratic republican': '#8FD82C',
        'democrat': '#205024',
        'whig': '#4F24C1',
        'republican': '#F47602',
        'independent': '#1CC977'
    },
    '2': {
        'new york militia': '#156468',
        'did not serve in the military': '#7ECF3F',
        'maryland militia': '#DBACEA',
        'minutemen': '#89B244',
        'continental army': '#4EE831',
        'georgia militia': '#EC7641',
        'army': '#C67EE4',
        'union army': '#03D1AC',
        'confederate army': '#FFD19B',
        'army air force': '#7B886C',
        'navy': '#7781CA',
        'national guard': '#857189',
        'army reserve': '#5DE9D1',
    },
    '3': {
        'no law school education': '#916BE5',
        'middle temple (england)': '#2E9885',
        'william and mary, college of': '#65EC64',
        'litchfield (tapping reeve) law school': '#7F7574',
        'harvard university': '#692BDE',
        'yale university': '#DFB969',
        'transylvania': '#75123C',
        'albany': '#5CB608',
        'cumberland university': '#3A5ACF',
        'tulane university': '#A89732',
        'columbia university': '#881A8C',
        'michigan, university of': '#EE1064',
        'cincinnati, university of': '#AA0608',
        'washington and lee university': '#2C7A83',
        'virginia, university of': '#24327E',
        'pennsylvania, university of': '#6244AE',
        'alabama, university of': '#513560',
        'paris, university of': '#E86E30',
        'colorado, university of': '#E6EACD',
        'centre college': '#D709F8',
        'texas, university of': '#A71D59',
        'indiana university': '#68AF16',
        'california, university of': '#149CCD',
        'new york university': '#EC7548',
        'kansas city': '#B26DF6',
        'northwestern university': '#0DB408',
        'howard university': '#B44697',
        'st. paul': '#8376B4',
        'stanford university': '#DD6136'
    }
}
export { getAggregratedData, colorData, colorDataString }