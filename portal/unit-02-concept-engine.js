/* Physics with Sir Najam — Grade XI Unit 2 self-check maths.
 * Original generated problems based on the Unit 2 vector SLOs.
 * Public self-practice only; no stored grades, authentication, or secure exam claims.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PSNVectorMastery = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  const bank = Object.freeze({
    components: Object.freeze([
      [10, 30], [20, 60], [12, 120], [16, 210], [10, 315], [8, 150],
      [15, 225], [25, 0], [18, 90], [12, 270], [30, 330], [15, 135]
    ]),
    direction: Object.freeze([
      [3, 4], [-6, 8], [-5, -12], [8, -6], [5, 12], [-8, 15],
      [0, -9], [-7, 0], [-12, -5], [9, 0], [-9, 12], [6, -8]
    ]),
    products: Object.freeze([
      [[2, 3], [4, -1]], [[1, 2], [3, 4]], [[3, -2], [1, 5]],
      [[4, 0], [0, 3]], [[-2, 4], [3, 1]], [[5, 1], [2, 4]],
      [[-3, -4], [2, -1]], [[2, -1], [-3, -2]], [[-1, 3], [2, 5]],
      [[4, 3], [-2, 6]], [[0, 5], [-2, 0]], [[3, 4], [6, 8]]
    ])
  });

  const pi = Math.PI;
  const rad = degrees => degrees * pi / 180;
  const fmt = (value, digits = 1) => {
    const rounded = Number(value.toFixed(digits));
    return Object.is(rounded, -0) ? '0' : String(rounded);
  };
  const vectorText = (x, y) => '(' + x + ', ' + y + ')';
  const polarAngle = (x, y) => (Math.atan2(y, x) * 180 / pi + 360) % 360;
  const vectorLength = (x, y) => Math.hypot(x, y);
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const crossZ = (a, b) => a[0] * b[1] - a[1] * b[0];

  function getTask(mode, position = 0) {
    if (!Object.prototype.hasOwnProperty.call(bank, mode)) throw Error('Unknown revision mode');
    if (!Number.isSafeInteger(position) || position < 0) throw Error('Invalid challenge index');
    const i = position % bank[mode].length;
    const common = {
      id: 'U02-' + mode.toUpperCase() + '-' + String(i + 1).padStart(2, '0'),
      mode, index: i,
      assessment: 'practice-only',
      units: 'Grade XI · Unit 2',
    };
    if (mode === 'components') {
      const [magnitude, angle] = bank.components[i];
      const x = magnitude * Math.cos(rad(angle));
      const y = magnitude * Math.sin(rad(angle));
      return {
        ...common,
        slo: 'P-11-B-01',
        question: 'A force of ' + magnitude + ' N acts at ' + angle + '° measured anticlockwise from the positive x-axis. Find both rectangular components to one decimal place.',
        inputs: [
          { key: 'x', label: 'Horizontal component Fₓ', suffix: 'N', tolerance: 0.11 },
          { key: 'y', label: 'Vertical component Fᵧ', suffix: 'N', tolerance: 0.11 }
        ],
        answers: { x, y },
        plot: { vectors: [[x, y]], names: ['F'] },
        hint: 'Fₓ = F cos θ and Fᵧ = F sin θ. Use the full angle measured from +x, and check each sign.',
        steps: [
          'Given F = ' + magnitude + ' N and θ = ' + angle + '°.',
          'Fₓ = F cos θ = ' + magnitude + ' cos ' + angle + '° = ' + fmt(x) + ' N.',
          'Fᵧ = F sin θ = ' + magnitude + ' sin ' + angle + '° = ' + fmt(y) + ' N.',
          'Components: (' + fmt(x) + ' N, ' + fmt(y) + ' N).'
        ]
      };
    }
    if (mode === 'direction') {
      const [x, y] = bank.direction[i];
      const magnitude = vectorLength(x, y);
      const angle = polarAngle(x, y);
      return {
        ...common,
        slo: 'P-11-B-01',
        question: 'A two-dimensional vector is A⃗ = ' + vectorText(x, y) + ' in Cartesian components. Find its magnitude and direction measured anticlockwise from +x, to one decimal place.',
        inputs: [
          { key: 'magnitude', label: 'Magnitude |A⃗|', suffix: 'units', tolerance: 0.11 },
          { key: 'angle', label: 'Direction θ from +x', suffix: 'degrees', tolerance: 0.26, periodic: 360 }
        ],
        answers: { magnitude, angle },
        plot: { vectors: [[x, y]], names: ['A'] },
        hint: '|A⃗| = √(Aₓ² + Aᵧ²); use atan2(y, x), or obtain a reference angle and then correct for the signs/quadrant.',
        steps: [
          'Components: Aₓ = ' + x + ', Aᵧ = ' + y + '.',
          '|A⃗| = √[(' + x + ')² + (' + y + ')²] = ' + fmt(magnitude) + ' units.',
          'θ = atan2(' + y + ', ' + x + ') with the quadrant correctly chosen.',
          'θ = ' + fmt(angle) + '° anticlockwise from +x. Equivalent negative/360°-shifted angles are also accepted.'
        ]
      };
    }
    const [a, b] = bank.products[i];
    const dotResult = dot(a, b);
    const crossResult = crossZ(a, b);
    return {
      ...common,
      slo: 'P-11-B-02',
      question: 'Two vectors in the xy-plane have components A⃗ = ' + vectorText(a[0], a[1]) + ' and B⃗ = ' + vectorText(b[0], b[1]) + '. Find (1) their scalar product and (2) the signed coefficient of k̂ in A⃗ × B⃗.',
      inputs: [
        { key: 'dot', label: 'Dot product A⃗ · B⃗', suffix: 'scalar', tolerance: 0.01 },
        { key: 'cross', label: 'k̂ coefficient in A⃗ × B⃗', suffix: 'signed value', tolerance: 0.01 }
      ],
      answers: { dot: dotResult, cross: crossResult },
      plot: { vectors: [a, b], names: ['A', 'B'] },
      hint: 'Dot = AₓBₓ + AᵧBᵧ. Signed cross-product k̂ coefficient = AₓBᵧ − AᵧBₓ. Keep the specified A × B order.',
      steps: [
        'A⃗ = ' + vectorText(a[0], a[1]) + ', B⃗ = ' + vectorText(b[0], b[1]) + '.',
        'A⃗ · B⃗ = (' + a[0] + ')(' + b[0] + ') + (' + a[1] + ')(' + b[1] + ') = ' + dotResult + '.',
        'A⃗ × B⃗ = [(' + a[0] + ')(' + b[1] + ') − (' + a[1] + ')(' + b[0] + ')]k̂ = ' + crossResult + 'k̂.',
        'The signed k̂ coefficient is ' + crossResult + '. Reversing the vector order changes the cross-product sign.'
      ]
    };
  }

  function parseNumber(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value !== 'string') return null;
    const s = value.trim();
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(s)) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function equalWithin(actual, expected, tolerance, periodic) {
    let difference = Math.abs(actual - expected);
    if (periodic) {
      const wrapped = ((actual - expected) % periodic + periodic) % periodic;
      difference = Math.min(wrapped, periodic - wrapped);
    }
    return difference <= tolerance + 1e-9;
  }

  function check(task, values) {
    if (!task || !Array.isArray(task.inputs) || !task.answers) throw Error('Invalid task');
    const fields = task.inputs.map(input => {
      const value = parseNumber(values && values[input.key]);
      return {
        key: input.key,
        complete: value !== null,
        correct: value !== null &&
          equalWithin(value, task.answers[input.key], input.tolerance, input.periodic)
      };
    });
    return {
      complete: fields.every(field => field.complete),
      correct: fields.every(field => field.correct),
      fields
    };
  }

  function explore(a, b, angleDegrees) {
    if (![a, b, angleDegrees].every(Number.isFinite) ||
        a <= 0 || b <= 0 || angleDegrees < 0 || angleDegrees > 180) {
      throw Error('Explorer magnitude or angle outside allowed range');
    }
    return {
      dot: a * b * Math.cos(rad(angleDegrees)),
      crossMagnitude: a * b * Math.sin(rad(angleDegrees)),
      angleDegrees
    };
  }

  return Object.freeze({
    modes: Object.freeze(['components', 'direction', 'products']),
    caseCount: mode => {
      if (!Object.prototype.hasOwnProperty.call(bank, mode)) throw Error('Unknown revision mode');
      return bank[mode].length;
    },
    getTask, parseNumber, check, explore, fmt, dot, crossZ, polarAngle
  });
});
