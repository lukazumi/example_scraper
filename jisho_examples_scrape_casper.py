import os
import sys
import subprocess
from subprocess import Popen, CREATE_NEW_CONSOLE
import argparse


CASPERJS_EXECUTABLE = "C:/casperjs/bin/casperjs.exe"
CASPERJS_SCRIPT = os.path.join(sys.path[0], "casperScrape_xpath.js")


def start_bulk_scrap(search_list):
    for search in search_list:
        url_part1 = "http://jisho.org/search/"
        url_part2 = search
        url_part3 = "%20%23sentences"

        scrape_me = url_part1 + url_part2 + url_part3
        # scrape_me = url_part1 + url_part2 + url_part3 + "?page=2" #debug, skip to page 2 (above line is real code)

        print("scraping " + scrape_me)
		# the casper js file writes the output text file.
        result = scrape_url(scrape_me, search)

        cnt = 2
        while str('thereismore') in str(result):
            url_part4 = "?page=" + str(cnt)
            print("scraping " + scrape_me + url_part4)
            result = scrape_url(scrape_me + url_part4, search)
            cnt += 1


def scrape_url(scrape_me, search):
    # the casper script writes the text file
    # Popen([CASPERJS_EXECUTABLE, CASPERJS_SCRIPT, scrape_me], creationflags=CREATE_NEW_CONSOLE)
    std_out = subprocess.check_output([CASPERJS_EXECUTABLE, CASPERJS_SCRIPT, scrape_me, search])
    return std_out


def parse_arguments(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument('search', type=str, help='search string')
    return parser.parse_args(argv)


if __name__ == '__main__':
    arg = parse_arguments(sys.argv[1:])
    search_lst = []
    search_lst.append(arg.search)
    start_bulk_scrap(search_lst)
