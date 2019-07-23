import { equal } from 'assert';
import parser from '../src/parser';
import tokenizer from '../src/tokenizer';
import stringify from './assets/stringify';

const parse = (abbr: string) => parser(tokenizer(abbr));
const expand = (abbr: string) => parse(abbr).map(stringify).join('');

describe('CSS Abbreviation parser', () => {
    it('basic', () => {
        equal(expand('p10!'), 'p: 10 !important;');
        equal(expand('p-10-20'), 'p: -10 20;');
        equal(expand('p-10%-20--30'), 'p: -10% -20 -30;');
        equal(expand('p.5'), 'p: 0.5;');
        equal(expand('p-.5'), 'p: -0.5;');
        equal(expand('p.1.2.3'), 'p: 0.1 0.2 0.3;');
        equal(expand('p.1-.2.3'), 'p: 0.1 0.2 0.3;');
        equal(expand('10'), '?: 10;');
        equal(expand('.1'), '?: 0.1;');
    });

    it('color', () => {
        equal(expand('c#'), 'c: #000000;');
        equal(expand('c#1'), 'c: #111111;');
        equal(expand('c#f'), 'c: #ffffff;');
        equal(expand('c#a#b#c'), 'c: #aaaaaa #bbbbbb #cccccc;');
        equal(expand('c#af'), 'c: #afafaf;');
        equal(expand('c#fc0'), 'c: #ffcc00;');
        equal(expand('c#11.5'), 'c: rgba(17, 17, 17, 0.5);');
        equal(expand('c#.99'), 'c: rgba(0, 0, 0, 0.99);');
        equal(expand('c#t'), 'c: transparent;');
    });

    it('keywords', () => {
        equal(expand('m:a'), 'm: a;');
        equal(expand('m-a'), 'm: a;');
        equal(expand('m-abc'), 'm: abc;');
        equal(expand('m-a0'), 'm: a 0;');
        equal(expand('m-a0-a'), 'm: a 0 a;');
    });

    it('functions', () => {
        equal(expand('bg-lg(top,   "red, black",rgb(0, 0, 0) 10%)'), 'bg: lg(top, "red, black", rgb(0, 0, 0) 10%);');
        equal(expand('lg(top,   "red, black",rgb(0, 0, 0) 10%)'), '?: lg(top, "red, black", rgb(0, 0, 0) 10%);');
    });

    it('mixed', () => {
        equal(expand('bd1-s#fc0'), 'bd: 1 s #ffcc00;');
        equal(expand('bd#fc0-1'), 'bd: #ffcc00 1;');
        equal(expand('p0+m0'), 'p: 0;m: 0;');
        equal(expand('p0!+m0!'), 'p: 0 !important;m: 0 !important;');
    });

    it('embedded variables', () => {
        equal(expand('foo$bar'), 'foo: $bar;');
        equal(expand('foo$bar-2'), 'foo: $bar-2;');
        equal(expand('foo$bar@bam'), 'foo: $bar @bam;');
    });
});
