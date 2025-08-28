import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample sites
  const sites = await prisma.site.createMany({
    data: [
      {
        site_code: 'S001',
        site_name: 'Bengaluru - Devanahalli',
        location: 'Devanahalli, Bengaluru, Karnataka',
        latitude: 13.2433,
        longitude: 77.7123,
      },
      {
        site_code: 'S002',
        site_name: 'Chennai - Sriperumbudur',
        location: 'Sriperumbudur, Chennai, Tamil Nadu',
        latitude: 12.8071,
        longitude: 80.0494,
      },
      {
        site_code: 'S003',
        site_name: 'Hyderabad - Shamirpet',
        location: 'Shamirpet, Hyderabad, Telangana',
        latitude: 17.5117,
        longitude: 78.4828,
      },
      {
        site_code: 'S004',
        site_name: 'Pune - Wakad',
        location: 'Wakad, Pune, Maharashtra',
        latitude: 18.5919,
        longitude: 73.7389,
      },
      {
        site_code: 'S005',
        site_name: 'Delhi - Noida',
        location: 'Noida, Delhi',
        latitude: 28.5355,
        longitude: 77.3910,
      },
      {
        site_code: 'S006',
        site_name: 'Mumbai - Powai',
        location: 'Powai, Mumbai, Maharashtra',
        latitude: 19.1167,
        longitude: 72.9000,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${sites.count} sites`);

  // Create sample companies
  const companies = await prisma.company.createMany({
    data: [
      {
        company_name: 'ABC Construction Ltd.',
        reliability_score: 95,
        past_delays_count: 1,
      },
      {
        company_name: 'XYZ Heavy Machinery',
        reliability_score: 87,
        past_delays_count: 3,
      },
      {
        company_name: 'Global Builders Inc.',
        reliability_score: 92,
        past_delays_count: 2,
      },
      {
        company_name: 'Metro Infrastructure',
        reliability_score: 80,
        past_delays_count: 5,
      },
      {
        company_name: 'Prime Contractors',
        reliability_score: 98,
        past_delays_count: 0,
      },
      {
        company_name: 'Urban Development Corp',
        reliability_score: 75,
        past_delays_count: 7,
      },
      {
        company_name: 'Southern Engineering',
        reliability_score: 89,
        past_delays_count: 2,
      },
      {
        company_name: 'Northern Construction',
        reliability_score: 91,
        past_delays_count: 1,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${companies.count} companies`);

  // Create sample operators
  const operators = await prisma.operator.createMany({
    data: [
      {
        operator_code: 'OP101',
        name: 'Rajesh Kumar',
        company_id: 1,
      },
      {
        operator_code: 'OP102',
        name: 'Suresh Patel',
        company_id: 1,
      },
      {
        operator_code: 'OP201',
        name: 'Mohammed Ali',
        company_id: 2,
      },
      {
        operator_code: 'OP202',
        name: 'Vikram Singh',
        company_id: 2,
      },
      {
        operator_code: 'OP301',
        name: 'Aruna Desai',
        company_id: 3,
      },
      {
        operator_code: 'OP401',
        name: 'Deepak Sharma',
        company_id: 4,
      },
      {
        operator_code: 'OP501',
        name: 'Kavitha Reddy',
        company_id: 5,
      },
      {
        operator_code: 'OP601',
        name: 'Anil Gupta',
        company_id: 6,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${operators.count} operators`);

  // Create sample equipment
  const equipment = await prisma.equipment.createMany({
    data: [
      {
        equipment_code: 'EXC1001',
        type: 'Excavator',
        site_id: 1,
        status: 'rented',
      },
      {
        equipment_code: 'EXC1002',
        type: 'Excavator',
        site_id: 2,
        status: 'rented',
      },
      {
        equipment_code: 'EXC1003',
        type: 'Excavator',
        site_id: null,
        status: 'idle',
      },
      {
        equipment_code: 'EXC1004',
        type: 'Excavator',
        site_id: 4,
        status: 'maintenance',
      },
      {
        equipment_code: 'CRN2001',
        type: 'Crane',
        site_id: 3,
        status: 'rented',
      },
      {
        equipment_code: 'CRN2002',
        type: 'Crane',
        site_id: null,
        status: 'idle',
      },
      {
        equipment_code: 'CRN2003',
        type: 'Crane',
        site_id: 5,
        status: 'rented',
      },
      {
        equipment_code: 'BLD3001',
        type: 'Bulldozer',
        site_id: 1,
        status: 'rented',
      },
      {
        equipment_code: 'BLD3002',
        type: 'Bulldozer',
        site_id: null,
        status: 'idle',
      },
      {
        equipment_code: 'BLD3003',
        type: 'Bulldozer',
        site_id: 6,
        status: 'rented',
      },
      {
        equipment_code: 'LDR4001',
        type: 'Loader',
        site_id: 2,
        status: 'rented',
      },
      {
        equipment_code: 'LDR4002',
        type: 'Loader',
        site_id: null,
        status: 'idle',
      },
      {
        equipment_code: 'LDR4003',
        type: 'Loader',
        site_id: 3,
        status: 'rented',
      },
      {
        equipment_code: 'GRD5001',
        type: 'Grader',
        site_id: 4,
        status: 'rented',
      },
      {
        equipment_code: 'GRD5002',
        type: 'Grader',
        site_id: null,
        status: 'maintenance',
      },
      {
        equipment_code: 'GRD5003',
        type: 'Grader',
        site_id: 5,
        status: 'rented',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${equipment.count} pieces of equipment`);

  // Create sample rentals (some overdue)
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const rentals = await prisma.rental.createMany({
    data: [
      // Active rentals
      {
        equipment_id: 1,
        site_id: 1,
        company_id: 1,
        operator_id: 1,
        check_out_date: new Date(today.setDate(today.getDate() - 5)),
        expected_return_date: new Date(today.setDate(today.getDate() + 10)),
        status: 'active',
      },
      {
        equipment_id: 2,
        site_id: 2,
        company_id: 2,
        operator_id: 3,
        check_out_date: new Date(today.setDate(today.getDate() - 3)),
        expected_return_date: new Date(today.setDate(today.getDate() + 12)),
        status: 'active',
      },
      {
        equipment_id: 5,
        site_id: 3,
        company_id: 3,
        operator_id: 5,
        check_out_date: new Date(today.setDate(today.getDate() - 7)),
        expected_return_date: new Date(today.setDate(today.getDate() + 5)),
        status: 'active',
      },
      {
        equipment_id: 7,
        site_id: 5,
        company_id: 5,
        operator_id: 7,
        check_out_date: new Date(today.setDate(today.getDate() - 2)),
        expected_return_date: new Date(today.setDate(today.getDate() + 15)),
        status: 'active',
      },
      {
        equipment_id: 8,
        site_id: 1,
        company_id: 1,
        operator_id: 2,
        check_out_date: new Date(today.setDate(today.getDate() - 4)),
        expected_return_date: new Date(today.setDate(today.getDate() + 8)),
        status: 'active',
      },
      {
        equipment_id: 10,
        site_id: 6,
        company_id: 6,
        operator_id: 8,
        check_out_date: new Date(today.setDate(today.getDate() - 6)),
        expected_return_date: new Date(today.setDate(today.getDate() + 9)),
        status: 'active',
      },
      {
        equipment_id: 11,
        site_id: 2,
        company_id: 2,
        operator_id: 4,
        check_out_date: new Date(today.setDate(today.getDate() - 1)),
        expected_return_date: new Date(today.setDate(today.getDate() + 14)),
        status: 'active',
      },
      {
        equipment_id: 13,
        site_id: 3,
        company_id: 4,
        operator_id: 6,
        check_out_date: new Date(today.setDate(today.getDate() - 8)),
        expected_return_date: new Date(today.setDate(today.getDate() + 6)),
        status: 'active',
      },
      {
        equipment_id: 14,
        site_id: 4,
        company_id: 7,
        operator_id: 7,
        check_out_date: new Date(today.setDate(today.getDate() - 9)),
        expected_return_date: new Date(today.setDate(today.getDate() + 3)),
        status: 'active',
      },
      {
        equipment_id: 16,
        site_id: 5,
        company_id: 8,
        operator_id: 8,
        check_out_date: new Date(today.setDate(today.getDate() - 2)),
        expected_return_date: new Date(today.setDate(today.getDate() + 11)),
        status: 'active',
      },
      // Overdue rentals
      {
        equipment_id: 3,
        site_id: 1,
        company_id: 1,
        operator_id: 1,
        check_out_date: new Date(today.setDate(today.getDate() - 15)),
        expected_return_date: new Date(today.setDate(today.getDate() - 3)),
        status: 'overdue',
      },
      {
        equipment_id: 6,
        site_id: 3,
        company_id: 3,
        operator_id: 5,
        check_out_date: new Date(today.setDate(today.getDate() - 12)),
        expected_return_date: new Date(today.setDate(today.getDate() - 1)),
        status: 'overdue',
      },
      {
        equipment_id: 15,
        site_id: 5,
        company_id: 6,
        operator_id: 7,
        check_out_date: new Date(today.setDate(today.getDate() - 18)),
        expected_return_date: new Date(today.setDate(today.getDate() - 5)),
        status: 'overdue',
      },
      // Returned rentals (historical data)
      {
        equipment_id: 4,
        site_id: 4,
        company_id: 2,
        operator_id: 3,
        check_out_date: new Date(today.setDate(today.getDate() - 20)),
        check_in_date: new Date(today.setDate(today.getDate() + 15)),
        expected_return_date: new Date(today.setDate(today.getDate() - 5)),
        engine_hours_per_day: 8.5,
        idle_hours_per_day: 2.0,
        operating_days: 15,
        status: 'returned',
      },
      {
        equipment_id: 9,
        site_id: 6,
        company_id: 5,
        operator_id: 6,
        check_out_date: new Date(today.setDate(today.getDate() - 25)),
        check_in_date: new Date(today.setDate(today.getDate() + 18)),
        expected_return_date: new Date(today.setDate(today.getDate() - 7)),
        engine_hours_per_day: 7.2,
        idle_hours_per_day: 3.5,
        operating_days: 18,
        status: 'returned',
      },
      {
        equipment_id: 12,
        site_id: 1,
        company_id: 1,
        operator_id: 2,
        check_out_date: new Date(today.setDate(today.getDate() - 30)),
        check_in_date: new Date(today.setDate(today.getDate() + 22)),
        expected_return_date: new Date(today.setDate(today.getDate() - 8)),
        engine_hours_per_day: 9.1,
        idle_hours_per_day: 1.2,
        operating_days: 22,
        status: 'returned',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${rentals.count} rentals`);

  // Create sample maintenance records
  const maintenance = await prisma.maintenance.createMany({
    data: [
      {
        equipment_id: 4,
        service_date: new Date(today.setDate(today.getDate() - 5)),
        service_type: 'Preventive',
        issue_reported: 'Routine maintenance',
        downtime_days: 2,
      },
      {
        equipment_id: 15,
        service_date: new Date(today.setDate(today.getDate() - 2)),
        service_type: 'Preventive',
        issue_reported: 'Oil change and inspection',
        downtime_days: 1,
      },
      {
        equipment_id: 3,
        service_date: new Date(today.setDate(today.getDate() - 1)),
        service_type: 'Breakdown',
        issue_reported: 'Hydraulic system failure',
        downtime_days: 3,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${maintenance.count} maintenance records`);

  // Create sample revenue records
  const revenue = await prisma.revenue.createMany({
    data: [
      {
        equipment_id: 4,
        rental_id: 1,
        rental_rate: 5000.0,
        total_cost: 75000.0,
      },
      {
        equipment_id: 9,
        rental_id: 2,
        rental_rate: 4500.0,
        total_cost: 81000.0,
      },
      {
        equipment_id: 12,
        rental_id: 3,
        rental_rate: 6000.0,
        total_cost: 132000.0,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${revenue.count} revenue records`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });