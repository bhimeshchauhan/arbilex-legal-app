import re
from urllib.request import urlopen
from urllib.parse import urljoin, urlsplit, SplitResult
import requests
from bs4 import BeautifulSoup


class RecursiveScraper:
    ''' Scrape URLs in a recursive manner.
    '''
    def __init__(self, url):
        ''' Constructor to initialize domain name and main URL.
        '''
        self.domain = urlsplit(url).netloc
        self.mainurl = url
        self.urls = set()
        self.count = 0
        self.files = set()

    def preprocess_url(self, referrer, url):
        ''' Clean and filter URLs before scraping.
        '''
        if not url:
            return None

        fields = urlsplit(urljoin(referrer, url))._asdict() # convert to absolute URLs and split
        fields['path'] = re.sub(r'/$', '', fields['path']) # remove trailing /
        fields['fragment'] = '' # remove targets within a page
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
                # Return URL only if it's not already in list
                return cleanurl

        return None

    def is_searchable(self, url):
        http_message = requests.head(url).headers["content-type"]
        print('http_message',http_message, " : ", url)
        full = http_message
        main = http_message.split('/')[0]
        if main == 'application':
            print('saving... ', url)
            self.files.add(url)
        return (main == 'text' and full == 'text/html')

    def scrape(self, url=None):
        ''' Scrape the URL and its outward links in a depth-first order.
            If URL argument is None, start from main page.
        '''
        if url is None:
            url = self.mainurl

        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'lxml')
        self.urls.add(url)
        if self.is_searchable(url):
            print(self.count, "Scraping {:s} ...".format(url))
            self.count += 1
            for link in soup.findAll("a"):
                childurl = self.preprocess_url(url, link.get("href"))
                if childurl and self.is_searchable(childurl):
                    self.scrape(childurl)
        return self.files

    
    