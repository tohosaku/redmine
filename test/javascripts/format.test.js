import { format } from 'controllers/attachment_controller';
import { assert } from 'chai';

suite('format', () => {
  test('allow number instead of string', () => {
    assert.equal(format('age: ${age}', { age: 25 }), 'age: 25')
  });

  test('allow multiple replacements', () => {
    assert.equal(format('${code} ${path} not found',
                 { code: '404', path: '/users' }), '404 /users not found')
    assert.equal(format('All ${a} and no ${b} makes ${c} a dull ${d}',
                 { a: 'work', b: 'play', c: 'Jack', d: 'boy' }), 'All work and no play makes Jack a dull boy')
  });


  test('check null, undefined', () => {
    assert.equal(format('null: ${null}, undefined: ${undefined}', { null: null, undefined: undefined }),
                 'null: null, undefined: undefined')
  });

  test('check empty string', () => {
    assert.equal(format('blank: ${blank}', { blank: '' }), 'blank: ')
  });

  test('allow for a mismatch between the number of placeholders and replacement values', () => {
    assert.equal(format('${name} is not ${state}', { name: 'ruby' }),
                 'ruby is not ${state}');
    assert.equal(format('${name} is not ${state}', { name: 'ruby', state: 'dead', condition: 'not' }),
                 'ruby is not dead');
  });

  test('allow multiple place holders', () => {
    assert.equal(format( '${name}, ${name}, Give me your answer do!',
      { name: 'Daisy' }
    ),
    'Daisy, Daisy, Give me your answer do!'
    )
  });

  test('allow for correct functionality without a replacement character', () => {
    assert.equal(format('Redmine is a flexible project management web application'), 'Redmine is a flexible project management web application')
    assert.equal(format('Redmine is a flexible project management web application', []), 'Redmine is a flexible project management web application')
    assert.equal(format('Redmine is a flexible project management web application', null), 'Redmine is a flexible project management web application')
    assert.equal(format('Redmine is a flexible project management web application', undefined), 'Redmine is a flexible project management web application')
  });
});
