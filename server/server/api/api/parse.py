import re
import csv
from urllib.request import urlopen
from urllib.parse import urljoin, urlsplit, SplitResult
import requests
from bs4 import BeautifulSoup

import io
from zipfile import ZipFile
import pandas as pd


class RecursiveScraper:
    ''' 
    Scrape URLs in a recursive manner.
    '''
    def __init__(self, url):
        ''' 
        Constructor to initialize domain name and main URL.
        '''
        self.domain = urlsplit(url).netloc
        self.mainurl = url
        self.urls = set()
        self.count = 0
        self.files = []

    def preprocess_url(self, referrer, url):
        ''' 
        Clean and filter URLs before scraping.
        '''
        if not url:
            return None

        fields = urlsplit(urljoin(referrer, url))._asdict()
        fields['path'] = re.sub(r'/$', '', fields['path']) 
        fields['fragment'] = ''
        fields = SplitResult(**fields)
        if fields.netloc == self.domain:
            # Scrape pages of current domain only
            if fields.scheme == 'http':
                httpurl = cleanurl = fields.geturl()
                httpsurl = httpurl.replace('http:', 'https:', 1)
            else:
                httpsurl = cleanurl = fields.geturl()
                httpurl = httpsurl.replace('https:', 'http:', 1)
            if httpurl not in self.urls and httpsurl not in self.urls:
                return cleanurl

        return None

    def is_searchable(self, url):
        http_message = requests.head(url).headers["content-type"]
        full = http_message
        main = http_message.split('/')[0]
        if ((main == 'application') and (("2019" in url and "caseCentered" in url) or ("Legacy" in url and "caseCentered" in url)) and "csv"in url and url not in self.urls):
            if not any(d.get('url', url) == url for d in self.files):
                # columns = self.get_columns(url).tolist()
                # SCDB_2019_01_caseCentered_Citation.xlsx.zip
                self.files.append({'url': url, 'columns': [], 'active': True})
                self.urls.add(url)
        return (main == 'text' and full == 'text/html' and url not in self.urls)

    def scrape(self, url=None):
        ''' 
        Scrape the URL and its outward links uding DFS. If URL argument is None, start from main page.
        '''
        if url is None:
            url = self.mainurl

        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'lxml')
        if self.is_searchable(url):
            self.urls.add(url)
            self.count += 1
            for link in soup.findAll("a"):
                childurl = self.preprocess_url(url, link.get("href"))
                if childurl and self.is_searchable(childurl):
                    self.scrape(childurl)
        return self.files

    def get_data(self, url=None):
        if url is None:
            url = self.mainurl
        urlData = urlopen(url).read()
        csv_file = ZipFile(io.BytesIO(urlData))
        for item in csv_file.namelist():
            f = csv_file.open(item)
            try:
                case_csv = pd.read_csv(f,encoding='cp1252')
                case_csv.fillna(0, inplace=True)
                print('row ', case_csv.shape)
            except Exception as e:
                raise(e)
        return case_csv.to_dict('records')
    
    def isValidURL(self, url):
        regex = re.compile(
            r'^(?:http|ftp)s?://' # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
            r'localhost|' #localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
            r'(?::\d+)?' # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return re.match(regex, url) is not None