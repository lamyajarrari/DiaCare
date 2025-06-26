const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const users = [
    {
      email: 'patient@diacare.com',
      password: hashedPassword,
      role: 'patient',
      name: 'douha',
      patientId: 'P001'
    },
    {
      email: 'tech@diacare.com',
      password: hashedPassword,
      role: 'technician',
      name: 'mehdi',
      technicianId: 'T001'
    },
    {
      email: 'admin@diacare.com',
      password: hashedPassword,
      role: 'admin',
      name: 'lamya',
      adminId: 'A001'
    }
  ]

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData
    })
  }

  // Create machines
  const machines = [
    {
      id: 'M001',
      name: 'Fresenius 4008S',
      inventoryNumber: 'INV-001',
      department: 'Dialysis Unit A',
      status: 'Active',
      lastMaintenance: new Date('2025-06-16'),
      nextMaintenance: new Date('2025-09-16')
    },
    {
      id: 'M002',
      name: 'Fresenius 6008',
      inventoryNumber: 'INV-002',
      department: 'Dialysis Unit B',
      status: 'Active',
      lastMaintenance: new Date('2025-05-20'),
      nextMaintenance: new Date('2025-08-20')
    }
  ]

  for (const machineData of machines) {
    await prisma.machine.upsert({
      where: { id: machineData.id },
      update: {},
      create: machineData
    })
  }

  // Create faults
  const faults = [
    {
      date: new Date('2025-06-12'),
      faultType: 'Hydraulic Alarm',
      description: 'Internal leakage detected',
      downtime: '2 hours',
      rootCause: 'Worn-out seal',
      correctiveAction: 'Hydraulic seal replaced',
      status: 'Resolved',
      patientId: 'P001',
      machineId: 'M001'
    },
    {
      date: new Date('2025-06-10'),
      faultType: 'Pressure Alarm',
      description: 'High transmembrane pressure detected',
      downtime: '1.5 hours',
      rootCause: 'Blocked dialyzer',
      correctiveAction: 'Dialyzer replaced',
      status: 'Resolved',
      patientId: 'P001',
      machineId: 'M002'
    }
  ]

  for (const faultData of faults) {
    await prisma.fault.create({
      data: faultData
    })
  }

  // Create alerts
  const alerts = [
    {
      message: 'Improve conductivity',
      messageRole: 'Adjust total salt concentration in patient',
      type: 'Warning',
      requiredAction: 'Adjust to 138–145 mmol/l before starting',
      priority: 'medium',
      timestamp: new Date('2025-06-21T14:15:00Z'),
      machineId: 'M001',
      status: 'active'
    },
    {
      message: 'Air leakage',
      messageRole: 'Air bubbles or blockage in venous line',
      type: 'Blood Circuit Alarm',
      requiredAction: 'Check bubble trap, detectors, and closure',
      priority: 'high',
      timestamp: new Date('2025-06-21T13:30:00Z'),
      machineId: 'M002',
      status: 'active'
    }
  ]

  for (const alertData of alerts) {
    await prisma.alert.create({
      data: alertData
    })
  }

  // Create interventions
  const interventions = [
    {
      requestDate: new Date('2025-06-15'),
      requestedIntervention: 'Routine maintenance check',
      arrivalAtWorkshop: new Date('2025-06-16'),
      department: 'Dialysis Unit A',
      requestedBy: 'Dr. Wilson',
      returnToService: new Date('2025-06-16'),
      equipmentDescription: 'Fresenius 4008S',
      inventoryNumber: 'INV-001',
      problemDescription: 'Scheduled preventive maintenance',
      interventionType: 'Preventive',
      datePerformed: new Date('2025-06-16'),
      tasksCompleted: 'Filter replacement, electrical connections check',
      partsReplaced: 2,
      partDescription: 'Water filter, air filter',
      price: 150.00,
      technician: 'Sarah Johnson',
      timeSpent: 3,
      status: 'Completed',
      technicianId: 'T001'
    }
  ]

  for (const interventionData of interventions) {
    await prisma.intervention.create({
      data: interventionData
    })
  }

  // Create maintenance schedules
  const maintenanceSchedules = [
    {
      type: '3-month',
      tasks: ['Replace filters / Clean if necessary', 'Check motorized clamps', 'Tighten electrical connections'],
      dueDate: new Date('2025-09-16'),
      status: 'Pending',
      machineId: 'M001'
    },
    {
      type: '6-month',
      tasks: [
        'Full calibration with calibrated tools',
        'Inspect hydraulic components',
        'Firmware updates via Fresenius service'
      ],
      dueDate: new Date('2025-11-20'),
      status: 'Pending',
      machineId: 'M002'
    }
  ]

  for (const scheduleData of maintenanceSchedules) {
    await prisma.maintenanceSchedule.create({
      data: scheduleData
    })
  }

  // Create taxes
  const taxes = [
    {
      name: 'TVA',
      description: 'Taxe sur la valeur ajoutée',
      amount: 20.00,
      type: 'percentage',
      isActive: true
    },
    {
      name: 'Taxe de service',
      description: 'Taxe de service médical',
      amount: 5.00,
      type: 'percentage',
      isActive: true
    }
  ]

  for (const taxeData of taxes) {
    await prisma.taxe.create({
      data: taxeData
    })
  }

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 