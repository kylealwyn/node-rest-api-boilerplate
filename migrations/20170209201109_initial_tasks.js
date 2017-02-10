
exports.up = (knex) =>
  knex('tasks')
    .insert([{
      title: 'Answer Questions',
      description: '',
      code: 'Questionnaire',
      button: 'Start Questionnaire',
      type: 'async',
      position: 1,
    }, {
      title: 'Photo',
      description: '',
      code: 'Photo',
      button: 'Launch Camera',
      type: 'async',
      position: 2,
    }, {
      title: 'Pharmacy',
      description: '',
      code: 'Pharmacy',
      button: 'Select Pharmacy',
      type: 'async',
      position: 3,
    }, {
      title: 'Payment',
      description: '',
      code: 'Payment',
      type: 'async',
      position: 4,
    }, {
      title: 'Video',
      description: '',
      code: 'Video',
      button: 'Start Consultation',
      type: 'video',
      position: 5,
    }, {
      title: 'Approve Photo',
      description: '',
      code: 'ApprovePhoto',
      type: 'doctor',
    }, {
      title: 'Approve Responses',
      description: '',
      code: 'ApproveResponses',
      type: 'doctor',
    }, {
      title: 'Prescribe Medicine',
      description: '',
      code: 'Prescribe',
      type: 'doctor',
    }]);

exports.down = (knex) =>
  knex('tasks').del();
