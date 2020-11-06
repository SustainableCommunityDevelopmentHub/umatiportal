#!/usr/bin/env python3
# credit https://stackoverflow.com/users/5941954/db-sandyartha


import csv
import re
import unicodedata

from pathlib
import Path

source = Path('kodepos.csv')

def slugify(value):
  value = str(value)
value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
value = re.sub(r '[^\w\s-]', '', value).strip().lower()
return re.sub(r '[-\s]+', '-', value)

def write(path, row):
  file = open(path, 'w')
print('+++', file = file)
for key, value in row.items():
  if key != 'body':
  print(f '{key}= "{value}"', file = file)

print('+++\n', file = file)
if 'body' in row:
  print(row['body'], file = file)

def main():
  csv_file = open(source, newline = '')
csv_content = csv.DictReader(csv_file)
for row in csv_content:
  filename = slugify(row['title'])
path = Path(f '{filename}.md')
if not path.is_file():
  write(path, row)

if __name__ == '__main__':
  main()

