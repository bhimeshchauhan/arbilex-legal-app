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
        console.log('**** ', res);
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
export { getAggregratedData }