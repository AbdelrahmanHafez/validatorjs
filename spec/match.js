if (typeof require !== 'undefined') {
  var Validator = require('../src/validator.js');
  var expect = require('chai').expect;
} else {
  var Validator = window.Validator;
  var expect = window.chai.expect;
}

const expectedObject = {
  name: {
    first: 'required|string',
    last: 'required|string'
  },
  username: 'string',
  'hobbies.*.name': 'required|string',
  'hobbies.*.years': 'numeric',
  'job.title': 'string'
};

describe(`Fail on adding extra fields`, () => {
  it(`should passe validation`, async () => {
    const user = {
      name: {
        first: 'John',
        last: 'Doe'
      },
      username: 'johndoe',
      hobbies: [{
          name: 'Football',
          years: 10
        },
        {
          name: 'Piano',
          years: 3
        }
      ]
    };

    const validator = new Validator(user, expectedObject);
    validator.checkMatch();
    expect(validator.fails()).to.be.false;
  });
  it('should fails on adding extra fields inside an object', function () {
    const user = {
      name: {
        last: 'Doe',
        fullName: 'This should not be here.'
      },
      username: 'johndoe',
      hobbies: [{
          name: 'Football',
          years: 10
        },
        {
          name: 'Piano',
          years: 3
        }
      ]
    };

    const validator = new Validator(user, expectedObject);
    validator.checkMatch();
    expect(validator.fails()).to.be.true;
  });

  it('should fails on adding extra fields inside an object in an array', function () {
    const user = {
      name: {
        first: 'John',
        last: 'Doe'
      },
      username: 'johndoe',
      hobbies: [{
          name: 'Football',
          years: 10,
          proficiency: 'This should not be here.'
        },
        {
          name: 'Piano',
          years: 3,
          proficiency: 'This should not be here.'
        }
      ]
    };

    const validator = new Validator(user, expectedObject);
    validator.checkMatch();

    expect(validator.fails()).to.be.true;
  });

  it('should fails on adding extra fields inside a nested object', function () {
    const user = {
      name: {
          first: 'John',
          last: 'Doe'
      },
      username: 'johndoe',
      hobbies: [{
              name: 'Football',
              years: 10
          },
          {
              name: 'Piano',
              years: 3
          }
      ],
      job: {
          title: 'Software developer',
          years: 5
      }
  };

  const validator = new Validator(user, expectedObject);
  validator.checkMatch();

  expect(validator.fails()).to.be.true;
  });
});