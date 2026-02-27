const mongoose = require('mongoose');
const Settings = require('../models/Settings');

const defaultSettings = [
  {
    key: 'system_name',
    value: 'QueLess',
    description: 'System name displayed in the application'
  },
  {
    key: 'support_email',
    value: 'support@queless.com',
    description: 'Support email address for customer inquiries'
  },
  {
    key: 'enable_email_notifications',
    value: true,
    description: 'Enable email notifications for queue updates'
  },
  {
    key: 'enable_sms_notifications',
    value: false,
    description: 'Enable SMS notifications for queue updates'
  },
  {
    key: 'default_queue_time',
    value: 15,
    description: 'Default time per customer in minutes'
  },
  {
    key: 'max_queue_size',
    value: 100,
    description: 'Maximum queue size per provider'
  },
  {
    key: 'allow_queue_cancellation',
    value: true,
    description: 'Allow customers to cancel their queue bookings'
  },
  {
    key: 'auto_assign_queue_numbers',
    value: true,
    description: 'Automatically assign queue numbers'
  },
  {
    key: 'advance_booking_days',
    value: 7,
    description: 'Number of days in advance customers can book'
  }
];

const seedSettings = async (closeConnection = false) => {
  try {
    let createdCount = 0;
    let updatedCount = 0;

    for (const setting of defaultSettings) {
      const existing = await Settings.findOne({ key: setting.key });
      
      if (existing) {
        // Update if value is different
        if (JSON.stringify(existing.value) !== JSON.stringify(setting.value)) {
          await Settings.findOneAndUpdate(
            { key: setting.key },
            {
              value: setting.value,
              description: setting.description,
              updatedAt: new Date()
            }
          );
          updatedCount++;
        }
      } else {
        await Settings.create({
          key: setting.key,
          value: setting.value,
          description: setting.description
        });
        createdCount++;
      }
    }

    console.log(`✅ Settings seeded: ${createdCount} created, ${updatedCount} updated`);
    
    if (closeConnection) {
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error('❌ Error seeding settings:', error.message);
    if (closeConnection) {
      await mongoose.connection.close();
    }
    throw error;
  }
};

module.exports = seedSettings;
