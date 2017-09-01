import argparse
import sys

'''
creates a text file of key grammar from the anki deck so matome n2 grammar

'''

def make_file(file):
    f = open(file, 'r',  encoding='utf-8')
    raw = f.readlines()
    g_ist = []
    g_ist_print = []
    failures = []
    for r in raw:
        vals = r.split('\t')
        # +3 is the length of the <b>
        try:
            print(vals[0])
            grammar = vals[0][vals[0].index('<b>')+3:vals[0].index('</b>')]
        except ValueError:
            try:
                grammar = vals[0][vals[0].index('<b style=""text-decoration: underline; "">')
                              + 42:vals[0].index('</b>')]
            except ValueError:
                failures.append(vals[0])
                continue  # no bold, to hard to find the grammar.
        rule = vals[3]
        if grammar not in g_ist:
            g_ist.append(grammar)
            g_ist_print.append(grammar + "\t" + rule)
    f = open("g_list.txt", "w")
    for line in g_ist_print:
        f.write(line + '\n')

    f = open("fail_list.txt", "w")
    for line in failures:
        f.write(line + '\n')

    f.close()

def parse_arguments(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument('file', type=str, help='anki output txt file')
    return parser.parse_args(argv)


if __name__ == '__main__':
    arg = parse_arguments(sys.argv[1:])
    make_file(arg.file)
