#!/usr/bin/env node
import meow from 'meow';
import converter from './converter';

const cli = meow(
	`
	Usage
		$ arvis-to-alfred [arvis-workflow.json]

	Examples
		$ arvis-to-alfred arvis-workflow.json
`
);

converter(...cli.input);