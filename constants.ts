import { Asset, AssetStatus } from './types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'PUMP-001',
    name: 'Raw Water Pump',
    category: 'Pump',
    model: 'UP 150/56 (HSC)',
    make: 'Kirloskar Brothers LTD',
    quantity: 4,
    specifications: {
      Head: '78m',
      Flow: '334.80 m3/hr',
      KW: '110',
      Type: 'HSC'
    },
    status: AssetStatus.ATTENTION_NEEDED,
    location: 'Raw Water Pump House',
    notes: '3 pumps working. 1 pump water leakage from sleeve both side. Needs spare parts replacement.',
    spareParts: [
      { name: 'Bearing DE', materialOrMake: 'SKF' },
      { name: 'Bearing NDE', materialOrMake: 'SKF' },
      { name: 'Shaft Sleeve DE/NDE', materialOrMake: 'SS-410 / CI' },
      { name: 'O-Ring set', materialOrMake: 'Rubber' },
      { name: 'Wear Ring', materialOrMake: 'Bronze' }
    ],
    installationDate: '2020-01-15',
    warrantyExpDate: '2023-01-15',
    lastServiceDate: '2023-09-10',
    nextServiceDueDate: '2023-12-10'
  },
  {
    id: 'PUMP-002',
    name: 'Raw Water Auxiliary Pump',
    category: 'Pump',
    model: 'MF 25/30 (HSC)',
    make: 'Kirloskar Brothers Ltd',
    quantity: 2,
    specifications: {
      Head: '4.6 m',
      Discharge: '669.6 m3/hr',
      KW: '15',
      MotorMake: 'Crompton Greaves LTD'
    },
    status: AssetStatus.WORKING,
    location: 'Raw Water Pump House',
    notes: 'All are working.',
    spareParts: [],
    installationDate: '2021-05-20',
    warrantyExpDate: '2024-05-20',
    lastServiceDate: '2023-10-01',
    nextServiceDueDate: '2024-04-01'
  },
  {
    id: 'PUMP-003',
    name: 'Clear Water Pump',
    category: 'Pump',
    model: 'DSM 125/40 (HSC)',
    make: 'Kirloskar',
    quantity: 4,
    specifications: {
      Head: '62 m',
      KW: '55',
      MotorMake: 'Crompton Greaves LTD'
    },
    status: AssetStatus.MAINTENANCE,
    location: 'Clear Water Pump House',
    notes: '3 working, 1 under maintenance. Motors are working.',
    spareParts: [
      { name: 'Impeller I/II', materialOrMake: 'Bronze' },
      { name: 'Shaft', materialOrMake: 'SS-410' },
      { name: 'Bearing DE/NDE', materialOrMake: 'SKF' }
    ],
    installationDate: '2019-11-10',
    warrantyExpDate: '2022-11-10',
    lastServiceDate: '2023-08-15',
    nextServiceDueDate: '2023-11-15' // Overdue
  },
  {
    id: 'TRANS-004',
    name: 'Raw Water Level Transmitter',
    category: 'Sensor',
    model: 'LST200',
    make: 'ABB Engineering SHANGHAI LTD',
    quantity: 2,
    specifications: {
      Range: '0.35-8m',
      Output: '4-20mA',
      Protection: 'IP66/67'
    },
    status: AssetStatus.WORKING,
    location: 'Sump Tank',
    notes: 'Working condition.',
    spareParts: [],
    installationDate: '2021-10-01',
    warrantyExpDate: '2024-10-01',
    lastServiceDate: '2023-06-20',
    nextServiceDueDate: '2024-06-20'
  },
  {
    id: 'MIXER-005',
    name: 'Flash Mixer Agitator',
    category: 'Mixer',
    model: 'Custom',
    make: 'Remi Process Plant & Machinery LTD',
    quantity: 1,
    specifications: {
      HP: '5',
      KW: '3.7',
      MotorMake: 'Remi Elektrotechnik LTD'
    },
    status: AssetStatus.WORKING,
    location: 'Treatment Plant',
    notes: 'Working.',
    spareParts: [],
    installationDate: '2020-03-15',
    warrantyExpDate: '2023-03-15',
    lastServiceDate: '2023-09-01',
    nextServiceDueDate: '2024-03-01'
  },
  {
    id: 'CLARI-006',
    name: 'Clarifloculator Agitator',
    category: 'Mixer',
    model: 'Premium Worm Reducer',
    make: 'Premium Transmission LTD',
    quantity: 4,
    specifications: {
      KW: '0.75',
      MotorMake: 'Crompton Greaves LTD'
    },
    status: AssetStatus.ATTENTION_NEEDED,
    location: 'Clarifloculator',
    notes: '1 working, 1 under maintenance, 2 need to be pulled up (stuck). Nameplates not visible.',
    spareParts: [
        { name: 'Gearbox', materialOrMake: 'Premium Transmission' }
    ],
    installationDate: '2018-06-01',
    warrantyExpDate: '2021-06-01',
    lastServiceDate: '2022-12-01',
    nextServiceDueDate: '2023-06-01' // Overdue
  },
  {
    id: 'DOSING-007',
    name: 'Chemical House Metering Pump',
    category: 'Pump',
    model: 'DP/6/DLA/127',
    make: 'Shapatools',
    quantity: 4,
    specifications: {
      Capacity: '134 LIT/Hr',
      MotorMake: 'Bharat Bijlee (VSC)'
    },
    status: AssetStatus.WORKING,
    location: 'Chemical House',
    notes: '2 used for PAC, 2 for Lime. All working.',
    spareParts: [],
    installationDate: '2022-01-01',
    warrantyExpDate: '2025-01-01',
    lastServiceDate: '2023-11-01',
    nextServiceDueDate: '2024-02-01'
  },
  {
    id: 'BLOWER-008',
    name: 'Air Blower',
    category: 'Blower',
    model: 'RL300 AC',
    make: 'Swan Pneumatic Pvt Ltd',
    quantity: 2,
    specifications: {
      Type: 'Rotary Twin Lobe',
      MotorMake: 'Crompton Greaves LTD',
      HP: '10',
      KW: '7.50'
    },
    status: AssetStatus.WORKING,
    location: 'Blower Room',
    notes: 'Both blowers working.',
    spareParts: [],
    installationDate: '2021-08-15',
    warrantyExpDate: '2023-08-15',
    lastServiceDate: '2023-08-20',
    nextServiceDueDate: '2024-02-20'
  }
];

export const SYSTEM_INSTRUCTION = `
You are an expert industrial maintenance assistant for a water treatment plant.
You have access to the following inventory of assets (provided in context).
Your job is to help the facility manager with:
1. Identifying spare parts needed for specific machines.
2. Explaining specifications.
3. Suggesting maintenance schedules based on general engineering principles for pumps, motors, and sensors.
4. Summarizing the status of the plant.

When asked about specific spare parts, refer strictly to the 'spareParts' data provided for that asset.
If a user asks about an asset ID (e.g., PUMP-001), look up the details.
Provide concise, professional, and safety-conscious advice.
`;