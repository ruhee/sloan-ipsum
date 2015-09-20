#!/usr/bin/python
import json
import urllib2
import requests
from bs4 import BeautifulSoup

# manual list to ignore special releases, live albums etc (no repeat lyrics)
albums = [
	'peppermint',
	'smeared',
	'twice-removed',
	'one-chord-to-another',
	'navy-blues',
	'between-the-bridges',
	'pretty-together',
	'action-pact',
	'a-sides-win-singles-1992-2005',
	'never-hear-the-end-of-it',
	'parallel-play',
	'hit-run',
	'the-double-cross'
	# 'commonwealth'
]

data = []
url = 'http://www.sloanmusic.com/release/'
song_urls = []

def strip_for_urls(s):
	return s.replace(' ','-').replace(u'\u2019',"").replace(u'\u2032',"").replace('?','').replace('(','').replace(')','').replace(',','')

def strip_for_text(s):
	return s.lstrip().replace(u'\u2019',"'").replace(u'\u201c','"').replace(u'\u201d','"').replace(u'\u2032',"'").replace(u'\u2018',"'").replace(u'\u2013','-').replace(u'\u2014','-').replace(u'\u2026','').replace(u'\u62ae',"'r")

# first get a list of all the songs in each album
for a in albums:
	print 'Reading',a,'...'

	req = urllib2.Request(url+a, headers={'User-Agent' : 'friendly scraper, thank you!'})
	soup = BeautifulSoup(urllib2.urlopen(req).read())

	for song_list in soup.find('ol').find_all('a'):
		songs = song_list.strings
		for song in songs:
			song = "".join(song).lower()
			song = strip_for_urls(song)
			if a == 'peppermint' and (song != 'torn' and song != 'lucky-for-me' and song != 'pretty-voice'):
				pass
			elif a == 'a-sides-win-singles-1992-2005' and (song != 'try-to-make-it' and song != 'all-used-up'):
				pass
			elif song == 'take-the-bench':
				song_urls.append('the-the-bench') # sooooomebody made a typo on the sloan website
			else:
				song_urls.append(song)

# then loop through all the songs and grab the lyrics!
for song in song_urls:
	print 'Scraping',song,'...'
	req = urllib2.Request('http://www.sloanmusic.com/song/'+song, headers={ 'User-Agent': 'friendly scraper, thank you!'})
	soup = BeautifulSoup(urllib2.urlopen(req).read())

	for paragraph in soup.find('div', attrs={'class': 'entry-content'}).find_all('p'):
		paragraph = paragraph.contents
		for p in paragraph:
			if p.find('<br') == -1:
				p = strip_for_text(p)
				data.append(p)

json.dump(data, open("data/sloan.json", 'w'), indent=1)