#!/usr/bin/env node
'use strict';
/* Read-only validation of Grade XI Unit 2 vector self-check, maths and safety. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const engine = require(path.join(root, 'portal/unit-02-concept-engine.js'));
const html = fs.readFileSync(path.join(root, 'portal/unit-02-concept-lab.html'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'portal/unit-02-concept-ui.js'), 'utf8');
const mathCode = fs.readFileSync(path.join(root, 'portal/unit-02-concept-engine.js'), 'utf8');
const desk = fs.readFileSync(path.join(root, 'portal/unit-02.html'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'portal/learning-catalog.json'), 'utf8'));

const near = (actual, expected, tolerance = 0.001) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, actual + ' not within ' + tolerance + ' of ' + expected);
const requiredIds = [
  'mode', 'challengeHeading', 'questionRef', 'questionText', 'score',
  'challengeForm', 'answerFields', 'checkAnswer', 'newTask',
  'showHint', 'showSolution', 'feedback', 'hint', 'hintText',
  'solution', 'solutionSteps', 'vectorPlot', 'angleRange', 'angleLabel',
  'dotValue', 'crossValue', 'anglePlot', 'angleInsight'
];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML must not contain duplicated IDs');
for (const id of requiredIds) assert.ok(ids.includes(id), 'Missing student control ' + id);
for (const mode of engine.modes) {
  assert.ok(html.includes('value="' + mode + '"'), 'Missing practice mode ' + mode);
  assert.equal(engine.caseCount(mode), 12, mode + ' must have 12 source-aligned original exercises');
}
assert.ok(html.includes('src="./unit-02-concept-engine.js"'));
assert.ok(html.includes('src="./unit-02-concept-ui.js"'));
assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'));
assert.ok(html.includes('id="vectorPlot"') && html.includes('role="img"'));
assert.ok(html.includes('aria-live="polite"'));
assert.ok(desk.includes('href="./unit-02-concept-lab.html"'));
assert.ok(desk.includes('g11-u02-vector-components-01'));
assert.ok(desk.includes('g11-u02-vector-products-02'));
const unit2 = catalog.grades.find(g => g.grade === 11).units.find(u => u.unit === 2);
assert.ok(unit2.resourceIds.includes('unit2-concept-lab'));
const resource = catalog.resources.filter(r => r.id === 'unit2-concept-lab');
assert.equal(resource.length, 1);
assert.equal(resource[0].href, './unit-02-concept-lab.html');
assert.equal(resource[0].access, 'public-link');
assert.equal(resource[0].public, true);

let count = 0;
for (const mode of engine.modes) {
  for (let i = 0; i < engine.caseCount(mode); i++) {
    const task = engine.getTask(mode, i);
    assert.equal(task.mode, mode);
    assert.equal(task.index, i);
    assert.equal(task.inputs.length, 2);
    assert.ok(task.id.startsWith('U02-'));
    assert.ok(task.hint && task.steps.length >= 3);
    assert.equal(task.plot.vectors.length, mode === 'products' ? 2 : 1);
    for (const vec of task.plot.vectors) assert.ok(vec.every(Number.isFinite));
    const trueAnswers = Object.fromEntries(task.inputs.map(input => [input.key, String(task.answers[input.key])]));
    const perfect = engine.check(task, trueAnswers);
    assert.equal(perfect.complete, true);
    assert.equal(perfect.correct, true, 'Correct answers must be accepted for ' + task.id);
    for (const field of task.inputs) {
      const wrong = { ...trueAnswers, [field.key]: String(task.answers[field.key] + field.tolerance * 5) };
      const result = engine.check(task, wrong);
      assert.equal(result.correct, false, 'Incorrect ' + field.key + ' must be rejected for ' + task.id);
    }
    count++;
  }
}
assert.equal(count, 36);
assert.equal(engine.getTask('products', 12).id, engine.getTask('products', 0).id, 'Next round wraps safely');
assert.throws(() => engine.getTask('unknown', 0));
assert.throws(() => engine.getTask('components', -1));
for (const invalid of ['', '  ', '8abc', 'Infinity', 'NaN', '--2', '1,000', '3 °', null, undefined]) {
  assert.equal(engine.parseNumber(invalid), null, 'Invalid numeric input was accepted: ' + String(invalid));
}
near(engine.parseNumber('  -3.25  '), -3.25);
near(engine.parseNumber('1e2'), 100);

const component = engine.getTask('components', 0);
near(component.answers.x, 8.6602540378, 0.001);
near(component.answers.y, 5, 0.001);
assert.equal(engine.check(component, { x: '8.7', y: '5' }).correct, true);
assert.equal(engine.check(component, { x: '8.7', y: '-5' }).correct, false);

const q2 = engine.getTask('direction', 1);
near(q2.answers.magnitude, 10);
near(q2.answers.angle, 126.86989765, 0.001);
assert.equal(engine.check(q2, { magnitude: '10', angle: '126.9' }).correct, true);
assert.equal(engine.check(q2, { magnitude: '10', angle: '53.1' }).correct, false,
  'Incorrect Quadrant I reference angle must not be accepted');
const q4 = engine.getTask('direction', 3);
assert.equal(engine.check(q4, { magnitude: '10', angle: '-36.9' }).correct, true,
  'Equivalent clockwise angle should be accepted');

const products = engine.getTask('products', 0);
assert.equal(products.answers.dot, 5);
assert.equal(products.answers.cross, -14);
assert.equal(engine.check(products, { dot: '5', cross: '-14' }).correct, true);
assert.equal(engine.check(products, { dot: '5', cross: '14' }).correct, false,
  'Reversing the cross-product sign must fail');
assert.equal(engine.getTask('products', 3).answers.dot, 0);
assert.equal(engine.getTask('products', 3).answers.cross, 12);
assert.equal(engine.getTask('products', 11).answers.cross, 0);

const at0 = engine.explore(5, 4, 0), at45 = engine.explore(5, 4, 45);
const at90 = engine.explore(5, 4, 90), at135 = engine.explore(5, 4, 135);
const at180 = engine.explore(5, 4, 180);
near(at0.dot, 20); near(at0.crossMagnitude, 0);
near(at90.dot, 0); near(at90.crossMagnitude, 20);
near(at180.dot, -20); near(at180.crossMagnitude, 0);
near(Math.abs(at45.dot), at45.crossMagnitude);
near(Math.abs(at135.dot), at135.crossMagnitude);
assert.ok(at45.dot > 0 && at135.dot < 0, '45° and 135° dot sign must differ');
assert.throws(() => engine.explore(0, 4, 45));
assert.throws(() => engine.explore(5, 4, 181));

const allClientCode = html + '\n' + ui + '\n' + mathCode;
for (const forbidden of [
  /\blocalStorage\b/i, /\bsessionStorage\b/i, /\bindexedDB\b/i,
  /\bXMLHttpRequest\b/i, /\bfetch\s*\(/i, /\bFirebase\b/i,
  /\bFirestore\b/i, /\bWebSocket\b/i, /\bsendBeacon\b/i
]) assert.ok(!forbidden.test(allClientCode), 'Unexpected persistence/network marker: ' + forbidden);
assert.ok(!ui.includes('innerHTML'), 'UI should not use HTML string injection for challenge data');

console.log('PASS — 36 vector challenge cases, numeric parsing, signed products, quadrants, angle equivalence, 45°/135° concept and public privacy boundaries.');
console.log('PASS — Accessible HTML IDs, official unchanged logo reference, Unit 2 catalogue link and enrolled lesson references.');
console.log('NOTE — This is structural/mathematical verification, not live-browser usability testing or FBISE certification.');
