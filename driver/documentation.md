## Overview
This document provides an overview of the communication protocol used to interact with the HIOKI LR8513 data logger. The commands are sent in a specific format, and the device responds with relevant data or acknowledgments.

## Command Structure
Commands are sent in the following format:
```
<COMMAND>:<SUBCOMMAND>? <PARAMETERS>
```
Responses from the device are typically formatted as:
```
<RESPONSE>
```

## Commands and Responses

### 1. HELO
- **Command:** `HELO? [''] 1`
- **Response:** `ACK`
- **Description:** Initializes communication with the device. The device acknowledges the command with `ACK`.

### 2. MEMORY:DATETIME
- **Command:** `MEMORY:DATETIME?`
- **Response:** `2024,12,04,10,20,40`
- **Description:** Retrieves the current date and time stored in memory. The response format is `YYYY,MM,DD,HH,MM,SS`.

### 3. SYSTEM:DATETIME
- **Command:** `SYSTEM:DATETIME?`
- **Response:** `2024,12,10,17,11,45`
- **Description:** Retrieves the current system date and time. The response format is `YYYY,MM,DD,HH,MM,SS`.

### 4. MEMORY:CONFIG
- **Command:** `MEMORY:CONFIG?`
- **Response:** `0,1,5,1,0,1,0,0,0,0`
- **Description:** Retrieves the configuration settings from memory. The response consists of a series of integers representing different configuration parameters.

### 5. MEMORY:UNIT
- **Command:** `MEMORY:UNIT? <unit_number>`
- **Response:** 
  - For Unit 1: `1,1,0,0,0,0,1,0,0,0,0,190,0,0`
  - For Unit 2: `2,1,0,0,0,0,1,0,0,0,0,190,0,0`
- **Description:** Retrieves the status and configuration of a specified unit. The response includes various parameters related to the unit's configuration.

### 6. SCALING:SET
- **Command:** `SCALING:SET? <unit_number>?`
- **Response:** 
  - For Unit 1: `1,0,0,1.0000E+00,0.0000E+00,5.0000E-03,-5.0000E-03,5.0000E-03,-5.0000E-03,0,2,"A"`
  - For Unit 2: `2,0`
- **Description:** Retrieves the scaling settings for a specified unit. The response includes scaling factors and limits.

### 7. MEMORY:SAMPLE
- **Command:** `MEMORY:SAMPLE?`
- **Response:** `2,0,1.0000E+00,0.0000E+00,5.0000E-03,-5.0000E-03,5.0000E-03,-5.0000E-03,0,2,"A"`
- **Description:** Retrieves the most recent sample data stored in memory. The response includes various parameters related to the sample.

### 8. Device Identification
- **Command:** `*IDN?`
- **Response:** `HIOKI,LR8513,210348388,V9.20`
- **Description:** Retrieves the identification information of the device, including manufacturer, model, serial number, and firmware version.