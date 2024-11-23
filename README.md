# Minecraft Server in TypeScript

A lightweight Minecraft server implementation written in TypeScript. This project is purely educational and serves as a learning resource for understanding:

- Minecraft's network protocol
- Server architecture
- TypeScript implementation
- Clean Architecture principles

## 🎓 Educational Purpose

This project is created for educational purposes only. It demonstrates:

- How the Minecraft protocol works
- Implementation of network protocols in TypeScript
- Application of Clean Architecture principles
- Basic game server development concepts

## 🚀 Features

- Basic server implementation
- Protocol handling for Minecraft 1.21.3
- Support for basic player connections
- Flat world generation
- Creative mode support

## 🛠️ Technology Stack

- TypeScript
- Node.js
- Clean Architecture

## 🏗️ Project Structure

```plaintext file="tree.txt"
src/
├── domain/         # Core business rules and entities
├── application/    # Application business rules
├── infrastructure/ # External interfaces (database, network, etc)
└── interfaces/     # Entry points and controllers
└── assets/         # Static assets (images, sounds, etc)
└── main.ts         # Entry point for the server
```

## 🚦 Getting Started

1. Clone the repository
```bash
git clone REPOSITORY_URL
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm run dev
```
The server will start on port 25565 (default Minecraft server port).

## 📝 License

MIT License:

```markdown file="LICENSE" type="markdown"
MIT License

Copyright (c) 2024 JuLiAnChz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```