#!/usr/bin/env node
const express = require('express');
const path = require('path');
// const open = require('open');

const app = express();
const PORT = 3001;

// 提供静态文件
app.use(express.static(path.join(__dirname, './public')));

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server running at ${url}`);
//   open(url); // 自动打开浏览器
});