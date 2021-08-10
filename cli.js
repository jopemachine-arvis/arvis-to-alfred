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

if (cli.input.length === 1) {
  converter(cli.input[0]);
} else if (cli.input.length > 1) {
  converter(cli.input[0], cli.input[1]);
}
