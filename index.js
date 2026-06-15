const readline = require('readline-sync');

function subnetHostChecker() {
  console.log('\n--- Subnet Host Checker ---');

  let vpcPrefix = parseInt(readline.question('Enter VPC CIDR prefix (e.g., 16 for /16): /'));
  while (isNaN(vpcPrefix) || vpcPrefix < 16 || vpcPrefix > 30) {
    console.log('Invalid input. VPC CIDR must be between /16 and /30.');
    vpcPrefix = parseInt(readline.question('Enter VPC CIDR prefix: /'));
  }

  let subnetPrefix = parseInt(readline.question('Enter Subnet CIDR prefix (e.g., 24 for /24): /'));
  while (isNaN(subnetPrefix) || subnetPrefix < 16 || subnetPrefix > 30) {
    console.log('Invalid input. Subnet CIDR must be between /16 and /30.');
    subnetPrefix = parseInt(readline.question('Enter Subnet CIDR prefix: /'));
  }

  let devices = parseInt(readline.question('Enter number of devices required: '));
  while (isNaN(devices) || devices <= 0) {
    console.log('Invalid input. Devices must be a positive integer.');
    devices = parseInt(readline.question('Enter number of devices required: '));
  }

  const subnetConsistent = subnetPrefix > vpcPrefix;
  const usableHosts = Math.pow(2, 32 - subnetPrefix) - 2;
  const sufficient = usableHosts >= devices;

  console.log('\n--- Results ---');
  console.log('VPC: /' + vpcPrefix + ' | Subnet: /' + subnetPrefix + ' | Devices needed: ' + devices);
  console.log('Usable hosts in /' + subnetPrefix + ': ' + usableHosts);

  if (!subnetConsistent) {
    console.log('Subnet Check: FAIL - /' + subnetPrefix + ' is not consistent with a /' + vpcPrefix + ' VPC.');
  } else {
    console.log('Subnet Check: PASS - /' + subnetPrefix + ' is consistent with a /' + vpcPrefix + ' VPC.');
  }

  if (sufficient) {
    console.log('Capacity Check: SUFFICIENT - ' + (usableHosts - devices) + ' unused IP address(es) remaining.');
  } else {
    console.log('Capacity Check: INSUFFICIENT - You need ' + (devices - usableHosts) + ' more IP address(es).');
  }
}

function computeEnvironmentSelector() {
  console.log('\n--- Compute Environment Selector ---');

  let appName = readline.question('Enter application name: ');
  while (!appName || appName.trim() === '') {
    appName = readline.question('Application name cannot be empty: ');
  }

  let users = parseInt(readline.question('Enter monthly users: '));
  while (isNaN(users) || users < 0) {
    console.log('Invalid input. Must be a non-negative number.');
    users = parseInt(readline.question('Enter monthly users: '));
  }

  let budget = parseFloat(readline.question('Enter monthly budget ($): '));
  while (isNaN(budget) || budget < 0) {
    console.log('Invalid input. Must be a non-negative number.');
    budget = parseFloat(readline.question('Enter monthly budget ($): '));
  }

  const haInput = readline.question('High availability required? (yes/no): ').trim().toLowerCase();
  const ha = haInput === 'yes' || haInput === 'y';

  let recommendation = '';

  if (budget < 1000) {
    recommendation = 'Single EC2 only (budget under $1,000 limits options)';
  } else if (users < 1000 && !ha) {
    recommendation = 'Single EC2';
  } else if (users >= 1000 && users <= 10000 && budget >= 1000 && budget <= 3000) {
    recommendation = 'EC2 + Load Balancer (no auto scaling - budget caps at $3,000)';
  } else if (users >= 1000 && users <= 10000) {
    recommendation = 'EC2 + Load Balancer';
  } else if (users > 10000 || ha) {
    if (budget <= 3000) {
      recommendation = 'EC2 + Load Balancer (auto scaling recommended but budget is under $3,000)';
    } else {
      recommendation = 'EC2 + Load Balancer + Auto Scaling';
    }
  }

  console.log('\n--- Results ---');
  console.log('Application: ' + appName);
  console.log('Monthly Users: ' + users.toLocaleString());
  console.log('Monthly Budget: $' + budget.toLocaleString());
  console.log('High Availability: ' + (ha ? 'Yes' : 'No'));
  console.log('\nRecommended Environment: ' + recommendation);
}

function main() {
  console.log('\n========================================');
  console.log('   INFO 300 Infrastructure Decision Tool');
  console.log('========================================');

  let running = true;

  while (running) {
    console.log('\nWhat would you like to do?');
    console.log('1. Subnet Host Checker');
    console.log('2. Compute Environment Selector');
    console.log('3. Exit');

    const choice = readline.question('\nEnter your choice (1, 2, or 3): ').trim();

    if (choice === '1') {
      subnetHostChecker();
    } else if (choice === '2') {
      computeEnvironmentSelector();
    } else if (choice === '3') {
      console.log('Exiting. Goodbye!');
      running = false;
    } else {
      console.log('Invalid choice. Please enter 1, 2, or 3.');
    }

    if (running) {
      const again = readline.question('\nDo you want to run another tool? (yes/no): ').trim().toLowerCase();
      if (again !== 'yes' && again !== 'y') {
        console.log('Exiting. Goodbye!');
        running = false;
      }
    }
  }
}

main();
