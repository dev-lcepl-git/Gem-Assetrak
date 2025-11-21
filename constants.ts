import { Asset, AssetStatus } from './types';

export const INITIAL_ASSETS: Asset[] = [
  // --- Page 1: Raw Water Pumps ---
  {
    id: 'RWP-001',
    name: 'Raw Water Pump',
    category: 'Pump',
    model: 'UP 150/56 (HSC)',
    make: 'Kirloskar Brothers LTD',
    quantity: 4,
    specifications: {
      Head: '78m',
      Flow: '334.80 m3/hr',
      KW: '110',
      Motor: '3 Phase Induction Motor',
      Type: 'HSC'
    },
    status: AssetStatus.ATTENTION_NEEDED,
    location: 'Raw Water Pump House',
    notes: '3 pumps working. 1 pump has water leakage from sleeve both sides. Requires immediate spare replacement.',
    spareParts: [
      { name: 'Bearing DE', materialOrMake: 'SKF' },
      { name: 'Bearing NDE', materialOrMake: 'SKF' },
      { name: 'Shaft Sleeve DE/NDE', materialOrMake: 'CI / SS-410' },
      { name: 'Lock washer Bearing', materialOrMake: 'CS' },
      { name: 'Lock nut Bearing', materialOrMake: 'CS' },
      { name: 'O-Ring set', materialOrMake: 'Rubber' },
      { name: 'Oil Seat set', materialOrMake: 'Rubber' },
      { name: 'Wear Ring', materialOrMake: 'Bronze' },
      { name: 'Gland Flange', materialOrMake: 'CI' },
      { name: 'Liquid Deflector', materialOrMake: 'Rubber' }
    ],
    installationDate: '2020-01-15',
    warrantyExpDate: '2023-01-15',
    lastServiceDate: '2023-12-01',
    nextServiceDueDate: '2024-03-01',
    serviceHistory: [
        {
            id: 'SR-001',
            date: '2023-12-01',
            type: 'Preventive',
            performer: 'Tech A',
            notes: 'Routine lubrication and alignment check.'
        },
        {
            id: 'SR-002',
            date: '2023-06-15',
            type: 'Corrective',
            performer: 'Tech B',
            notes: 'Replaced minor seal on pump 2.'
        }
    ]
  },
  {
    id: 'RWAP-002',
    name: 'Raw Water Auxiliary Pump',
    category: 'Pump',
    model: 'MF 25/30 (HSC)',
    make: 'Kirloskar Brothers Ltd',
    quantity: 2,
    specifications: {
      Head: '4.6 m',
      Discharge: '669.6 m3/hr',
      KW: '15',
      Motor: '3 Phase Induction Motor',
      MotorMake: 'Crompton Greaves LTD'
    },
    status: AssetStatus.WORKING,
    location: 'Raw Water Pump House',
    notes: 'All are working.',
    spareParts: [],
    installationDate: '2022-06-20',
    warrantyExpDate: '2025-06-20',
    lastServiceDate: '2023-11-15',
    nextServiceDueDate: '2024-05-15'
  },
  // --- Page 1/2: Clear Water Pump ---
  {
    id: 'CWP-003',
    name: 'Clear Water Pump',
    category: 'Pump',
    model: 'DSM 125/40 (HSC)',
    make: 'Kirloskar',
    quantity: 4,
    specifications: {
      Head: '62 m',
      KW: '55',
      Motor: '3 Phase Induction Motor',
      MotorMake: 'Crompton Greaves LTD'
    },
    status: AssetStatus.MAINTENANCE,
    location: 'Clear Water Pump House',
    notes: '3 working, 1 under maintenance. Motors are working.',
    spareParts: [
      { name: 'Shaft', materialOrMake: 'SS-410' },
      { name: 'Impeller I', materialOrMake: 'Bronze' },
      { name: 'Impeller II', materialOrMake: 'Bronze' },
      { name: 'Bearing DE', materialOrMake: 'SKF' },
      { name: 'Bearing NDE', materialOrMake: 'SKF' },
      { name: 'Shaft Sleeve DE/NDE', materialOrMake: 'Bronze / SS-410' },
      { name: 'Shaft Sleeve Nut', materialOrMake: 'Bronze' },
      { name: 'Lock Washer/Nut', materialOrMake: 'CS' },
      { name: 'O-Ring Set', materialOrMake: 'Rubber' },
      { name: 'Wear Rings', materialOrMake: 'Bronze' },
      { name: 'Shoulder Ring', materialOrMake: 'MS' },
      { name: 'Interstage Ring', materialOrMake: 'Bronze' },
      { name: 'Gland Flange', materialOrMake: 'CI' },
      { name: 'Throat Bush', materialOrMake: 'CI' },
      { name: 'Liquid Deflector', materialOrMake: 'Rubber' },
      { name: 'Set of Keys', materialOrMake: 'Bronze' },
      { name: 'Lantern Rings', materialOrMake: 'Nylon' }
    ],
    installationDate: '2019-05-10',
    warrantyExpDate: '2021-05-10',
    lastServiceDate: '2023-01-10',
    nextServiceDueDate: '2023-07-10' // Intentionally Overdue
  },
  // --- Page 2: Sump Tank & Flow Meter ---
  {
    id: 'RWLT-004',
    name: 'Raw Water Level Transmitter',
    category: 'Sensor',
    model: 'LST200',
    make: 'ABB Engineering SHANGHAI LTD',
    quantity: 2,
    specifications: {
      Type: 'Ultrasonic Level Transmitter',
      Range: '0.35-8m',
      Output: '4-20mA',
      Protection: 'IP66/67'
    },
    status: AssetStatus.WORKING,
    location: 'Sump Tank',
    notes: 'Working.',
    spareParts: [],
    installationDate: '2023-01-01',
    warrantyExpDate: '2026-01-01',
    lastServiceDate: '2023-12-15',
    nextServiceDueDate: '2024-06-15'
  },
  // --- Page 3: Sensors & Flash Mixer ---
  {
    id: 'PT-005',
    name: 'Pressure Transmitter Raw Water',
    category: 'Sensor',
    model: 'A-10',
    make: 'WIKA',
    quantity: 1,
    specifications: {
      Type: 'Pressure Transmitter'
    },
    status: AssetStatus.WORKING,
    location: 'Raw Water Pump House',
    notes: 'Working.',
    spareParts: [],
    installationDate: '2022-03-01',
    warrantyExpDate: '2023-03-01',
    lastServiceDate: '2023-09-01',
    nextServiceDueDate: '2024-03-01'
  },
  {
    id: 'FM-006',
    name: 'Raw Water Flow Meter',
    category: 'Sensor',
    model: 'Promag L',
    make: 'Endress + Hauser',
    quantity: 1,
    specifications: {
       Type: 'Electromagnetic'
    },
    status: AssetStatus.WORKING,
    location: 'Inlet',
    notes: 'Working.',
    spareParts: [],
    installationDate: '2021-08-15',
    warrantyExpDate: '2024-08-15',
    lastServiceDate: '2023-08-15',
    nextServiceDueDate: '2024-02-15'
  },
  {
    id: 'FMA-007',
    name: 'Flash Mixer Agitator',
    category: 'Mixer',
    model: 'Custom',
    make: 'Remi Process Plant & Machinery LTD (VSC)',
    quantity: 1,
    specifications: {
      HP: '5',
      KW: '3.7',
      Motor: '3 Phase Induction motor',
      MotorMake: 'Remi Elektrotechnik LTD. (VSC)'
    },
    status: AssetStatus.WORKING,
    location: 'Flash Mixer',
    notes: 'Working.',
    spareParts: [],
    installationDate: '2020-02-20',
    warrantyExpDate: '2023-02-20',
    lastServiceDate: '2023-11-20',
    nextServiceDueDate: '2024-05-20'
  },
  // --- Page 4: Clarifloculator ---
  {
    id: 'CLARI-008',
    name: 'Clarifloculator Agitator',
    category: 'Mixer',
    model: 'Premium Worm Reducer (HSC)',
    make: 'Premium Transmission LTD',
    quantity: 4,
    specifications: {
      GearboxType: 'Premium worm Reducer',
      MotorType: '3 phas Induction Motor',
      KW: '0.75',
      MotorMake: 'Crompton Greaves LTD'
    },
    status: AssetStatus.ATTENTION_NEEDED,
    location: 'Clarifloculator',
    notes: '1 working, 1 under maintenance, 2 need to be pulled up (stuck). Name plates not visible.',
    spareParts: [],
    installationDate: '2018-01-01',
    warrantyExpDate: '2019-01-01',
    lastServiceDate: '2022-12-01',
    nextServiceDueDate: '2023-06-01' // Overdue
  },
  {
    id: 'CLARI-009',
    name: 'Clarifloculator Rail Rotating',
    category: 'Mechanism',
    model: 'Premium Worm Reducer',
    make: 'Premium Transmission LTD',
    quantity: 1,
    specifications: {
      MotorKW: '1.10',
      MotorType: '3 phas Induction Motor',
      MotorMake: 'Crompton Greaves LTD'
    },
    status: AssetStatus.ATTENTION_NEEDED,
    location: 'Clarifloculator',
    notes: '1 Nos Roller Bearing need to be Replaced.',
    spareParts: [
        { name: 'Roller Bearing', materialOrMake: 'Generic' }
    ],
    installationDate: '2018-01-01',
    warrantyExpDate: '2019-01-01',
    lastServiceDate: '2023-01-01',
    nextServiceDueDate: '2023-07-01' // Overdue
  },
  // --- Page 4/5: Chemical House ---
  {
    id: 'CHEM-010',
    name: 'Chemical House Metering Pump',
    category: 'Pump',
    model: 'DP/6/DLA/127',
    make: 'Shapatools',
    quantity: 4,
    specifications: {
      Capacity: '134 LIT / Hr',
      Motor: '3 phas Induction Motor',
      MotorMake: 'Bharat BIJLEE (VSC)',
      KW: '0.37',
      HP: '0.5'
    },
    status: AssetStatus.WORKING,
    location: 'Chemical House',
    notes: '2 used for PAC, 2 used for Lime. All working.',
    spareParts: [],
    installationDate: '2022-05-10',
    warrantyExpDate: '2025-05-10',
    lastServiceDate: '2023-11-10',
    nextServiceDueDate: '2024-02-10'
  },
  {
    id: 'CHEM-011',
    name: 'Chemical House Agitator',
    category: 'Mixer',
    model: 'P8 F1012',
    make: 'Remi Process Plant and Machinary LTD',
    quantity: 5,
    specifications: {
      HP: '01',
      KW: '0.75',
      Motor: '3 phas Induction Motor',
      MotorMake: 'Remi Elektrotechnik LTD'
    },
    status: AssetStatus.WORKING,
    location: 'Chemical House',
    notes: 'All 5 are working.',
    spareParts: [],
    installationDate: '2021-09-01',
    warrantyExpDate: '2024-09-01',
    lastServiceDate: '2023-09-01',
    nextServiceDueDate: '2024-03-01'
  },
  // --- Page 5: Wash Water & Blowers ---
  {
    id: 'WWP-012',
    name: 'Wash Water Pump',
    category: 'Pump',
    model: 'CPHM 100/20 (HSC)',
    make: 'K.B',
    quantity: 2,
    specifications: {
      Head: '15m',
      Discharge: '100.8m3/Hr',
      Motor: '3 phas Induction Motor (HSC)',
      KW: '7.50',
      HP: '10',
      MotorMake: 'Crompton Greaves LTD'
    },
    status: AssetStatus.WORKING,
    location: 'Filter House',
    notes: 'All 2 nos pump and Motor are working.',
    spareParts: [],
    installationDate: '2020-11-15',
    warrantyExpDate: '2022-11-15',
    lastServiceDate: '2023-10-15',
    nextServiceDueDate: '2024-04-15'
  },
  {
    id: 'BLOW-013',
    name: 'Air Blower',
    category: 'Blower',
    model: 'RL300 AC',
    make: 'Swan Pneumatic Pvt Ltd',
    quantity: 2,
    specifications: {
      Type: 'Rotary twin lobe Blower',
      Motor: '3 phas Induction Motor',
      MotorMake: 'Crompton Greaves LTD'
    },
    status: AssetStatus.WORKING,
    location: 'Blower Room',
    notes: 'Both Blowers are working.',
    spareParts: [],
    installationDate: '2021-01-20',
    warrantyExpDate: '2023-01-20',
    lastServiceDate: '2023-07-20',
    nextServiceDueDate: '2024-01-20'
  },
  // --- Page 6: Actuators ---
  {
    id: 'ACT-014',
    name: 'Wash Water Inlet Actuator',
    category: 'Actuator',
    model: 'K15 OF 10E',
    make: 'Rotork Controls Pvt Ltd',
    quantity: 3,
    specifications: {
      Type: 'Electric Actuator'
    },
    status: AssetStatus.WORKING,
    location: 'Pipe Gallary (filter bed)',
    notes: 'Working manually. Needs SCADA connection.',
    spareParts: [],
    installationDate: '2023-05-01',
    warrantyExpDate: '2026-05-01',
    lastServiceDate: '2023-11-01',
    nextServiceDueDate: '2024-05-01'
  },
  {
    id: 'ACT-015',
    name: 'Bed Outlet Actuator',
    category: 'Actuator',
    model: 'K15 OF 10E',
    make: 'Rotork Controls Pvt Ltd',
    quantity: 3,
    specifications: {
      Type: 'Electric Actuator'
    },
    status: AssetStatus.WORKING,
    location: 'Pipe Gallary',
    notes: 'Working manually. Needs SCADA connection. Nameplates invisible.',
    spareParts: [],
    installationDate: '2023-05-01',
    warrantyExpDate: '2026-05-01',
    lastServiceDate: '2023-11-01',
    nextServiceDueDate: '2024-05-01'
  },
  {
    id: 'ACT-016',
    name: 'Blower Actuator',
    category: 'Actuator',
    model: 'K15 OF 10E',
    make: 'Rotork Controls Pvt Ltd',
    quantity: 3,
    specifications: {
      Type: 'Electric Actuator'
    },
    status: AssetStatus.WORKING,
    location: 'Pipe Gallary',
    notes: 'Working manually. Needs SCADA connection.',
    spareParts: [],
    installationDate: '2023-05-01',
    warrantyExpDate: '2026-05-01',
    lastServiceDate: '2023-11-01',
    nextServiceDueDate: '2024-05-01'
  },
  // --- Page 6/7: Flow Meters & Recirculation ---
  {
    id: 'FM-017',
    name: 'Filter Bed Flow Meter',
    category: 'Sensor',
    model: 'MagFlow 6410',
    make: 'ABB Engineering Ltd',
    quantity: 5,
    specifications: {
      Type: 'Electromagnetic',
      Size: '300 DN'
    },
    status: AssetStatus.ATTENTION_NEEDED,
    location: 'Filter Bed',
    notes: 'Not working due to no SCADA connection. 2 ABB, 1 Endress+Hauser.',
    spareParts: [],
    installationDate: '2023-02-15',
    warrantyExpDate: '2026-02-15',
    lastServiceDate: '2023-08-15',
    nextServiceDueDate: '2024-02-15'
  },
  {
    id: 'RP-018',
    name: 'Recirculation Pump',
    category: 'Pump',
    model: 'Submersible',
    make: 'Unknown',
    quantity: 2,
    specifications: {
      Type: '10 HP',
      Notes: 'Submerged in water'
    },
    status: AssetStatus.WORKING,
    location: 'Recirculation pump house',
    notes: 'Both working. Submerged.',
    spareParts: [],
    installationDate: '2021-06-01',
    warrantyExpDate: '2023-06-01',
    lastServiceDate: '2023-06-01',
    nextServiceDueDate: '2023-12-01'
  },
  {
    id: 'CSP-019',
    name: 'Clarifloculator Sledge Pit Pump',
    category: 'Pump',
    model: 'Unknown',
    make: 'Unknown',
    quantity: 2,
    specifications: {
      Type: '7.5 HP'
    },
    status: AssetStatus.WORKING,
    location: 'Sledge Pit',
    notes: 'Working. Number plate invisible.',
    spareParts: [],
    installationDate: '2020-01-01',
    warrantyExpDate: '2021-01-01',
    lastServiceDate: '2023-01-01',
    nextServiceDueDate: '2023-07-01'
  },
  // --- Page 7: Village Flow Meters & Turbidity ---
  {
    id: 'FM-020',
    name: 'WTP to Local Village Flow Meter',
    category: 'Sensor',
    model: 'Promag',
    make: 'Endress + Hauser',
    quantity: 2,
    specifications: {
      Type: '300 & 400 DN'
    },
    status: AssetStatus.WORKING,
    location: 'Outlet',
    notes: 'Working.',
    spareParts: [],
    installationDate: '2022-04-01',
    warrantyExpDate: '2025-04-01',
    lastServiceDate: '2023-10-01',
    nextServiceDueDate: '2024-04-01'
  },
  {
    id: 'SENS-021',
    name: 'Turbidity and PH Sensor',
    category: 'Sensor',
    model: 'Liquisys M',
    make: 'Endress + Hauser',
    quantity: 2,
    specifications: {
      Type: 'Analysis Sensor'
    },
    status: AssetStatus.ATTENTION_NEEDED,
    location: 'Filter Bed',
    notes: 'Not working due to no SCADA connection.',
    spareParts: [],
    installationDate: '2023-03-10',
    warrantyExpDate: '2024-03-10',
    lastServiceDate: '2023-09-10',
    nextServiceDueDate: '2024-03-10'
  },
  // --- Page 8/9: MBR & Chlorine ---
  {
    id: 'CHL-022',
    name: 'Chlorinator',
    category: 'Dosing',
    model: 'Unknown',
    make: 'Unknown',
    quantity: 2,
    specifications: {},
    status: AssetStatus.WORKING,
    location: 'Chlorine Area',
    notes: 'Working properly. Tags missing.',
    spareParts: [],
    installationDate: '2021-11-01',
    warrantyExpDate: '2023-11-01',
    lastServiceDate: '2023-11-01',
    nextServiceDueDate: '2024-05-01'
  },
  {
    id: 'MBR-023',
    name: 'MBR Level Sensor',
    category: 'Sensor',
    model: 'Prosonic T',
    make: 'Endress + Hauser',
    quantity: 2,
    specifications: {
       Type: 'Ultrasonic'
    },
    status: AssetStatus.WORKING,
    location: 'MBR Tanks',
    notes: 'Working.',
    spareParts: [],
    installationDate: '2022-08-01',
    warrantyExpDate: '2025-08-01',
    lastServiceDate: '2023-08-01',
    nextServiceDueDate: '2024-02-01'
  },
  {
    id: 'MBR-024',
    name: 'MBR Flow Meter',
    category: 'Sensor',
    model: 'Unknown',
    make: 'SBEM PVT. LTD',
    quantity: 2,
    specifications: {},
    status: AssetStatus.WORKING,
    location: 'MBR',
    notes: 'Working.',
    spareParts: [],
    installationDate: '2022-01-01',
    warrantyExpDate: '2023-01-01',
    lastServiceDate: '2023-07-01',
    nextServiceDueDate: '2024-01-01'
  },
  {
    id: 'MBR-025',
    name: 'MBR Actuator Valve',
    category: 'Actuator',
    model: 'SA12E22',
    make: 'AUMA',
    quantity: 6,
    specifications: {
       IP: '68',
       Torque: '40-120 Nm'
    },
    status: AssetStatus.WORKING,
    location: 'MBR',
    notes: 'All working.',
    spareParts: [],
    installationDate: '2022-06-15',
    warrantyExpDate: '2025-06-15',
    lastServiceDate: '2023-12-15',
    nextServiceDueDate: '2024-06-15'
  }
];

export const SYSTEM_INSTRUCTION = `
You are an expert industrial maintenance assistant for a water treatment plant.
You have access to the following inventory of assets (provided in context).
Your job is to help the facility manager with:
1. Identifying spare parts needed for specific machines (e.g. Bearings for Kirloskar Pumps).
2. Explaining specifications (Head, Flow, KW).
3. Suggesting maintenance schedules based on general engineering principles for pumps, motors, and sensors.
4. Summarizing the status of the plant.

When asked about specific spare parts, refer strictly to the 'spareParts' data provided for that asset.
If a user asks about an asset ID, look up the details.
Provide concise, professional, and safety-conscious advice.
`;