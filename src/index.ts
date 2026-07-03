#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { parseArgs } from "node:util";
import { basename, extname, resolve } from "node:path";
import type { BundledTheme } from "shiki";
import { markdownToHtml } from "./convert.js";

function showHelp() {
  console.log(`
md2html — Convert Markdown to self-contained HTML

Usage:
  md2html [options] <input.md>

Options:
  -i, --input     Markdown file path
  -o, --output    Output HTML file path (default: same name with .html)
  -t, --theme     Shiki theme (default: github-light)
  -h, --help      Show this help

Examples:
  md2html README.md
  md2html -i README.md -o docs/index.html -t github-dark
`);
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      input: { type: "string", short: "i" },
      output: { type: "string", short: "o" },
      theme: { type: "string", short: "t", default: "github-light" as const },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: true,
  });

  if (values.help) {
    showHelp();
    process.exit(0);
  }

  const input = values.input ?? positionals[0];
  if (!input) {
    console.error("Error: input file is required.\n");
    showHelp();
    process.exit(1);
  }

  const inputPath = resolve(input);
  if (!existsSync(inputPath)) {
    console.error(`Error: file not found: ${inputPath}`);
    process.exit(1);
  }

  const outputPath = values.output
    ? resolve(values.output)
    : resolve(inputPath.replace(/\.md$/i, ".html"));

  const markdown = readFileSync(inputPath, "utf-8");
  const title = basename(inputPath, extname(inputPath));

  try {
    const html = await markdownToHtml(markdown, {
      title,
      theme: values.theme as BundledTheme,
    });
    writeFileSync(outputPath, html, "utf-8");
    console.log(`✓ Converted: ${outputPath}`);
  } catch (err) {
    console.error("Error: conversion failed", err);
    process.exit(1);
  }
}

main();
