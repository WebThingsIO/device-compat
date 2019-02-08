#!/usr/bin/env python3

import json
import jsonschema
import re
import sys

_SCHEMA = './schema.json'
_LIST = './devices.json'


def main():
    models = set()

    # Load the schema.
    with open(_SCHEMA) as f:
        schema = json.load(f)

    try:
        jsonschema.Draft4Validator.check_schema(schema)
    except jsonschema.SchemaError as e:
        print('Schema validation failed: {}'.format(e))
        sys.exit(1)

    # Make sure the file is valid JSON
    try:
        with open(_LIST, 'rt') as f:
            devices = json.load(f)
    except (IOError, OSError, ValueError):
        print('Failed to read list file.')
        sys.exit(1)

    try:
        jsonschema.validate(devices, schema)
    except jsonschema.ValidationError as e:
        print('List validation failed: {}'.format(e))
        sys.exit(1)

    for device in devices:
        key = '{} {}'.format(
            re.sub(r'[^a-z0-9]', '', device['manufacturer'].lower()),
            re.sub(r'[^a-z0-9]', '', device['model'].lower()),
        )

        if key in models and device['manufacturer'] != 'Raspberry Pi':
            print('Duplicate device:', device)
            sys.exit(1)

        models.add(key)


if __name__ == '__main__':
    main()
