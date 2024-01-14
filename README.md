# WhatsApp Puppeteer Messaging App

## Description

This Node.js application uses Express and Puppeteer to automate the process of sending messages via WhatsApp Web. It's designed for personal use and allows sending messages through a REST API.

## Features

- Send WhatsApp messages programmatically to specified numbers.
- API key authentication for secure access.
- Easy setup and deployment.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed.
- A WhatsApp account for sending messages.

## Installation

To install the WhatsApp Puppeteer Messaging App, follow these steps:

1. Clone the repository:
   `git clone https://github.com/cell96/whatsapp-web-puppeteer.git`

2. Navigate to the project directory:
   `cd whatsapp-web-puppeteer`

3. Install dependencies:
   `npm install`

## Usage

To use the WhatsApp Puppeteer Messaging App, follow these steps:

1. Start the server:
   `npm start`

2. Send a POST request to `http://localhost:3000/api/send-message` with the API key in the headers and the following JSON body:
   ```
   {
       "number": "1234567890",
       "message": "Hello, World!"
   }
   ```
